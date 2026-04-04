<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Models\Diet;
use App\Models\DietFoodList;
use App\Models\Notification;
use App\Models\PeriodWithFoodList;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DietPageController extends Controller
{
    public function hub(): Response
    {
        return Inertia::render('Gym/DietHub');
    }

    public function manageIndex(): Response
    {
        $items = DietFoodList::query()->orderBy('name')->get();

        return Inertia::render('Gym/ManageFoods', [
            'foods' => $items->map(fn (DietFoodList $e) => [
                'id' => (string) $e->id,
                'name' => $e->name,
            ])->values()->all(),
        ]);
    }

    public function manageStore(Request $request): RedirectResponse
    {
        $data = $request->validate(['name' => ['required', 'string']]);

        if (DietFoodList::query()->where('name', $data['name'])->exists()) {
            return back()->withErrors(['name' => 'Food already exists']);
        }

        DietFoodList::create(['name' => $data['name']]);

        return back()->with('success', 'Food added');
    }

    public function manageDestroy(Request $request): RedirectResponse
    {
        $data = $request->validate(['id' => ['required', 'string']]);
        $row = DietFoodList::query()->find($data['id']);
        if ($row) {
            $row->delete();
        }

        return back()->with('success', 'Food removed');
    }

    public function assignForm(Request $request): Response
    {
        $students = User::query()->where('role', 'user')->orderBy('name')->get();
        $foods = DietFoodList::query()->orderBy('name')->get();

        return Inertia::render('Gym/AssignDiet', [
            'students' => $students->map(fn (User $s) => [
                'id' => (string) $s->id,
                'name' => $s->name,
                'email' => $s->email,
            ]),
            'foods' => $foods->map(fn (DietFoodList $f) => [
                'id' => (string) $f->id,
                'name' => $f->name,
            ]),
        ]);
    }

    public function assignStore(Request $request): RedirectResponse
    {
        $body = $request->validate([
            'selectedStudents' => ['required', 'array', 'min:1'],
            'dietFoodsArray' => ['required', 'array', 'min:1'],
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
                    foreach ($body['dietFoodsArray'] as $item) {
                        PeriodWithFoodList::create([
                            'diet_food_id' => (string) ($item['id'] ?? ''),
                            'diet_food_name' => $item['dietFoodName'] ?? '',
                            'breakfast' => (bool) ($item['breakfast'] ?? false),
                            'morning_meal' => (bool) ($item['morningMeal'] ?? false),
                            'lunch' => (bool) ($item['lunch'] ?? false),
                            'evening_snack' => (bool) ($item['eveningSnack'] ?? false),
                            'dinner' => (bool) ($item['dinner'] ?? false),
                            'diet_assignment_id' => $diet->id,
                        ]);
                    }
                } else {
                    $diet = Diet::create([
                        'student_id' => $student->id,
                        'from_date' => $body['fromDate'],
                        'to_date' => $body['toDate'],
                    ]);
                    foreach ($body['dietFoodsArray'] as $item) {
                        PeriodWithFoodList::create([
                            'diet_food_id' => (string) ($item['id'] ?? ''),
                            'diet_food_name' => $item['dietFoodName'] ?? '',
                            'breakfast' => (bool) ($item['breakfast'] ?? false),
                            'morning_meal' => (bool) ($item['morningMeal'] ?? false),
                            'lunch' => (bool) ($item['lunch'] ?? false),
                            'evening_snack' => (bool) ($item['eveningSnack'] ?? false),
                            'dinner' => (bool) ($item['dinner'] ?? false),
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

        return back()->with('success', 'Diet assigned');
    }

    public function studentDiet(Request $request): Response
    {
        $row = Diet::query()
            ->where('student_id', $request->user()->id)
            ->with('periodWithFoodList')
            ->first();

        return Inertia::render('Gym/StudentDiet', [
            'diet' => $row ? [
                'fromDate' => $row->from_date,
                'toDate' => $row->to_date,
                'periods' => $row->periodWithFoodList->map(fn ($p) => [
                    'dietFoodName' => $p->diet_food_name,
                    'breakfast' => $p->breakfast,
                    'morningMeal' => $p->morning_meal,
                    'lunch' => $p->lunch,
                    'eveningSnack' => $p->evening_snack,
                    'dinner' => $p->dinner,
                ])->values()->all(),
            ] : null,
        ]);
    }
}
