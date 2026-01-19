<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'frank@fvautoimports.com.pe'],
            [
                'name' => 'Frank',
                'password' => Hash::make('Fr@nk2026'),
                'email_verified_at' => now(),
            ]
        );
    }
}
