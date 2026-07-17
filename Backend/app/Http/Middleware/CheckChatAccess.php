<?php

namespace App\Http\Middleware;

use App\Jobs\SendUsageExceededEmail;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CheckChatAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->hasRole('admin')) {
            return $next($request);
        }

        $plan = $user->plan;

        if (! $plan || $plan->usage_duration_minutes === 0) {
            return $next($request);
        }

        if (! $user->usage_started_at) {
            return $next($request);
        }

        $expiresAt = $user->usage_started_at->copy()->addMinutes($plan->usage_duration_minutes);

        if ($expiresAt->isFuture()) {
            return $next($request);
        }

        $cacheKey = 'usage_exceeded_email_sent:' . $user->id;

        if (! Cache::has($cacheKey)) {
            SendUsageExceededEmail::dispatch($user);
            Cache::put($cacheKey, true, now()->addHours(24));
        }

        $planName = $plan->name;

        return response()->json([
            'message' => "Your {$planName} access has expired. Subscribe to continue chatting.",
            'upgrade_url' => '/#pricing',
        ], 403);
    }
}
