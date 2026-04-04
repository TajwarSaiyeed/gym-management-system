<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class TrainerController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->where('role', 'trainer')
            ->get(['id', 'name', 'email', 'role', 'age', 'gender', 'created_at', 'updated_at']);

        if ($users->isEmpty()) {
            return response()->json(['status' => 200, 'data' => []]);
        }

        return response()->json([
            'status' => 200,
            'data' => $users->map(fn (User $u) => [
                'id' => (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'age' => $u->age,
                'gender' => $u->gender,
                'createdAt' => $u->created_at,
                'updatedAt' => $u->updated_at,
            ])->values()->all(),
        ]);
    }
}
