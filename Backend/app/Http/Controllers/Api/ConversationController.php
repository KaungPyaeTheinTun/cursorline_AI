<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\ConversationServiceInterface;
use App\Contracts\Services\MessageServiceInterface;
use App\Http\Requests\StoreConversationRequest;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateConversationRequest;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends BaseApiController
{
    public function __construct(
        protected ConversationServiceInterface $conversationService,
        protected MessageServiceInterface $messageService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $conversations = $this->conversationService->list($request->user()->id);

        return $this->paginatedResponse($conversations);
    }

    public function store(StoreConversationRequest $request): JsonResponse
    {
        $conversation = $this->conversationService->create(
            $request->user()->id,
            $request->input('title', 'New Conversation'),
        );

        return $this->successResponse(
            new ConversationResource($conversation),
            'Conversation created.',
            201,
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $conversation = $this->conversationService->find($id, $request->user()->id);

        if (! $conversation) {
            return $this->errorResponse('Conversation not found.', 404);
        }

        return $this->successResponse(
            new ConversationResource($conversation),
        );
    }

    public function update(UpdateConversationRequest $request, int $id): JsonResponse
    {
        $conversation = $this->conversationService->update(
            $id,
            $request->user()->id,
            $request->input('title'),
        );

        if (! $conversation) {
            return $this->errorResponse('Conversation not found.', 404);
        }

        return $this->successResponse(
            new ConversationResource($conversation),
            'Conversation updated.',
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = $this->conversationService->delete($id, $request->user()->id);

        if (! $deleted) {
            return $this->errorResponse('Conversation not found.', 404);
        }

        return $this->successResponse(null, 'Conversation deleted.');
    }

    public function storeMessage(StoreMessageRequest $request, int $id): JsonResponse
    {
        $message = $this->messageService->store(
            $id,
            $request->user()->id,
            $request->input('role'),
            $request->input('content'),
            $request->input('tokens'),
        );

        return $this->successResponse(
            new MessageResource($message),
            'Message stored.',
            201,
        );
    }

    public function messages(Request $request, int $id): JsonResponse
    {
        $messages = $this->messageService->list($id, $request->user()->id);

        return $this->paginatedResponse($messages);
    }

    public function updateMessage(Request $request, int $id, int $messageId): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:10000',
        ]);

        $message = $this->messageService->update(
            $messageId,
            $id,
            $request->user()->id,
            $request->input('content'),
        );

        if (! $message) {
            return $this->errorResponse('Message not found.', 404);
        }

        return $this->successResponse(
            new MessageResource($message),
            'Message updated.',
        );
    }
}
