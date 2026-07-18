<?php

namespace App\Contracts\Services;

use App\Models\Message;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MessageServiceInterface extends BaseServiceInterface
{
    public function list(int $conversationId, int $userId, int $perPage = 100): LengthAwarePaginator;

    public function store(int $conversationId, int $userId, string $role, string $content, ?int $tokens = null): Message;

    public function update(int $messageId, int $conversationId, int $userId, string $content): ?Message;
}
