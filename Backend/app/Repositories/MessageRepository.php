<?php

namespace App\Repositories;

use App\Contracts\Repositories\MessageRepositoryInterface;
use App\Models\Message;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MessageRepository extends BaseRepository implements MessageRepositoryInterface
{
    protected function model(): Model
    {
        return new Message();
    }

    public function getByConversationId(int $conversationId, int $perPage = 100): LengthAwarePaginator
    {
        return Message::where('conversation_id', $conversationId)
            ->select('id', 'role', 'content', 'created_at')
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);
    }

    public function getOrderedByConversation(int $conversationId, string $direction = 'asc'): \Illuminate\Database\Eloquent\Collection
    {
        return Message::where('conversation_id', $conversationId)
            ->select('id', 'role', 'content', 'created_at')
            ->orderBy('created_at', $direction)
            ->get();
    }

    public function storeMessage(int $conversationId, string $role, string $content, ?int $tokens = null): Message
    {
        return Message::create([
            'conversation_id' => $conversationId,
            'role' => $role,
            'content' => $content,
            'tokens' => $tokens,
        ]);
    }
}
