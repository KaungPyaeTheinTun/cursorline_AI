<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SanitizeInput
{
    private const UNSANITIZED_KEYS = ['content', 'messages'];

    public function handle(Request $request, Closure $next)
    {
        $request->merge($this->sanitizeArray($request->all()));

        return $next($request);
    }

    private function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value) && ! in_array($key, self::UNSANITIZED_KEYS, true)) {
                $sanitized[$key] = $this->sanitizeString($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    private function sanitizeString(string $value): string
    {
        $value = trim($value);
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);

        return $value;
    }
}
