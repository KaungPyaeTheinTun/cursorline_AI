<?php

namespace App\Services;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Contracts\Services\AuthServiceInterface;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService extends BaseService implements AuthServiceInterface
{
    public function __construct(
        protected UserRepositoryInterface $userRepository,
    ) {}

    public function register(array $data): array
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $userRole = Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'User']
        );
        $user->roles()->attach($userRole);

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(array $data): array
    {
        $user = $this->userRepository->findByEmail($data['email']);

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(string $token): bool
    {
        $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);

        if ($accessToken) {
            return $accessToken->delete();
        }

        return false;
    }

    public function getProfile(User $user): User
    {
        return $user;
    }

    public function updateProfile(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh();
    }
}
