<?php

use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\AdminPlanController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\OAuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\StripeController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public auth routes - stricter rate limiting
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [PasswordResetController::class, 'sendCode']);
        Route::post('/verify-code', [PasswordResetController::class, 'verifyCode']);
        Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
    });

    // OAuth
    Route::get('/oauth/{provider}/redirect', [OAuthController::class, 'redirect']);
    Route::get('/oauth/{provider}/callback', [OAuthController::class, 'callback']);

    // Stripe success/cancel (public)
    Route::get('/payment/success', [StripeController::class, 'success']);

    // Public FAQ
    Route::get('/faqs', [FaqController::class, 'publicIndex']);

    // Public plans
    Route::get('/plans', [PlanController::class, 'index']);

    // Protected routes
    Route::middleware('auth.token')->group(function () {
        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateProfile']);

        // Chat - moderate rate limiting
        Route::middleware(['throttle:30,1', 'check.chat.access'])->group(function () {
            Route::post('/chat', [ChatController::class, 'chat']);
            Route::post('/chat/stream', [ChatController::class, 'stream']);
        });

        // Conversations
        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::post('/conversations', [ConversationController::class, 'store']);
        Route::get('/conversations/{id}', [ConversationController::class, 'show']);
        Route::put('/conversations/{id}', [ConversationController::class, 'update']);
        Route::delete('/conversations/{id}', [ConversationController::class, 'destroy']);
        Route::post('/conversations/{id}/messages', [ConversationController::class, 'storeMessage']);
        Route::get('/conversations/{id}/messages', [ConversationController::class, 'messages']);

        // Stripe checkout
        Route::post('/checkout', [StripeController::class, 'createCheckoutSession']);
        Route::post('/subscribe/free', [StripeController::class, 'subscribeFree']);

        // Admin routes
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::apiResource('faqs', FaqController::class);
            Route::apiResource('plans', AdminPlanController::class);
            Route::get('/users/subscribed', [AdminUserController::class, 'subscribed']);
        });
    });
});
