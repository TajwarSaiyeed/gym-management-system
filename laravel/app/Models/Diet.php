<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Diet extends Model
{
    protected $fillable = ['student_id', 'from_date', 'to_date'];

    protected function casts(): array
    {
        return [
            'from_date' => 'datetime',
            'to_date' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function periodWithFoodList(): HasMany
    {
        return $this->hasMany(PeriodWithFoodList::class, 'diet_assignment_id');
    }
}
