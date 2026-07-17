<?php

namespace App\Contracts\Services;

interface ChatServiceInterface extends BaseServiceInterface
{
    public function chat(array $messages): array;

    public function stream(array $messages): void;
}
