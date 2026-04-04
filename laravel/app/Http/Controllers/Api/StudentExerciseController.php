<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class StudentExerciseController extends Controller
{
    public function show(Request $request)
    {
        if ($request->user()->role !== 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $row = Exercise::query()
            ->where('student_id', $request->user()->id)
            ->with('exercises')
            ->first();

        if (! $row) {
            return response()->json([
                'title' => 'No exercises found',
                'subTitle' => 'You have not submitted any exercises yet.',
            ], 404);
        }

        return response()->json(['data' => $this->mapExercise($row)], 200);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapExercise(Exercise $e): array
    {
        return [
            'id' => (string) $e->id,
            'studentId' => (string) $e->student_id,
            'fromDate' => $e->from_date,
            'toDate' => $e->to_date,
            'createdAt' => $e->created_at,
            'updatedAt' => $e->updated_at,
            'exercises' => $e->exercises->map(fn ($w) => [
                'id' => (string) $w->id,
                'exerciseId' => $w->exercise_id,
                'exerciseName' => $w->exercise_name,
                'sets' => $w->sets,
                'steps' => $w->steps,
                'kg' => $w->kg,
                'rest' => $w->rest,
                'createdAt' => $w->created_at,
                'updatedAt' => $w->updated_at,
            ])->values()->all(),
        ];
    }
}
