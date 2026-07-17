<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\UsageExceededEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendUsageExceededEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        public User $user,
    ) {}

    public function handle(): void
    {
        $this->user->notify(new UsageExceededEmail($this->user));
    }

    public function failed(\Throwable $exception): void
    {
        \Log::error('Failed to send usage exceeded email', [
            'user_id' => $this->user->id,
            'email' => $this->user->email,
            'error' => $exception->getMessage(),
        ]);
    }
}
