<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\ExerciseList;
use App\Models\Notification;
use App\Models\User;
use App\Models\WorkOut;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ExercisePageController extends Controller
{
    public function hub(): Response
    {
        return Inertia::render('Gym/ExerciseHub');
    }

    public function manageIndex(): Response
    {
        $items = ExerciseList::query()->orderBy('name')->get();

        return Inertia::render('Gym/ManageExercise', [
            'exercises' => $items->map(fn (ExerciseList $e) => [
                'id' => (string) $e->id,
                'name' => $e->name,
            ])->values()->all(),
        ]);
    }

    public function manageStore(Request $request): RedirectResponse
    {
        $data = $request->validate(['name' => ['required', 'string']]);

        if (ExerciseList::query()->where('name', $data['name'])->exists()) {
            return back()->withErrors(['name' => 'Exercise already exists']);
        }

        ExerciseList::create(['name' => $data['name']]);

        return back()->with('success', 'Exercise added');
    }

    public function manageDestroy(Request $request): RedirectResponse
    {
        $data = $request->validate(['id' => ['required', 'string']]);
        $row = ExerciseList::query()->find($data['id']);
        if ($row) {
            $row->delete();
        }

        return back()->with('success', 'Exercise removed');
    }

    public function assignForm(Request $request): Response
    {
        $students = User::query()->where('role', 'user')->orderBy('name')->get();
        $exercises = ExerciseList::query()->orderBy('name')->get();

        return Inertia::render('Gym/AssignExercise', [
            'students' => $students->map(fn (User $s) => [
                'id' => (string) $s->id,
                'name' => $s->name,
                'email' => $s->email,
            ]),
            'exerciseCatalog' => $exercises->map(fn (ExerciseList $e) => [
                'id' => (string) $e->id,
                'name' => $e->name,
            ]),
        ]);
    }

    public function assignStore(Request $request): RedirectResponse
    {
        $body = $request->validate([
            'selectedStudents' => ['required', 'array', 'min:1'],
            'selectedStudents.*' => ['string'],
            'workOutArray' => ['required', 'array', 'min:1'],
            'workOutArray.*.id' => ['nullable'],
            'workOutArray.*.exerciseName' => ['nullable', 'string'],
            'workOutArray.*.sets' => ['nullable', 'integer'],
            'workOutArray.*.steps' => ['nullable', 'integer'],
            'workOutArray.*.kg' => ['nullable', 'integer'],
            'workOutArray.*.rest' => ['nullable', 'integer'],
            'fromDate' => ['required', 'date'],
            'toDate' => ['required', 'date'],
        ]);

        $body['workOutArray'] = array_values(array_filter(
            $body['workOutArray'],
            fn (array $r) => ($r['exerciseName'] ?? '') !== '',
        ));

        if ($body['workOutArray'] === []) {
            return back()->withErrors(['workOutArray' => 'Add at least one exercise']);
        }

        $students = User::query()->whereIn('id', $body['selectedStudents'])->get();

        DB::transaction(function () use ($students, $body, $request) {
            foreach ($students as $student) {
                $assignment = Exercise::query()->where('student_id', $student->id)->first();

                if ($assignment) {
                    $assignment->workouts()->delete();
                    $assignment->update([
                        'from_date' => $body['fromDate'],
                        'to_date' => $body['toDate'],
                    ]);
                    foreach ($body['workOutArray'] as $workOut) {
                        WorkOut::create([
                            'exercise_id' => (string) ($workOut['id'] ?? ''),
                            'exercise_name' => $workOut['exerciseName'],
                            'sets' => (int) ($workOut['sets'] ?? 0),
                            'steps' => (int) ($workOut['steps'] ?? 0),
                            'kg' => (int) ($workOut['kg'] ?? 0),
                            'rest' => (int) ($workOut['rest'] ?? 0),
                            'exercise_assignment_id' => $assignment->id,
                        ]);
                    }
                } else {
                    $assignment = Exercise::create([
                        'student_id' => $student->id,
                        'from_date' => $body['fromDate'],
                        'to_date' => $body['toDate'],
                    ]);
                    foreach ($body['workOutArray'] as $workOut) {
                        WorkOut::create([
                            'exercise_id' => (string) ($workOut['id'] ?? ''),
                            'exercise_name' => $workOut['exerciseName'],
                            'sets' => (int) ($workOut['sets'] ?? 0),
                            'steps' => (int) ($workOut['steps'] ?? 0),
                            'kg' => (int) ($workOut['kg'] ?? 0),
                            'rest' => (int) ($workOut['rest'] ?? 0),
                            'exercise_assignment_id' => $assignment->id,
                        ]);
                    }
                }

                Notification::create([
                    'user_id' => $student->id,
                    'user_email' => $student->email,
                    'sender_id' => $request->user()->id,
                    'type' => 'exercise',
                    'notification_text' => 'You have a new exercise.',
                    'path_name' => '/user/exercise',
                    'read' => false,
                ]);
            }
        });

        return back()->with('success', 'Workout assigned');
    }

    public function studentExercise(Request $request): Response
    {
        $row = Exercise::query()
            ->where('student_id', $request->user()->id)
            ->with('exercises')
            ->first();

        return Inertia::render('Gym/StudentExercise', [
            'assignment' => $row ? [
                'id' => (string) $row->id,
                'fromDate' => $row->from_date,
                'toDate' => $row->to_date,
                'exercises' => $row->exercises->map(fn ($w) => [
                    'exerciseName' => $w->exercise_name,
                    'sets' => $w->sets,
                    'steps' => $w->steps,
                    'kg' => $w->kg,
                    'rest' => $w->rest,
                ])->values()->all(),
            ] : null,
        ]);
    }
}
