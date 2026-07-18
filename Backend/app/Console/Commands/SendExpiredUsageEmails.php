<?php

namespace App\Console\Commands;

use App\Jobs\SendUsageExceededEmail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SendExpiredUsageEmails extends Command
{
    protected $signature = 'usage:check-expired';

    protected $description = 'Send expiry emails to users whose usage duration just expired';

    public function handle(): int
    {
        $now = now();

        $users = User::whereNotNull('usage_started_at')
            ->whereNotNull('plan_id')
            ->whereHas('plan', function ($query) {
                $query->where('usage_duration_minutes', '>', 0);
            })
            ->get();

        $sent = 0;

        foreach ($users as $user) {
            $plan = $user->plan;

            if (! $plan || $plan->usage_duration_minutes === 0) {
                continue;
            }

            $expiresAt = $user->usage_started_at->copy()->addMinutes($plan->usage_duration_minutes);

            if ($now->lessThan($expiresAt)) {
                continue;
            }

            $secondsSinceExpiry = $now->diffInSeconds($expiresAt);

            if ($secondsSinceExpiry > 60) {
                continue;
            }

            $cacheKey = 'usage_exceeded_email_sent:' . $user->id . ':' . $user->usage_started_at->timestamp;

            if (! Cache::has($cacheKey)) {
                Cache::put($cacheKey, true, now()->addHours(24));
                SendUsageExceededEmail::dispatch($user);
                $sent++;
            }
        }

        $this->info("Checked {$users->count()} users, sent {$sent} expiry emails.");

        return self::SUCCESS;
    }
}
