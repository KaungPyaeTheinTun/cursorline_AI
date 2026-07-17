<?php

namespace App\Services;

use App\Contracts\Services\FaqServiceInterface;
use App\Models\Faq;

class FaqService extends BaseService implements FaqServiceInterface
{
    public function all(bool $activeOnly = false): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = $activeOnly ? 'faqs:active' : 'faqs:all';
        $ttl = $activeOnly ? 60 : 30;

        return $this->cacheGet($cacheKey, function () use ($activeOnly) {
            $query = Faq::query()->orderBy('sort_order');

            if ($activeOnly) {
                $query->where('is_active', true);
            }

            return $query->get();
        }, $ttl);
    }

    public function find(int $id): Faq
    {
        return Faq::findOrFail($id);
    }

    public function create(array $data): Faq
    {
        $faq = Faq::create($data);

        $this->flushFaqCache();

        return $faq;
    }

    public function update(int $id, array $data): Faq
    {
        $faq = $this->find($id);
        $faq->update($data);

        $this->flushFaqCache();

        return $faq->fresh();
    }

    public function delete(int $id): bool
    {
        $result = $this->find($id)->delete();

        $this->flushFaqCache();

        return $result;
    }

    protected function flushFaqCache(): void
    {
        $this->cacheForget('faqs:active');
        $this->cacheForget('faqs:all');
    }
}
