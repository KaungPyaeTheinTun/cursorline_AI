<?php

namespace App\Http\Controllers\Api;

use App\Models\Plan;
use Illuminate\Http\JsonResponse;

class PlanController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $plans = Plan::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($plans);
    }
}
