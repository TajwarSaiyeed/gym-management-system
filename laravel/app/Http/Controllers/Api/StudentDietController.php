<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Diet;
use Illuminate\Http\Request;

class StudentDietController extends Controller
{
    public function show(Request $request)
    {
        if ($request->user()->role !== 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $row = Diet::query()
            ->where('student_id', $request->user()->id)
            ->with('periodWithFoodList')
            ->first();

        if (! $row) {
            return response()->json([
                'title' => 'No diets found',
                'subTitle' => 'You have not submitted any diets yet.',
            ], 404);
        }

        return response()->json(['data' => $this->mapDiet($row)], 200);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapDiet(Diet $d): array
    {
        return [
            'id' => (string) $d->id,
            'studentId' => (string) $d->student_id,
            'fromDate' => $d->from_date,
            'toDate' => $d->to_date,
            'createdAt' => $d->created_at,
            'updatedAt' => $d->updated_at,
            'periodWithFoodList' => $d->periodWithFoodList->map(fn ($p) => [
                'id' => (string) $p->id,
                'dietFoodId' => $p->diet_food_id,
                'dietFoodName' => $p->diet_food_name,
                'breakfast' => $p->breakfast,
                'morningMeal' => $p->morning_meal,
                'lunch' => $p->lunch,
                'eveningSnack' => $p->evening_snack,
                'dinner' => $p->dinner,
                'dietAssignmentId' => (string) $p->diet_assignment_id,
                'createdAt' => $p->created_at,
                'updatedAt' => $p->updated_at,
            ])->values()->all(),
        ];
    }
}
