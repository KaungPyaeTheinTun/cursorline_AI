<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UsageExceededEmail extends Notification
{
    use Queueable;

    public function __construct(
        public User $user,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $planName = $notifiable->plan?->name ?? 'Free';

        return (new MailMessage)
            ->subject("Your Cursorline {$planName} access has expired")
            ->markdown('emails.usage-exceeded', [
                'name' => $notifiable->name,
                'planName' => $planName,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
