<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Diet;
use App\Models\Notification;
use App\Models\PeriodWithFoodList;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DietAssignController extends Controller
{
    public function store(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $body = $request->validate([
            'selectedStudents' => ['required', 'array'],
            'selectedStudents.*' => ['string'],
            'dietFoodsArray' => ['required', 'array'],
            'fromDate' => ['required', 'date'],
            'toDate' => ['required', 'date'],
        ]);

        $students = User::query()->whereIn('id', $body['selectedStudents'])->get();

        DB::transaction(function () use ($students, $body, $request) {
            foreach ($students as $student) {
                $diet = Diet::query()->where('student_id', $student->id)->first();

                if ($diet) {
                    PeriodWithFoodList::query()->where('diet_assignment_id', $diet->id)->delete();
                    $diet->update([
                        'from_date' => $body['fromDate'],
                        'to_date' => $body['toDate'],
                    ]);
                    foreach ($body['dietFoodsArray'] as $dietFood) {
                        PeriodWithFoodList::create([
                            'diet_food_id' => (string) ($dietFood['id'] ?? ''),
                            'diet_food_name' => $dietFood['dietFoodName'] ?? '',
                            'breakfast' => (bool) ($dietFood['breakfast'] ?? false),
                            'morning_meal' => (bool) ($dietFood['morningMeal'] ?? false),
                            'lunch' => (bool) ($dietFood['lunch'] ?? false),
                            'evening_snack' => (bool) ($dietFood['eveningSnack'] ?? false),
                            'dinner' => (bool) ($dietFood['dinner'] ?? false),
                            'diet_assignment_id' => $diet->id,
                        ]);
                    }
                } else {
                    $diet = Diet::create([
                        'student_id' => $student->id,
                        'from_date' => $body['fromDate'],
                        'to_date' => $body['toDate'],
                    ]);
                    foreach ($body['dietFoodsArray'] as $dietFood) {
                        PeriodWithFoodList::create([
                            'diet_food_id' => (string) ($dietFood['id'] ?? ''),
                            'diet_food_name' => $dietFood['dietFoodName'] ?? '',
                            'breakfast' => (bool) ($dietFood['breakfast'] ?? false),
                            'morning_meal' => (bool) ($dietFood['morningMeal'] ?? false),
                            'lunch' => (bool) ($dietFood['lunch'] ?? false),
                            'evening_snack' => (bool) ($dietFood['eveningSnack'] ?? false),
                            'dinner' => (bool) ($dietFood['dinner'] ?? false),
                            'diet_assignment_id' => $diet->id,
                        ]);
                    }
                }

                Notification::create([
                    'user_id' => $student->id,
                    'user_email' => $student->email,
                    'sender_id' => $request->user()->id,
                    'type' => 'diet',
                    'notification_text' => 'You have a new diet.',
                    'path_name' => '/user/diet',
                    'read' => false,
                ]);
            }
        });

        return response()->json(['message' => 'Diet Assigned Successfully'], 200);
    }
}
