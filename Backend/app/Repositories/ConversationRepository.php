<?php

namespace App\Repositories;

use App\Contracts\Repositories\ConversationRepositoryInterface;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ConversationRepository extends BaseRepository implements ConversationRepositoryInterface
{
    protected function model(): Model
    {
        return new Conversation();
    }

    public function getByUserId(int $userId, int $perPage = 50): LengthAwarePaginator
    {
        return Conversation::where('user_id', $userId)
            ->select('id', 'title', 'last_message_at', 'created_at')
            ->orderBy('last_message_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    public function getWithMessages(int $id, int $userId): ?Conversation
    {
        return Conversation::where('id', $id)
            ->where('user_id', $userId)
            ->with(['messages' => function ($query) {
                $query->select('id', 'role', 'content', 'created_at')
                    ->orderBy('created_at', 'asc');
            }])
            ->first();
    }

    public function updateTitle(int $id, int $userId, string $title): ?Conversation
    {
        $conversation = Conversation::where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (! $conversation) {
            return null;
        }

        $conversation->update(['title' => $title]);

        return $conversation->fresh();
    }

    public function touchLastMessage(int $id): bool
    {
        return (bool) Conversation::where('id', $id)->update(['last_message_at' => now()]);
    }
}
