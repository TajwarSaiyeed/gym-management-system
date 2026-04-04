<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendancePageController extends Controller
{
    public function adminIndex(Request $request): Response
    {
        $attendances = Attendance::query()
            ->with(['student' => fn ($q) => $q->select('id', 'name', 'email', 'image')])
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Gym/AttendanceAdmin', [
            'attendances' => $attendances->map(function (Attendance $a) {
                $student = $a->student;

                return [
                    'id' => (string) $a->id,
                    'fromTime' => $a->from_time,
                    'toTime' => $a->to_time,
                    'isPresent' => $a->is_present,
                    'date' => $a->date,
                    'student' => $student ? [
                        'id' => (string) $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                        'image' => $student->image,
                    ] : null,
                ];
            })->values()->all(),
        ]);
    }

    public function adminStore(Request $request): RedirectResponse
    {
        if ($request->user()->role === 'user') {
            abort(403);
        }

        $data = $request->validate([
            'fromTime' => ['required', 'string'],
            'toTime' => ['required', 'string'],
        ]);

        $f = $this->timeToDate($data['fromTime']);
        $t = $this->timeToDate($data['toTime']);
        if ($t <= $f) {
            return back()->withErrors(['time' => "To can't be less than or equal to From Time"]);
        }

        $toDay = now()->toDateString();

        if (Attendance::query()->where('date', $toDay)->exists()) {
            return back()->withErrors(['time' => 'Attendance already taken for today']);
        }

        $students = User::query()->where('role', 'user')->get();

        foreach ($students as $student) {
            Attendance::create([
                'student_id' => $student->id,
                'date' => $toDay,
                'from_time' => $data['fromTime'],
                'to_time' => $data['toTime'],
                'is_present' => false,
            ]);
        }

        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'user_email' => $student->email,
                'sender_id' => $request->user()->id,
                'notification_text' => 'Are you available for today?',
                'path_name' => '/user/attendance',
                'read' => false,
                'type' => 'present',
            ]);
        }

        return back()->with('success', 'Attendance taken successfully');
    }

    public function studentPage(Request $request): Response
    {
        $attendances = Attendance::query()
            ->where('student_id', $request->user()->id)
            ->orderBy('date')
            ->get();

        return Inertia::render('Gym/StudentAttendance', [
            'attendances' => $attendances->map(fn (Attendance $a) => [
                'id' => (string) $a->id,
                'date' => $a->date,
                'isPresent' => $a->is_present,
                'fromTime' => $a->from_time,
                'toTime' => $a->to_time,
            ])->values()->all(),
        ]);
    }

    public function studentMark(Request $request): RedirectResponse
    {
        if ($request->user()->role !== 'user') {
            abort(403);
        }

        $today = now();
        $toDayHour = (int) $today->format('G') + 6;
        $toDayMin = (int) $today->format('i');

        $attendance = Attendance::query()
            ->where('student_id', $request->user()->id)
            ->where('date', $today->toDateString())
            ->where('is_present', false)
            ->first();

        if (! $attendance) {
            return back()->withErrors(['mark' => 'Attendance unavailable']);
        }

        [$fH, $fM] = array_map('intval', explode(':', $attendance->from_time));
        [$tH, $tM] = array_map('intval', explode(':', $attendance->to_time));

        if (
            $toDayHour < $fH
            || ($toDayHour === $fH && $toDayMin < $fM)
            || $toDayHour > $tH
            || ($toDayHour === $tH && $toDayMin > $tM)
        ) {
            return back()->withErrors(['mark' => 'You are not allowed to mark attendance at this time']);
        }

        $attendance->update(['is_present' => true]);

        return back()->with('success', 'Attendance marked');
    }

    private function timeToDate(string $timeString): \DateTimeInterface
    {
        [$hours, $minutes] = explode(':', $timeString);

        return now()->setTime((int) $hours, (int) $minutes);
    }
}
