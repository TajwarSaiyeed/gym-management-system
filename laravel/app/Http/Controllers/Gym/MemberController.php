<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function create(Request $request): Response
    {
        $trainers = User::query()
            ->where('role', 'trainer')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Gym/AddMember', [
            'trainers' => $trainers->map(fn (User $t) => [
                'id' => (string) $t->id,
                'name' => $t->name,
                'email' => $t->email,
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $sessionUser = $request->user();

        $body = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:6'],
            'name' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'role' => ['required', Rule::in(['admin', 'trainer', 'user'])],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'age' => ['nullable', 'integer', 'min:1'],
            'goal' => ['nullable', 'string'],
            'level' => ['nullable', Rule::in(['beginner', 'intermediate', 'advanced', 'expert', 'professional'])],
            'weight' => ['nullable', 'integer'],
            'height' => ['nullable', 'integer'],
            'trainerId' => ['nullable', 'string'],
        ]);

        if ($sessionUser->role === 'user') {
            abort(403);
        }

        if (User::query()->where('email', $body['email'])->exists()) {
            return back()->withErrors(['email' => 'User already exists']);
        }

        if ($sessionUser->role === $body['role']) {
            return back()->withErrors(['role' => "You can't add an {$body['role']}"]);
        }

        if ($sessionUser->role === 'trainer' && $body['role'] !== 'user') {
            return back()->withErrors(['role' => 'Trainers may only add students']);
        }

        $goal = isset($body['goal']) ? str_replace(' ', '_', strtolower($body['goal'])) : 'lose_weight';

        $adminAccount = User::query()->where('role', 'admin')->first();

        User::create([
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

        return redirect()->route('gym.trainers')->with('success', 'User created successfully');
    }

    public function manage(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', 10);
        $page = (int) $request->query('page', 1);
        $users = User::query()
            ->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        $trainers = User::query()->where('role', 'trainer')->orderBy('name')->get();

        return Inertia::render('Gym/ManageUsers', [
            'userList' => [
                'data' => collect($users->items())->map(fn (User $u) => (new UserResource($u))->resolve())->values()->all(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ],
            ],
            'trainers' => $trainers->map(fn (User $t) => [
                'id' => (string) $t->id,
                'name' => $t->name,
                'email' => $t->email,
            ]),
        ]);
    }

    public function assignTrainer(Request $request): RedirectResponse
    {
        $body = $request->validate([
            'trainerId' => ['required', 'string'],
            'userId' => ['required', 'string'],
        ]);

        if ($request->user()->role !== 'admin') {
            abort(403);
        }

        $user = User::query()->find($body['userId']);
        $trainer = User::query()->find($body['trainerId']);

        if (! $user || ! $trainer) {
            return back()->withErrors(['trainer' => 'Invalid user or trainer']);
        }

        $user->update(['trainer_id' => $trainer->id]);

        return back()->with('success', 'Trainer assigned');
    }
}
