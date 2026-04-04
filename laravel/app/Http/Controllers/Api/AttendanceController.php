<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class AttendanceController extends Controller
{
    public function store(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'fromTime' => ['required', 'string'],
            'toTime' => ['required', 'string'],
        ]);

        if ($data['fromTime'] === '' || $data['toTime'] === '') {
            return response()->json(['error' => 'Missing fields'], 400);
        }

        $f = $this->timeToDate($data['fromTime']);
        $t = $this->timeToDate($data['toTime']);
        if ($t <= $f) {
            return response()->json(['error' => "To can't be less than or equal to From Time"], 400);
        }

        $toDay = now()->toDateString();

        if (Attendance::query()->where('date', $toDay)->exists()) {
            return response()->json(['error' => 'Attendance already taken'], 400);
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

        return response()->json(['message' => 'Attendance taken successfully'], 201);
    }

    public function adminIndex(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $attendances = Attendance::query()
            ->with(['student' => fn ($q) => $q->select('id', 'name', 'email', 'image')])
            ->get();

        if ($attendances->isEmpty()) {
            return response()->json(['data' => []], 200);
        }

        return response()->json(['data' => $this->mapAttendanceCollection($attendances)], 200);
    }

    public function studentIndex(Request $request)
    {
        if ($request->user()->role !== 'user') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $attendances = Attendance::query()
            ->where('student_id', $request->user()->id)
            ->with(['student' => fn ($q) => $q->select('id', 'name', 'email', 'image')])
            ->get();

        if ($attendances->isEmpty()) {
            return response()->json(['data' => []], 200);
        }

        return response()->json(['data' => $this->mapAttendanceCollection($attendances)], 200);
    }

    public function studentMark(Request $request)
    {
        if ($request->user()->role !== 'user') {
            return response()->json(['error' => 'Unauthenticated'], 401);
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
            return response()->json(['error' => 'Attendance Unavailable'], 400);
        }

        [$fH, $fM] = array_map('intval', explode(':', $attendance->from_time));
        [$tH, $tM] = array_map('intval', explode(':', $attendance->to_time));

        if (
            $toDayHour < $fH
            || ($toDayHour === $fH && $toDayMin < $fM)
            || $toDayHour > $tH
            || ($toDayHour === $tH && $toDayMin > $tM)
        ) {
            return response()->json(['error' => 'You are not allowed to mark attendance at this time'], 400);
        }

        $attendance->update(['is_present' => true]);

        return response()->json(['data' => $this->mapAttendance($attendance->fresh('student'))], 200);
    }

    private function timeToDate(string $timeString): \DateTimeInterface
    {
        [$hours, $minutes] = explode(':', $timeString);

        return now()->setTime((int) $hours, (int) $minutes);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapAttendance(Attendance $a): array
    {
        $student = $a->student;

        return [
            'id' => (string) $a->id,
            'fromTime' => $a->from_time,
            'toTime' => $a->to_time,
            'isPresent' => $a->is_present,
            'date' => $a->date,
            'studentId' => $a->student_id !== null ? (string) $a->student_id : null,
            'createdAt' => $a->created_at,
            'updatedAt' => $a->updated_at,
            'student' => $student ? [
                'id' => (string) $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'image' => $student->image,
            ] : null,
        ];
    }

    /**
     * @param  Collection<int, Attendance>  $attendances
     * @return list<array<string, mixed>>
     */
    private function mapAttendanceCollection($attendances): array
    {
        return $attendances->map(fn (Attendance $a) => $this->mapAttendance($a))->values()->all();
    }
}
