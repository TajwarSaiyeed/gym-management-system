<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Models\Fee;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\StripeClient;

class FeePageController extends Controller
{
    public function adminIndex(Request $request): Response
    {
        $fees = Fee::query()->orderByDesc('created_at')->get();
        $income = (int) $fees->filter(fn (Fee $f) => $f->is_paid && $f->transaction_id)->sum('amount');
        $unpaid = (int) $fees->filter(fn (Fee $f) => ! $f->is_paid || ! $f->transaction_id)->sum('amount');

        $students = User::query()->where('role', 'user')->orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Gym/FeesAdmin', [
            'fees' => $fees->map(fn (Fee $f) => $this->mapFee($f))->values()->all(),
            'summary' => ['income' => $income, 'unpaid' => $unpaid],
            'students' => $students->map(fn (User $s) => [
                'id' => (string) $s->id,
                'name' => $s->name,
                'email' => $s->email,
            ]),
        ]);
    }

    public function adminStore(Request $request): RedirectResponse
    {
        $body = $request->validate([
            'email' => ['required', 'email'],
            'amount' => ['required', 'integer', 'min:1'],
            'month' => ['required', 'string'],
            'year' => ['required', 'string'],
            'message' => ['nullable', 'string'],
        ]);

        $user = User::query()->where('email', $body['email'])->first();

        if (! $user) {
            return back()->withErrors(['email' => 'User not found']);
        }

        if (Fee::query()->where('email', $body['email'])->where('month', $body['month'])->where('year', $body['year'])->exists()) {
            return back()->withErrors(['month' => 'Fees already exist for this period']);
        }

        $fee = Fee::create([
            'email' => $body['email'],
            'month' => $body['month'],
            'year' => $body['year'],
            'message' => $body['message'] ?? '',
            'amount' => $body['amount'],
        ]);

        Notification::create([
            'user_email' => $user->email,
            'sender_id' => $request->user()->id,
            'type' => 'fees',
            'user_id' => $user->id,
            'notification_text' => $body['message'] ?? 'New fee',
            'path_name' => '/user/fees',
            'read' => false,
        ]);

        return back()->with('success', "Fees for {$body['month']} {$body['year']} added");
    }

    public function studentIndex(Request $request): Response
    {
        $fees = Fee::query()->where('email', $request->user()->email)->orderByDesc('created_at')->get();
        $paid = (int) $fees->where('is_paid', true)->sum('amount');
        $unpaid = (int) $fees->where('is_paid', false)->sum('amount');

        return Inertia::render('Gym/StudentFees', [
            'fees' => $fees->map(fn (Fee $f) => $this->mapFee($f))->values()->all(),
            'summary' => ['paid' => $paid, 'unpaid' => $unpaid],
        ]);
    }

    public function checkout(Request $request): RedirectResponse|\Symfony\Component\HttpFoundation\Response
    {
        $body = $request->validate([
            'feeId' => ['required', 'string'],
            'amount' => ['required', 'integer', 'min:1'],
            'month' => ['required', 'string'],
            'year' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $fee = Fee::query()->find($body['feeId']);

        if (! $fee || $fee->email !== $request->user()->email || $fee->is_paid) {
            return back()->withErrors(['pay' => 'Invalid fee']);
        }

        $secret = config('services.stripe.secret');
        if (! $secret) {
            return back()->withErrors(['pay' => 'Stripe is not configured']);
        }

        $stripe = new StripeClient($secret);
        $origin = $request->getSchemeAndHttpHost();

        $session = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'billing_address_collection' => 'required',
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => ['name' => 'Fee of '.$body['month']],
                    'unit_amount' => $body['amount'] * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $origin.'/user/fees/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $origin.'/user/fees',
            'customer_email' => $request->user()->email,
            'client_reference_id' => (string) $fee->id,
            'metadata' => [
                'feeId' => (string) $fee->id,
                'month' => $body['month'],
                'year' => $body['year'],
            ],
        ]);

        return Inertia::location($session->url);
    }

    public function paymentSuccess(Request $request): Response|RedirectResponse
    {
        $sessionId = $request->query('session_id');
        if (! $sessionId || ! str_starts_with($sessionId, 'cs_')) {
            return redirect()->route('gym.student.fees')->withErrors(['pay' => 'Invalid session']);
        }

        $secret = config('services.stripe.secret');
        if (! $secret) {
            return redirect()->route('gym.student.fees')->withErrors(['pay' => 'Stripe not configured']);
        }

        $stripe = new StripeClient($secret);
        $checkoutSession = $stripe->checkout->sessions->retrieve($sessionId, [
            'expand' => ['payment_intent'],
        ]);

        if ($checkoutSession->customer_email !== $request->user()->email) {
            abort(403);
        }

        $feeId = $checkoutSession->client_reference_id;
        $fee = Fee::query()->find($feeId);

        if (! $fee || $fee->is_paid) {
            return redirect()->route('gym.student.fees')->withErrors(['pay' => 'Fee not found or already paid']);
        }

        if ($checkoutSession->payment_status === 'paid') {
            $pi = $checkoutSession->payment_intent;
            $transactionId = is_object($pi) && isset($pi->id) ? $pi->id : (is_string($pi) ? $pi : null);

            $fee->update([
                'is_paid' => true,
                'transaction_id' => $transactionId,
                'payment_date' => now(),
            ]);
        }

        return Inertia::render('Gym/FeePaymentSuccess', [
            'fee' => $this->mapFee($fee->fresh()),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapFee(Fee $fee): array
    {
        return [
            'id' => (string) $fee->id,
            'email' => $fee->email,
            'month' => $fee->month,
            'year' => $fee->year,
            'message' => $fee->message,
            'amount' => $fee->amount,
            'isPaid' => $fee->is_paid,
            'transactionId' => $fee->transaction_id,
            'paymentDate' => $fee->payment_date,
        ];
    }
}
