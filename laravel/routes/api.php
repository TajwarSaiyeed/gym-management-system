<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DietAssignController;
use App\Http\Controllers\Api\DietFoodController;
use App\Http\Controllers\Api\ExerciseAssignController;
use App\Http\Controllers\Api\ExerciseListController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentDietController;
use App\Http\Controllers\Api\StudentExerciseController;
use App\Http\Controllers\Api\TrainerController;
use App\Http\Controllers\Api\UserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', fn (Request $request) => response()->json(['user' => new UserResource($request->user())]));

    Route::get('/user/profile', [ProfileController::class, 'show']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::patch('/users', [UserController::class, 'update']);

    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/trainers', [TrainerController::class, 'index']);

    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::get('/attendance', [AttendanceController::class, 'adminIndex']);
    Route::get('/user/attendance', [AttendanceController::class, 'studentIndex']);
    Route::patch('/user/attendance', [AttendanceController::class, 'studentMark']);

    Route::post('/fees', [FeeController::class, 'store']);
    Route::get('/fees', [FeeController::class, 'adminIndex']);
    Route::get('/user/fees', [FeeController::class, 'studentIndex']);

    Route::get('/notification', [NotificationController::class, 'index']);
    Route::post('/notification', [NotificationController::class, 'store']);
    Route::patch('/notification/{notificationId}', [NotificationController::class, 'markRead']);

    Route::get('/exercise/manage-exercise', [ExerciseListController::class, 'index']);
    Route::post('/exercise/manage-exercise', [ExerciseListController::class, 'store']);
    Route::delete('/exercise/manage-exercise', [ExerciseListController::class, 'destroy']);

    Route::post('/exercise/assign-exercise', [ExerciseAssignController::class, 'store']);
    Route::get('/user/exercise', [StudentExerciseController::class, 'show']);

    Route::get('/diet/manage-foods', [DietFoodController::class, 'index']);
    Route::post('/diet/manage-foods', [DietFoodController::class, 'store']);
    Route::delete('/diet/manage-foods', [DietFoodController::class, 'destroy']);

    Route::post('/diet/assign-diet', [DietAssignController::class, 'store']);
    Route::get('/user/diet', [StudentDietController::class, 'show']);

    Route::post('/payment', [PaymentController::class, 'createCheckoutSession']);
    Route::get('/payment/{sessionId}', [PaymentController::class, 'sessionStatus']);
});
