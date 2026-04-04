<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = User::query()->where('email', $request->user()->email)->first();

        if (! $user) {
            return response()->json(['error' => 'No user found'], 400);
        }

        return response()->json(['data' => new UserResource($user)], 200);
    }
}
