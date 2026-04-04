<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diet_food_lists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('diets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('from_date');
            $table->timestamp('to_date');
            $table->timestamps();
        });

        Schema::create('period_with_food_lists', function (Blueprint $table) {
            $table->id();
            $table->string('diet_food_id');
            $table->string('diet_food_name');
            $table->boolean('breakfast')->default(false);
            $table->boolean('morning_meal')->default(false);
            $table->boolean('lunch')->default(false);
            $table->boolean('evening_snack')->default(false);
            $table->boolean('dinner')->default(false);
            $table->foreignId('diet_assignment_id')->constrained('diets')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('fees', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('month');
            $table->string('year');
            $table->text('message')->nullable();
            $table->unsignedInteger('amount');
            $table->boolean('is_paid')->default(false);
            $table->string('transaction_id')->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->timestamps();
        });

        Schema::create('exercise_lists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('from_date');
            $table->timestamp('to_date');
            $table->timestamps();
        });

        Schema::create('work_outs', function (Blueprint $table) {
            $table->id();
            $table->string('exercise_id');
            $table->string('exercise_name');
            $table->unsignedInteger('sets')->default(0);
            $table->unsignedInteger('steps')->default(0);
            $table->unsignedInteger('kg')->default(0);
            $table->unsignedInteger('rest')->default(0);
            $table->foreignId('exercise_assignment_id')->constrained('exercises')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->text('notification_text');
            $table->string('type');
            $table->string('user_email')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('read')->default(false);
            $table->string('path_name');
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->string('from_time');
            $table->string('to_time');
            $table->boolean('is_present')->default(false);
            $table->string('date');
            $table->foreignId('student_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('work_outs');
        Schema::dropIfExists('exercises');
        Schema::dropIfExists('exercise_lists');
        Schema::dropIfExists('fees');
        Schema::dropIfExists('period_with_food_lists');
        Schema::dropIfExists('diets');
        Schema::dropIfExists('diet_food_lists');
    }
};
