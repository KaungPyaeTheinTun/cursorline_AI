<?php

namespace App\Services;

use App\Contracts\Services\StripeServiceInterface;
use App\Events\PaymentSuccessful;
use App\Models\Plan;
use App\Models\User;
use Stripe\Checkout\Session as CheckoutSession;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;

class StripeService extends BaseService implements StripeServiceInterface
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret_key'));
    }

    public function createCheckoutSession(User $user, string $plan): array
    {
        $planModel = Plan::where('slug', $plan)->where('is_active', true)->first();

        if (! $planModel) {
            throw new \RuntimeException('Invalid or inactive plan.', 400);
        }

        $frontendUrl = config('services.frontend.url', 'http://localhost:5173');

        try {
            $session = CheckoutSession::create([
                'customer_email' => $user->email,
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $planModel->name,
                                'description' => $planModel->description ?? $planModel->name . ' subscription',
                            ],
                            'unit_amount' => $planModel->price,
                            'recurring' => [
                                'interval' => $planModel->period,
                            ],
                        ],
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'subscription',
                'success_url' => $frontendUrl . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $frontendUrl . '/payment/cancel',
                'metadata' => [
                    'user_id' => $user->id,
                    'plan' => $plan,
                    'plan_id' => $planModel->id,
                ],
            ]);

            return [
                'checkout_url' => $session->url,
                'session_id' => $session->id,
            ];
        } catch (ApiErrorException $e) {
            throw new \RuntimeException($e->getMessage(), 502);
        }
    }

    public function handleSuccess(string $sessionId): array
    {
        try {
            $session = CheckoutSession::retrieve($sessionId);

            if ($session->status === 'complete' && isset($session->metadata->user_id)) {
                $user = User::find($session->metadata->user_id);

                if ($user) {
                    $user->update([
                        'subscribed_at' => now(),
                        'plan_id' => $session->metadata->plan_id ?? null,
                        'usage_started_at' => now(),
                    ]);

                    PaymentSuccessful::dispatch(
                        $user,
                        $session->metadata->plan ?? 'pro',
                        $session->subscription ?? '',
                    );
                }
            }

            return [
                'status' => $session->status,
                'customer_email' => $session->customer_email,
                'subscription_id' => $session->subscription,
                'plan' => $session->metadata->plan ?? null,
            ];
        } catch (ApiErrorException $e) {
            throw new \RuntimeException($e->getMessage(), 502);
        }
    }
}
