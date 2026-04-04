<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $users = User::query()
            ->where('role', 'user')
            ->get(['id', 'name', 'email', 'role', 'age', 'gender', 'height', 'weight', 'created_at', 'updated_at']);

        return response()->json([
            'status' => 200,
            'data' => $users->map(fn (User $u) => [
                'id' => (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'age' => $u->age,
                'gender' => $u->gender,
                'height' => $u->height,
                'weight' => $u->weight,
                'createdAt' => $u->created_at,
                'updatedAt' => $u->updated_at,
            ])->values()->all(),
        ]);
    }
}
