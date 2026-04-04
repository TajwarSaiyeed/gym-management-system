<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (! User::query()->where('email', 'admin@gym.test')->exists()) {
            User::create([
                'name' => 'Gym Admin',
                'email' => 'admin@gym.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'gender' => 'male',
            ]);
        }
    }
}
