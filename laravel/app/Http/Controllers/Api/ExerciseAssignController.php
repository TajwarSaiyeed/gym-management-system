<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\Notification;
use App\Models\User;
use App\Models\WorkOut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExerciseAssignController extends Controller
{
    public function store(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $body = $request->validate([
            'selectedStudents' => ['required', 'array'],
            'selectedStudents.*' => ['string'],
            'workOutArray' => ['required', 'array'],
            'fromDate' => ['required', 'date'],
            'toDate' => ['required', 'date'],
        ]);

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
                            'exercise_name' => $workOut['exerciseName'] ?? '',
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
                            'exercise_name' => $workOut['exerciseName'] ?? '',
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

        return response()->json(['message' => 'Workout assigned successfully'], 200);
    }
}
