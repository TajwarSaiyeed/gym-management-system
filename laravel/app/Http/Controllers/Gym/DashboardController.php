<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Fee;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $authUser = $request->user();

        if ($authUser->role === 'user') {
            $fees = Fee::query()->where('email', $authUser->email)->get();
            $paid = (int) $fees->where('is_paid', true)->sum('amount');
            $unpaid = (int) $fees->where('is_paid', false)->sum('amount');

            $attendances = Attendance::query()
                ->where('student_id', $authUser->id)
                ->orderBy('date')
                ->get()
                ->map(fn (Attendance $a) => [
                    'id' => (string) $a->id,
                    'date' => $a->date,
                    'isPresent' => $a->is_present,
                    'fromTime' => $a->from_time,
                    'toTime' => $a->to_time,
                ]);

            return Inertia::render('Gym/StudentDashboard', [
                'feesSummary' => ['paid' => $paid, 'unpaid' => $unpaid],
                'attendances' => $attendances,
            ]);
        }

        $fees = Fee::all();
        $income = (int) $fees->filter(fn (Fee $f) => $f->is_paid && $f->transaction_id)->sum('amount');
        $unpaidTotal = (int) $fees->filter(fn (Fee $f) => ! $f->is_paid || ! $f->transaction_id)->sum('amount');

        $onlineUsers = User::query()->where('is_active', true)->count();
        $students = User::query()->where('role', 'user')->count();
        $userCount = User::query()->count();

        $attendanceRows = Attendance::query()
            ->orderBy('date')
            ->get()
            ->map(fn (Attendance $a) => [
                'id' => (string) $a->id,
                'date' => $a->date,
                'isPresent' => $a->is_present,
            ]);

        return Inertia::render('Gym/AdminDashboard', [
            'showIncome' => $authUser->role === 'admin',
            'feesSummary' => [
                'income' => $income,
                'unpaid' => $unpaidTotal,
            ],
            'userSummary' => [
                'online' => $onlineUsers,
                'students' => $students,
                'total' => $userCount,
            ],
            'attendances' => $attendanceRows,
        ]);
    }
}
