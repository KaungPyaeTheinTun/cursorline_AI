<?php

namespace App\Contracts\Repositories;

use App\Models\User;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function getByProvider(string $provider, string $providerId): ?User;

    public function markSubscribed(int $userId): bool;
}
