<?php

namespace App\Repositories;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    protected function model(): Model
    {
        return new User();
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function getByProvider(string $provider, string $providerId): ?User
    {
        return User::where('provider', $provider)
            ->where('provider_id', $providerId)
            ->first();
    }

    public function markSubscribed(int $userId): bool
    {
        return (bool) User::where('id', $userId)->update(['subscribed_at' => now()]);
    }
}
