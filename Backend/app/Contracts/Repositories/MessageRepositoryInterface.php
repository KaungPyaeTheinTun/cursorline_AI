<?php

namespace App\Contracts\Repositories;

use App\Models\Message;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MessageRepositoryInterface extends BaseRepositoryInterface
{
    public function getByConversationId(int $conversationId, int $perPage = 100): LengthAwarePaginator;

    public function getOrderedByConversation(int $conversationId, string $direction = 'asc'): \Illuminate\Database\Eloquent\Collection;

    public function storeMessage(int $conversationId, string $role, string $content, ?int $tokens = null): Message;
}
