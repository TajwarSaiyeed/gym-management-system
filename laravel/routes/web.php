<?php

use App\Http\Controllers\Gym\AttendancePageController;
use App\Http\Controllers\Gym\DashboardController;
use App\Http\Controllers\Gym\DietPageController;
use App\Http\Controllers\Gym\DirectoryController;
use App\Http\Controllers\Gym\ExercisePageController;
use App\Http\Controllers\Gym\FeePageController;
use App\Http\Controllers\Gym\MemberController;
use App\Http\Controllers\Gym\NotificationPageController;
use App\Http\Controllers\Gym\PresenceController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::patch('/presence', [PresenceController::class, 'update'])->name('presence.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['role:admin,trainer'])->group(function () {
        Route::get('/add-user', [MemberController::class, 'create'])->name('gym.add-user');
        Route::post('/add-user', [MemberController::class, 'store'])->name('gym.add-user.store');
    });

    Route::middleware(['role:admin'])->group(function () {
        Route::get('/manage-user', [MemberController::class, 'manage'])->name('gym.manage-user');
        Route::patch('/manage-user/trainer', [MemberController::class, 'assignTrainer'])->name('gym.manage-user.trainer');
    });

    Route::get('/trainers', [DirectoryController::class, 'trainers'])->name('gym.trainers');
    Route::get('/trainers/{trainer}', [DirectoryController::class, 'trainerShow'])->name('gym.trainers.show');

    Route::middleware(['role:admin,trainer'])->group(function () {
        Route::get('/students', [DirectoryController::class, 'students'])->name('gym.students');
        Route::get('/students/{student}', [DirectoryController::class, 'studentShow'])->name('gym.students.show');

        Route::get('/attendance', [AttendancePageController::class, 'adminIndex'])->name('gym.attendance');
        Route::post('/attendance', [AttendancePageController::class, 'adminStore'])->name('gym.attendance.store');

        Route::get('/fees', [FeePageController::class, 'adminIndex'])->name('gym.fees');
        Route::post('/fees', [FeePageController::class, 'adminStore'])->name('gym.fees.store');

        Route::get('/exercise', [ExercisePageController::class, 'hub'])->name('gym.exercise');
        Route::get('/exercise/manage-exercise', [ExercisePageController::class, 'manageIndex'])->name('gym.exercise.manage');
        Route::post('/exercise/manage-exercise', [ExercisePageController::class, 'manageStore'])->name('gym.exercise.manage.store');
        Route::delete('/exercise/manage-exercise', [ExercisePageController::class, 'manageDestroy'])->name('gym.exercise.manage.destroy');
        Route::get('/exercise/assign-exercise', [ExercisePageController::class, 'assignForm'])->name('gym.exercise.assign');
        Route::post('/exercise/assign-exercise', [ExercisePageController::class, 'assignStore'])->name('gym.exercise.assign.store');

        Route::get('/diet', [DietPageController::class, 'hub'])->name('gym.diet');
        Route::get('/diet/manage-foods', [DietPageController::class, 'manageIndex'])->name('gym.diet.foods');
        Route::post('/diet/manage-foods', [DietPageController::class, 'manageStore'])->name('gym.diet.foods.store');
        Route::delete('/diet/manage-foods', [DietPageController::class, 'manageDestroy'])->name('gym.diet.foods.destroy');
        Route::get('/diet/assign-diet', [DietPageController::class, 'assignForm'])->name('gym.diet.assign');
        Route::post('/diet/assign-diet', [DietPageController::class, 'assignStore'])->name('gym.diet.assign.store');
    });

    Route::middleware(['role:user'])->group(function () {
        Route::get('/user/attendance', [AttendancePageController::class, 'studentPage'])->name('gym.student.attendance');
        Route::post('/user/attendance/mark', [AttendancePageController::class, 'studentMark'])->name('gym.student.attendance.mark');
        Route::get('/user/fees', [FeePageController::class, 'studentIndex'])->name('gym.student.fees');
        Route::post('/user/fees/checkout', [FeePageController::class, 'checkout'])->name('gym.student.fees.checkout');
        Route::get('/user/fees/payment/success', [FeePageController::class, 'paymentSuccess'])->name('gym.student.fees.success');
        Route::get('/user/exercise', [ExercisePageController::class, 'studentExercise'])->name('gym.student.exercise');
        Route::get('/user/diet', [DietPageController::class, 'studentDiet'])->name('gym.student.diet');
    });

    Route::get('/notifications', [NotificationPageController::class, 'index'])->name('gym.notifications');
    Route::patch('/notifications/{notification}', [NotificationPageController::class, 'markRead'])->name('gym.notifications.read');
});

require __DIR__.'/auth.php';
