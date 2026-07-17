<?php

namespace App\Contracts\Services;

use App\Models\User;

interface StripeServiceInterface extends BaseServiceInterface
{
    public function createCheckoutSession(User $user, string $plan): array;

    public function handleSuccess(string $sessionId): array;
}
