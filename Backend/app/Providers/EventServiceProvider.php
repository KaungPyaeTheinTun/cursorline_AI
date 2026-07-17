<?php

namespace App\Providers;

use App\Events\PaymentSuccessful;
use App\Listeners\SendPaymentSuccessEmail;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        PaymentSuccessful::class => [
            SendPaymentSuccessEmail::class,
        ],
    ];

    public function boot(): void
    {
        parent::boot();
    }
}
