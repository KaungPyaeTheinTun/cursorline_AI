<?php

namespace App\Services;

use App\Contracts\Repositories\ConversationRepositoryInterface;
use App\Contracts\Repositories\MessageRepositoryInterface;
use App\Contracts\Services\MessageServiceInterface;
use App\Models\Message;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class MessageService extends BaseService implements MessageServiceInterface
{
    protected int $cacheMinutes = 15;

    public function __construct(
        protected MessageRepositoryInterface $messageRepository,
        protected ConversationRepositoryInterface $conversationRepository,
    ) {}

    public function list(int $conversationId, int $userId, int $perPage = 100): LengthAwarePaginator
    {
        $page = (int) Request::input('page', 1);
        $cacheKey = "conversation:{$conversationId}:messages:{$page}";

        return $this->cacheGet($cacheKey, function () use ($conversationId, $perPage) {
            return $this->messageRepository->getByConversationId($conversationId, $perPage);
        });
    }

    public function store(int $conversationId, int $userId, string $role, string $content, ?int $tokens = null): Message
    {
        return DB::transaction(function () use ($conversationId, $role, $content, $tokens) {
            $message = $this->messageRepository->storeMessage($conversationId, $role, $content, $tokens);

            $this->conversationRepository->touchLastMessage($conversationId);

            $this->cacheFlush("conversation:{$conversationId}:messages");

            return $message;
        });
    }

    public function update(int $messageId, int $conversationId, int $userId, string $content): ?Message
    {
        $message = $this->messageRepository->updateMessage($messageId, $content);

        if ($message) {
            $this->cacheFlush("conversation:{$conversationId}:messages");
        }

        return $message;
    }
}
