<?php

namespace App\Notifications;

use App\Models\Plan;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentSuccessEmail extends Notification
{
    use Queueable;

    public function __construct(
        public string $plan,
        public string $subscriptionId,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $planModel = Plan::where('slug', $this->plan)->first();

        $planName = $planModel?->name ?? ucfirst($this->plan);

        if ($planModel && $planModel->price > 0) {
            $amount = '$' . number_format($planModel->price / 100, 2);
        } else {
            $amount = 'Free';
        }

        $period = $planModel?->period ?? 'month';

        return (new MailMessage)
            ->subject("Welcome to Cursorline {$planName}!")
            ->markdown('emails.payment-success', [
                'name' => $notifiable->name,
                'planName' => $planName,
                'amount' => $amount,
                'period' => $period,
                'subscriptionId' => $this->subscriptionId,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
