<?php

namespace App\Contracts\Repositories;

use App\Models\Conversation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ConversationRepositoryInterface extends BaseRepositoryInterface
{
    public function getByUserId(int $userId, int $perPage = 50): LengthAwarePaginator;

    public function getWithMessages(int $id, int $userId): ?Conversation;

    public function updateTitle(int $id, int $userId, string $title): ?Conversation;

    public function touchLastMessage(int $id): bool;
}
