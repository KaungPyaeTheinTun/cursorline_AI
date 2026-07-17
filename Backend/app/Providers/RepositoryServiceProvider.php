<?php

namespace App\Providers;

use App\Contracts\Repositories\ConversationRepositoryInterface;
use App\Contracts\Repositories\MessageRepositoryInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Contracts\Services\AuthServiceInterface;
use App\Contracts\Services\ChatServiceInterface;
use App\Contracts\Services\ConversationServiceInterface;
use App\Contracts\Services\FaqServiceInterface;
use App\Contracts\Services\MessageServiceInterface;
use App\Contracts\Services\OAuthServiceInterface;
use App\Contracts\Services\PasswordResetServiceInterface;
use App\Contracts\Services\StripeServiceInterface;
use App\Repositories\ConversationRepository;
use App\Repositories\MessageRepository;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use App\Services\ChatService;
use App\Services\ConversationService;
use App\Services\FaqService;
use App\Services\MessageService;
use App\Services\OAuthService;
use App\Services\PasswordResetService;
use App\Services\StripeService;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->registerRepositories();
        $this->registerServices();
    }

    private function registerRepositories(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(ConversationRepositoryInterface::class, ConversationRepository::class);
        $this->app->bind(MessageRepositoryInterface::class, MessageRepository::class);
    }

    private function registerServices(): void
    {
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
        $this->app->bind(ChatServiceInterface::class, ChatService::class);
        $this->app->bind(ConversationServiceInterface::class, ConversationService::class);
        $this->app->bind(MessageServiceInterface::class, MessageService::class);
        $this->app->bind(StripeServiceInterface::class, StripeService::class);
        $this->app->bind(OAuthServiceInterface::class, OAuthService::class);
        $this->app->bind(PasswordResetServiceInterface::class, PasswordResetService::class);
        $this->app->bind(FaqServiceInterface::class, FaqService::class);
    }

    public function boot(): void
    {
        //
    }
}
