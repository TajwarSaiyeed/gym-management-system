<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'image', 'role', 'is_active', 'gender',
        'age', 'height', 'weight', 'goal', 'level', 'admin_id', 'trainer_id',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function adminsForUsers(): HasMany
    {
        return $this->hasMany(User::class, 'admin_id');
    }

    public function trainersForUsers(): HasMany
    {
        return $this->hasMany(User::class, 'trainer_id');
    }

    public function notificationsReceived(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function notificationsSent(): HasMany
    {
        return $this->hasMany(Notification::class, 'sender_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }
}
