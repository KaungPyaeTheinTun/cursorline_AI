<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminUserController extends BaseApiController
{
    public function subscribed(): JsonResponse
    {
        $users = User::whereNotNull('subscribed_at')
            ->with('plan:id,name,slug')
            ->orderByDesc('subscribed_at')
            ->get(['id', 'name', 'email', 'subscribed_at', 'plan_id', 'created_at']);

        return $this->successResponse($users);
    }
}
