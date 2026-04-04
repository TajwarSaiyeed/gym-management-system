<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fee;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class FeeController extends Controller
{
    public function store(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $body = $request->validate([
            'email' => ['required', 'email'],
            'amount' => ['required', 'integer'],
            'month' => ['required', 'string'],
            'year' => ['required', 'string'],
            'message' => ['nullable', 'string'],
        ]);

        $user = User::query()->where('email', $body['email'])->first();

        if (! $user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if (Fee::query()->where('email', $body['email'])->where('month', $body['month'])->where('year', $body['year'])->exists()) {
            return response()->json(['error' => 'Fees already exists'], 400);
        }

        $fees = Fee::create([
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
            'notification_text' => $body['message'] ?? '',
            'path_name' => '/user/fees',
            'read' => false,
        ]);

        return response()->json([
            'data' => $this->mapFee($fees),
            'message' => "Fees for the month of {$body['month']} {$body['year']} added successfully",
        ], 201);
    }

    public function adminIndex(Request $request)
    {
        if (! $request->user()->email) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $fees = Fee::query()->get();

        $income = 0;
        $unpaid = 0;
        foreach ($fees as $fee) {
            if ($fee->is_paid && $fee->transaction_id) {
                $income += $fee->amount;
            } else {
                $unpaid += $fee->amount;
            }
        }

        if ($fees->isEmpty()) {
            return response()->json(['fees' => []], 200);
        }

        return response()->json([
            'fees' => $fees->map(fn (Fee $f) => $this->mapFee($f))->values()->all(),
            'income' => $income,
            'unpaid' => $unpaid,
        ], 200);
    }

    public function studentIndex(Request $request)
    {
        if ($request->user()->role !== 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $fees = Fee::query()->where('email', $request->user()->email)->get();

        $paid = 0;
        $unpaid = 0;
        foreach ($fees as $fee) {
            if ($fee->is_paid) {
                $paid += $fee->amount;
            } else {
                $unpaid += $fee->amount;
            }
        }

        if ($fees->isEmpty()) {
            return response()->json(['fees' => []], 200);
        }

        return response()->json([
            'fees' => $fees->map(fn (Fee $f) => $this->mapFee($f))->values()->all(),
            'paid' => $paid,
            'unpaid' => $unpaid,
        ], 200);
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
            'createdAt' => $fee->created_at,
            'updatedAt' => $fee->updated_at,
        ];
    }
}
