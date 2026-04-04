<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        if ($request->user()->role !== 'user') {
            return response()->json(['error' => 'Not authorized'], 401);
        }

        $body = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'description' => ['required', 'string'],
            'email' => ['required', 'email'],
            'feeId' => ['required', 'string'],
            'month' => ['required', 'string'],
            'year' => ['required', 'string'],
        ]);

        $secret = config('services.stripe.secret');
        if (! $secret) {
            return response()->json(['error' => 'Stripe is not configured'], 500);
        }

        $stripe = new StripeClient($secret);

        $origin = $request->header('Origin') ?: config('app.url');

        $stripeSession = $stripe->checkout->sessions->create([
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
            'submit_type' => 'pay',
            'mode' => 'payment',
            'success_url' => rtrim($origin, '/').'/user/fees/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => rtrim($origin, '/').'/user/fees?canceled=true',
            'customer_email' => $body['email'],
            'client_reference_id' => $body['feeId'],
            'metadata' => [
                'month' => $body['month'],
                'year' => $body['year'],
                'description' => $body['description'],
                'email' => $body['email'],
                'feeId' => $body['feeId'],
            ],
        ]);

        return response()->json(['stripeSession' => $stripeSession->toArray()], 200);
    }

    public function sessionStatus(Request $request, string $sessionId)
    {
        if ($request->user()->role !== 'user') {
            return response()->json(['error' => 'Not authorized'], 401);
        }

        if (! str_starts_with($sessionId, 'cs_')) {
            return response()->json(['error' => 'Invalid session id'], 400);
        }

        $secret = config('services.stripe.secret');
        if (! $secret) {
            return response()->json(['error' => 'Stripe is not configured'], 500);
        }

        $stripe = new StripeClient($secret);

        $checkoutSession = $stripe->checkout->sessions->retrieve($sessionId, [
            'expand' => ['payment_intent'],
        ]);

        if ($checkoutSession->customer_email !== $request->user()->email) {
            return response()->json(['error' => 'Not authorized'], 401);
        }

        $feeId = $checkoutSession->client_reference_id;
        if (! $feeId) {
            return response()->json(['error' => 'Fee not found'], 404);
        }

        $fee = Fee::query()->find($feeId);

        if (! $fee) {
            return response()->json(['error' => 'Fee not found'], 404);
        }

        if ($fee->is_paid) {
            return response()->json(['error' => 'Fee already paid'], 400);
        }

        if ($checkoutSession->payment_status === 'paid') {
            $pi = $checkoutSession->payment_intent;
            $transactionId = is_object($pi) && isset($pi->id) ? $pi->id : (is_string($pi) ? $pi : null);

            $fee->update([
                'is_paid' => true,
                'transaction_id' => $transactionId,
                'payment_date' => Carbon::createFromTimestamp($checkoutSession->created),
            ]);

            return response()->json([
                'checkoutSession' => $checkoutSession->toArray(),
                'feeUpdate' => $this->mapFee($fee->fresh()),
            ], 200);
        }

        return response()->json(['error' => 'Payment not completed'], 400);
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
