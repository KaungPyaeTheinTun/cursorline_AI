<?php

namespace App\Http\Controllers\Api;

use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPlanController extends BaseApiController
{
    public function index(): JsonResponse
    {
        $plans = Plan::orderBy('sort_order')->get();
        return $this->successResponse($plans);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:plans,slug'],
            'price' => ['required', 'integer', 'min:0'],
            'period' => ['nullable', 'string', 'in:month,year'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string'],
            'cta' => ['nullable', 'string', 'max:255'],
            'highlighted' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'usage_duration_minutes' => ['nullable', 'integer', 'min:0'],
        ]);

        $plan = Plan::create($validated);
        return $this->successResponse($plan, 'Plan created.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);
        return $this->successResponse($plan);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:plans,slug,' . $id],
            'price' => ['sometimes', 'integer', 'min:0'],
            'period' => ['sometimes', 'string', 'in:month,year'],
            'description' => ['sometimes', 'nullable', 'string'],
            'features' => ['sometimes', 'nullable', 'array'],
            'features.*' => ['string'],
            'cta' => ['sometimes', 'nullable', 'string', 'max:255'],
            'highlighted' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'usage_duration_minutes' => ['sometimes', 'integer', 'min:0'],
        ]);

        $plan->update($validated);
        return $this->successResponse($plan, 'Plan updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        Plan::findOrFail($id)->delete();
        return $this->successResponse(null, 'Plan deleted.');
    }
}
