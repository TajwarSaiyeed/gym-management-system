<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $page = max(1, (int) $request->query('page', 1));
        $limit = (int) $request->query('limit', 10);
        if ($limit < 1) {
            $limit = 10;
        }

        $users = User::query()
            ->orderBy('id')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();

        $count = User::query()->count();
        $pages = (int) max(1, ceil($count / $limit));

        $onlineUsers = $users->where('is_active', true)->count();
        $students = $users->where('role', 'user')->count();
        $trainers = $users->where('role', 'trainer')->count();

        return response()->json([
            'status' => 200,
            'data' => UserResource::collection($users),
            'onlineUsers' => $onlineUsers,
            'students' => $students,
            'trainers' => $trainers,
            'count' => $count,
            'pages' => $pages,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'next' => min($page + 1, $pages),
                'previous' => max($page - 1, 1),
                'first' => 1,
                'last' => $pages,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $sessionUser = $request->user();

        if (! $sessionUser->email) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        if ($sessionUser->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $body = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'name' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'role' => ['required', Rule::in(['admin', 'trainer', 'user'])],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'age' => ['nullable', 'integer'],
            'goal' => ['nullable', 'string'],
            'level' => ['nullable', Rule::in(['beginner', 'intermediate', 'advanced', 'expert', 'professional'])],
            'weight' => ['nullable', 'integer'],
            'height' => ['nullable', 'integer'],
            'trainerId' => ['nullable', 'string'],
        ]);

        if (User::query()->where('email', $body['email'])->exists()) {
            return response()->json(['error' => 'User already exists'], 409);
        }

        if ($sessionUser->role === $body['role']) {
            return response()->json(['error' => "You can't add an {$body['role']}"], 503);
        }

        $goal = isset($body['goal']) ? str_replace(' ', '_', strtolower($body['goal'])) : 'lose_weight';

        $adminAccount = User::query()->where('role', 'admin')->first();

        $user = User::create([
            'name' => $body['name'] ?? '',
            'email' => $body['email'],
            'image' => $body['image'] ?? null,
            'role' => $body['role'],
            'password' => $body['password'],
            'gender' => $body['gender'],
            'age' => $body['age'] ?? 18,
            'goal' => $goal,
            'level' => $body['level'] ?? 'beginner',
            'weight' => $body['weight'] ?? 50,
            'height' => $body['height'] ?? 100,
            'admin_id' => $adminAccount?->id,
            'trainer_id' => isset($body['trainerId']) ? (int) $body['trainerId'] : null,
        ]);

        return response()->json([
            'status' => 201,
            'data' => new UserResource($user),
        ], 201);
    }

    public function update(Request $request)
    {
        $sessionUser = $request->user();

        if (! $sessionUser) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }

        $body = $request->all();

        if ($sessionUser->role === 'admin'
            && ! empty($body['trainerId'])
            && ! empty($body['userId'])
            && $body['trainerId'] !== $body['userId']
        ) {
            $user = User::query()->find($body['userId']);
            $trainer = User::query()->find($body['trainerId']);

            if (! $user || ! $trainer) {
                return response()->json(['error' => 'No user or trainer found in the list!!!'], 400);
            }

            $user->update(['trainer_id' => $trainer->id]);

            return response()->json(['message' => 'User updated successfully'], 201);
        }

        if ($sessionUser->role === 'trainer'
            && ! empty($body['trainerId'])
            && ! empty($body['userId'])
            && $body['trainerId'] !== $body['userId']
        ) {
            return response()->json(['error' => "You can't update the trainer"], 400);
        }

        if ($sessionUser->role === 'user'
            && ! empty($body['trainerId'])
            && ! empty($body['userId'])
            && $body['trainerId'] !== $body['userId']
        ) {
            return response()->json(['error' => "You can't update the trainer"], 400);
        }

        if (! empty($body['email'])) {
            return response()->json(['error' => "You can't update the email"], 400);
        }

        if (! empty($body['role'])) {
            return response()->json(['error' => "You can't update the role"], 400);
        }

        $user = User::query()->find($sessionUser->id);

        if (! $user) {
            return response()->json(['error' => 'User not found'], 400);
        }

        $password = $user->password;
        if (! empty($body['password'])) {
            $password = Hash::make($body['password']);
        }

        $user->update([
            'name' => ($body['name'] ?? '') !== '' ? $body['name'] : $user->name,
            'image' => ($body['image'] ?? '') !== '' ? $body['image'] : $user->image,
            'age' => ($body['age'] ?? '') !== '' ? $body['age'] : $user->age,
            'weight' => ($body['weight'] ?? '') !== '' ? $body['weight'] : $user->weight,
            'height' => ($body['height'] ?? '') !== '' ? $body['height'] : $user->height,
            'goal' => ($body['goal'] ?? '') !== '' ? $body['goal'] : $user->goal,
            'level' => ($body['level'] ?? '') !== '' ? $body['level'] : $user->level,
            'password' => $password,
            'is_active' => $body['isActive'] ?? $body['is_active'] ?? $user->is_active,
        ]);

        return response()->json(['message' => 'Updated successfully'], 200);
    }
}
