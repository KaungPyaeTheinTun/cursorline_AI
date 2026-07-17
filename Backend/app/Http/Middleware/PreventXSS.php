<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PreventXSS
{
    private const XSS_PATTERNS = [
        '/<script\b[^>]*>(.*?)<\/script>/is',
        '/javascript:/i',
        '/on\w+\s*=/i',
        '/data:text\/html/i',
        '/vbscript:/i',
        '/expression\(/i',
        '/url\(/i',
        '/<!--.*?-->/s',
        '/<iframe\b[^>]*>(.*?)<\/iframe>/is',
        '/<object\b[^>]*>(.*?)<\/object>/is',
        '/<embed\b[^>]*>/is',
        '/<form\b[^>]*>(.*?)<\/form>/is',
    ];

    public function handle(Request $request, Closure $next)
    {
        if ($this->containsXSS($request->all())) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input detected.',
            ], 422);
        }

        return $next($request);
    }

    private function containsXSS(array $data): bool
    {
        foreach ($data as $value) {
            if (is_string($value) && $this->hasXSSPattern($value)) {
                return true;
            }

            if (is_array($value) && $this->containsXSS($value)) {
                return true;
            }
        }

        return false;
    }

    private function hasXSSPattern(string $value): bool
    {
        foreach (self::XSS_PATTERNS as $pattern) {
            if (preg_match($pattern, $value)) {
                return true;
            }
        }

        return false;
    }
}
