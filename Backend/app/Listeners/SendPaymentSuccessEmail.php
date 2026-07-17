<?php

namespace App\Listeners;

use App\Events\PaymentSuccessful;
use App\Jobs\SendPaymentConfirmation;

class SendPaymentSuccessEmail
{
    public function handle(PaymentSuccessful $event): void
    {
        SendPaymentConfirmation::dispatch(
            $event->user,
            $event->plan,
            $event->subscriptionId,
        );
    }
}
