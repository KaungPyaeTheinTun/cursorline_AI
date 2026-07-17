<?php

namespace App\Contracts\Services;

use App\Models\User;

interface AuthServiceInterface extends BaseServiceInterface
{
    public function register(array $data): array;

    public function login(array $data): array;

    public function logout(string $token): bool;

    public function getProfile(User $user): User;

    public function updateProfile(User $user, array $data): User;
}
