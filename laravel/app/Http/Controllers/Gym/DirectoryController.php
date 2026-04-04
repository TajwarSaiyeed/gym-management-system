<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DirectoryController extends Controller
{
    public function trainers(Request $request): Response
    {
        $trainers = User::query()
            ->where('role', 'trainer')
            ->orderBy('name')
            ->get();

        return Inertia::render('Gym/Trainers', [
            'trainers' => $trainers->map(fn (User $u) => (new UserResource($u))->resolve())->values()->all(),
        ]);
    }

    public function trainerShow(Request $request, User $trainer): Response
    {
        if ($trainer->role !== 'trainer') {
            abort(404);
        }

        return Inertia::render('Gym/TrainerShow', [
            'trainer' => (new UserResource($trainer))->resolve(),
        ]);
    }

    public function students(Request $request): Response
    {
        if ($request->user()->role === 'user') {
            abort(403);
        }

        $students = User::query()
            ->where('role', 'user')
            ->orderBy('name')
            ->get();

        return Inertia::render('Gym/Students', [
            'students' => $students->map(fn (User $u) => (new UserResource($u))->resolve())->values()->all(),
        ]);
    }

    public function studentShow(Request $request, User $student): Response
    {
        if ($request->user()->role === 'user') {
            abort(403);
        }

        if ($student->role !== 'user') {
            abort(404);
        }

        return Inertia::render('Gym/StudentShow', [
            'student' => (new UserResource($student))->resolve(),
        ]);
    }
}
