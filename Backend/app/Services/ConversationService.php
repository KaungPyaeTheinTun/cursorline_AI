<?php

namespace App\Services;

use App\Contracts\Repositories\ConversationRepositoryInterface;
use App\Contracts\Services\ConversationServiceInterface;
use App\Models\Conversation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Request;

class ConversationService extends BaseService implements ConversationServiceInterface
{
    protected int $cacheMinutes = 30;

    public function __construct(
        protected ConversationRepositoryInterface $conversationRepository,
    ) {}

    public function list(int $userId, int $perPage = 50): LengthAwarePaginator
    {
        $page = (int) Request::input('page', 1);
        $cacheKey = "user:{$userId}:conversations:{$page}";

        return $this->cacheGet($cacheKey, function () use ($userId, $perPage) {
            return $this->conversationRepository->getByUserId($userId, $perPage);
        });
    }

    public function create(int $userId, string $title = 'New Conversation'): Conversation
    {
        $conversation = $this->conversationRepository->create([
            'user_id' => $userId,
            'title' => $title,
        ]);

        $this->cacheFlush("user:{$userId}:conversations");

        return $conversation;
    }

    public function find(int $id, int $userId): ?Conversation
    {
        return $this->conversationRepository->getWithMessages($id, $userId);
    }

    public function update(int $id, int $userId, string $title): ?Conversation
    {
        $conversation = $this->conversationRepository->updateTitle($id, $userId, $title);

        if ($conversation) {
            $this->cacheFlush("user:{$userId}:conversations");
        }

        return $conversation;
    }

    public function delete(int $id, int $userId): bool
    {
        $result = $this->conversationRepository->delete($id);

        if ($result) {
            $this->cacheFlush("user:{$userId}:conversations");
        }

        return $result;
    }
}
