<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\StripeServiceInterface;
use App\Http\Requests\CheckoutRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StripeController extends BaseApiController
{
    public function __construct(
        protected StripeServiceInterface $stripeService,
    ) {}

    public function createCheckoutSession(CheckoutRequest $request): JsonResponse
    {
        try {
            $result = $this->stripeService->createCheckoutSession(
                $request->user(),
                $request->input('plan'),
            );

            return $this->successResponse($result);
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function success(Request $request): JsonResponse
    {
        $sessionId = $request->query('session_id');

        if (! $sessionId) {
            return $this->errorResponse('No session ID provided.', 400);
        }

        try {
            $result = $this->stripeService->handleSuccess($sessionId);

            return $this->successResponse($result);
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function subscribeFree(Request $request): JsonResponse
    {
        $user = $request->user();
        $freePlan = \App\Models\Plan::where('slug', 'free')->where('is_active', true)->first();

        if (! $freePlan) {
            return $this->errorResponse('Free plan not found.', 404);
        }

        $user->update([
            'plan_id' => $freePlan->id,
            'usage_started_at' => now(),
        ]);

        return $this->successResponse(null, 'Free plan activated.');
    }
}
