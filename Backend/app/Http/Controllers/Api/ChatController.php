<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\ChatServiceInterface;
use App\Http\Requests\ChatRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends BaseApiController
{
    public function __construct(
        protected ChatServiceInterface $chatService,
    ) {}

    public function chat(ChatRequest $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user && ! $user->usage_started_at && $user->plan && $user->plan->usage_duration_minutes > 0) {
                $user->update(['usage_started_at' => now()]);
            }

            $result = $this->chatService->chat($request->validated()['messages']);

            return $this->successResponse($result);
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function stream(ChatRequest $request): StreamedResponse
    {
        $messages = $request->validated()['messages'];
        $user = $request->user();

        if ($user && ! $user->usage_started_at && $user->plan && $user->plan->usage_duration_minutes > 0) {
            $user->update(['usage_started_at' => now()]);
        }

        return response()->stream(function () use ($messages) {
            try {
                $this->chatService->stream($messages);
            } catch (\Throwable $e) {
                echo "data: " . json_encode(['error' => $e->getMessage()]) . "\n\n";
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
