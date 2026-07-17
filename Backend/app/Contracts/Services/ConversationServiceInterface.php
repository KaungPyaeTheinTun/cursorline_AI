<?php

namespace App\Contracts\Services;

use App\Models\Conversation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ConversationServiceInterface extends BaseServiceInterface
{
    public function list(int $userId, int $perPage = 50): LengthAwarePaginator;

    public function create(int $userId, string $title = 'New Conversation'): Conversation;

    public function find(int $id, int $userId): ?Conversation;

    public function update(int $id, int $userId, string $title): ?Conversation;

    public function delete(int $id, int $userId): bool;
}
