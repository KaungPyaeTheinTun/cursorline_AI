<?php

namespace App\Services;

use App\Contracts\Services\BaseServiceInterface;
use Illuminate\Support\Facades\Cache;

abstract class BaseService implements BaseServiceInterface
{
    protected int $cacheMinutes = 60;

    protected function cacheGet(string $key, callable $callback, ?int $minutes = null): mixed
    {
        return Cache::remember($key, $minutes ?? $this->cacheMinutes, $callback);
    }

    protected function cacheForget(string $key): bool
    {
        return Cache::forget($key);
    }

    protected function cacheFlush(string $prefix): void
    {
        for ($page = 1; $page <= 10; $page++) {
            Cache::forget("{$prefix}:{$page}");
        }
    }
}
