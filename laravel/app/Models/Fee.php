<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    protected $table = 'fees';

    protected $fillable = [
        'email', 'month', 'year', 'message', 'amount',
        'is_paid', 'transaction_id', 'payment_date',
    ];

    protected function casts(): array
    {
        return [
            'is_paid' => 'boolean',
            'payment_date' => 'datetime',
        ];
    }
}
