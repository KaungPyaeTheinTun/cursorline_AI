<?php

namespace App\Contracts\Services;

interface PasswordResetServiceInterface extends BaseServiceInterface
{
    public function sendCode(string $email): void;

    public function verifyCode(string $email, string $code): bool;

    public function resetPassword(string $email, string $code, string $password): void;
}
