<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeriodWithFoodList extends Model
{
    protected $fillable = [
        'diet_food_id', 'diet_food_name', 'breakfast', 'morning_meal',
        'lunch', 'evening_snack', 'dinner', 'diet_assignment_id',
    ];

    protected function casts(): array
    {
        return [
            'breakfast' => 'boolean',
            'morning_meal' => 'boolean',
            'lunch' => 'boolean',
            'evening_snack' => 'boolean',
            'dinner' => 'boolean',
        ];
    }

    public function diet(): BelongsTo
    {
        return $this->belongsTo(Diet::class, 'diet_assignment_id');
    }
}
