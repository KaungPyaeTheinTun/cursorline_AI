<?php

namespace App\Contracts\Services;

interface OAuthServiceInterface extends BaseServiceInterface
{
    public function getRedirectUrl(string $provider): string;

    public function handleCallback(string $provider, array $data): array;
}
