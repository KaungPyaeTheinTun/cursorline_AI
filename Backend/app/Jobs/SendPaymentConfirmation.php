<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\PaymentSuccessEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendPaymentConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        public User $user,
        public string $plan,
        public string $subscriptionId,
    ) {}

    public function handle(): void
    {
        $this->user->notify(new PaymentSuccessEmail($this->plan, $this->subscriptionId));
    }

    public function failed(\Throwable $exception): void
    {
        \Log::error('Failed to send payment confirmation email', [
            'user_id' => $this->user->id,
            'email' => $this->user->email,
            'plan' => $this->plan,
            'error' => $exception->getMessage(),
        ]);
    }
}
