<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkOut extends Model
{
    protected $table = 'work_outs';

    protected $fillable = [
        'exercise_id', 'exercise_name', 'sets', 'steps', 'kg', 'rest', 'exercise_assignment_id',
    ];

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class, 'exercise_assignment_id');
    }
}
