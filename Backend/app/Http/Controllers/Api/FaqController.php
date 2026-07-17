<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\FaqServiceInterface;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends BaseApiController
{
    public function __construct(
        protected FaqServiceInterface $faqService,
    ) {}

    public function index(): JsonResponse
    {
        $faqs = $this->faqService->all();

        return $this->successResponse($faqs);
    }

    public function publicIndex(): JsonResponse
    {
        $faqs = $this->faqService->all(true);

        return $this->successResponse($faqs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $faq = $this->faqService->create($validated);

        return $this->successResponse($faq, 'FAQ created.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $faq = $this->faqService->find($id);

        return $this->successResponse($faq);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['sometimes', 'string', 'max:500'],
            'answer' => ['sometimes', 'string'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $faq = $this->faqService->update($id, $validated);

        return $this->successResponse($faq, 'FAQ updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->faqService->delete($id);

        return $this->successResponse(null, 'FAQ deleted.');
    }
}
