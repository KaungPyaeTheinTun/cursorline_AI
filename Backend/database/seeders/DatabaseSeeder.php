<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Admin']
        );

        $userRole = Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'User']
        );

        $admin = User::firstOrCreate(
            ['email' => 'admin@cursorline.dev'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (! $admin->hasRole('admin')) {
            $admin->roles()->attach($adminRole);
        }

        $demo = User::firstOrCreate(
            ['email' => 'demo@cursorline.dev'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (! $demo->hasRole('user')) {
            $demo->roles()->attach($userRole);
        }

        $this->call(FaqSeeder::class);
    }
}
