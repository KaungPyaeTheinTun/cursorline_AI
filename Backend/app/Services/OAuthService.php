<?php

namespace App\Services;

use App\Contracts\Services\OAuthServiceInterface;
use App\Models\OAuthProvider;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OAuthService extends BaseService implements OAuthServiceInterface
{
    private const VALID_PROVIDERS = ['google', 'github'];

    public function getRedirectUrl(string $provider): string
    {
        $this->validateProvider($provider);

        $baseUrl = match ($provider) {
            'google' => 'https://accounts.google.com/o/oauth2/v2/auth',
            'github' => 'https://github.com/login/oauth/authorize',
            default => '',
        };

        $params = match ($provider) {
            'google' => http_build_query([
                'client_id' => config('services.google.client_id'),
                'redirect_uri' => config('services.google.redirect'),
                'response_type' => 'code',
                'scope' => 'openid email profile',
                'access_type' => 'offline',
            ]),
            'github' => http_build_query([
                'client_id' => config('services.github.client_id'),
                'redirect_uri' => config('services.github.redirect'),
                'scope' => 'user:email',
            ]),
            default => '',
        };

        return $baseUrl . '?' . $params;
    }

    public function handleCallback(string $provider, array $data): array
    {
        $this->validateProvider($provider);

        $providerUser = $this->resolveProviderUser($provider, $data);

        if (! $providerUser) {
            throw new \RuntimeException('Could not authenticate with provider.', 401);
        }

        $oauthProvider = OAuthProvider::where('provider', $provider)
            ->where('provider_id', $providerUser['id'])
            ->first();

        if ($oauthProvider) {
            $user = $oauthProvider->user;
            $oauthProvider->update([
                'access_token' => $providerUser['access_token'] ?? null,
            ]);
        } else {
            $user = User::where('email', $providerUser['email'])->first();

            if (! $user) {
                $user = User::create([
                    'name' => $providerUser['name'] ?? $providerUser['email'],
                    'email' => $providerUser['email'],
                    'avatar' => $providerUser['avatar'] ?? null,
                    'password' => null,
                ]);

                $userRole = Role::where('slug', 'user')->first();
                if ($userRole) {
                    $user->roles()->attach($userRole);
                }
            }

            OAuthProvider::create([
                'user_id' => $user->id,
                'provider' => $provider,
                'provider_id' => $providerUser['id'],
                'access_token' => $providerUser['access_token'] ?? null,
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    private function validateProvider(string $provider): void
    {
        if (! in_array($provider, self::VALID_PROVIDERS)) {
            throw new \InvalidArgumentException('Unsupported provider.');
        }
    }

    private function resolveProviderUser(string $provider, array $data): ?array
    {
        $code = $data['code'] ?? null;

        if (! $code) {
            Log::error("OAuth {$provider}: no code in callback data");
            return null;
        }

        return match ($provider) {
            'google' => $this->getGoogleUser($code),
            'github' => $this->getGithubUser($code),
            default => null,
        };
    }

    private function getGoogleUser(string $code): ?array
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect');

        try {
            $response = Http::timeout(15)->asForm()->post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri' => $redirectUri,
                'grant_type' => 'authorization_code',
            ]);

            if ($response->failed()) {
                Log::error('Google token exchange failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \RuntimeException('Google token exchange failed: ' . $response->body());
            }

            $accessToken = $response->json('access_token');

            if (! $accessToken) {
                Log::error('Google: no access_token in response', ['response' => $response->json()]);
                throw new \RuntimeException('Google did not return an access token.');
            }

            $userInfo = Http::timeout(15)->withToken($accessToken)
                ->get('https://www.googleapis.com/oauth2/v2/userinfo');

            if ($userInfo->failed()) {
                Log::error('Google userinfo failed', [
                    'status' => $userInfo->status(),
                    'body' => $userInfo->body(),
                ]);
                throw new \RuntimeException('Failed to fetch Google user info.');
            }

            $data = $userInfo->json();

            return [
                'id' => $data['id'],
                'email' => $data['email'],
                'name' => $data['name'] ?? $data['email'],
                'avatar' => $data['picture'] ?? null,
                'access_token' => $accessToken,
            ];
        } catch (\Throwable $e) {
            Log::error('Google OAuth error', ['message' => $e->getMessage()]);
            throw $e;
        }
    }

    private function getGithubUser(string $code): ?array
    {
        $clientId = config('services.github.client_id');
        $clientSecret = config('services.github.client_secret');
        $redirectUri = config('services.github.redirect');

        try {
            $response = Http::timeout(15)
                ->withHeaders(['Accept' => 'application/json'])
                ->asForm()
                ->post('https://github.com/login/oauth/access_token', [
                    'code' => $code,
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'redirect_uri' => $redirectUri,
                ]);

            if ($response->failed()) {
                Log::error('GitHub token exchange failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \RuntimeException('GitHub token exchange failed: ' . $response->body());
            }

            $accessToken = $response->json('access_token');

            if (! $accessToken) {
                Log::error('GitHub: no access_token in response', ['response' => $response->json()]);
                throw new \RuntimeException('GitHub did not return an access token.');
            }

            $userInfo = Http::timeout(15)->withToken($accessToken)
                ->get('https://api.github.com/user');

            if ($userInfo->failed()) {
                Log::error('GitHub userinfo failed', [
                    'status' => $userInfo->status(),
                    'body' => $userInfo->body(),
                ]);
                throw new \RuntimeException('Failed to fetch GitHub user info.');
            }

            $data = $userInfo->json();
            $email = $data['email'];

            if (! $email) {
                $emailResponse = Http::timeout(15)->withToken($accessToken)
                    ->withHeaders(['Accept' => 'application/json'])
                    ->get('https://api.github.com/user/emails');
                if ($emailResponse->ok()) {
                    $emails = $emailResponse->json();
                    $primary = collect($emails)->firstWhere('primary', true);
                    $email = $primary['email'] ?? ($emails[0]['email'] ?? null);
                }
            }

            if (! $email) {
                throw new \RuntimeException('GitHub did not provide an email address.');
            }

            return [
                'id' => (string) $data['id'],
                'email' => $email,
                'name' => $data['name'] ?? $data['login'] ?? $email,
                'avatar' => $data['avatar_url'] ?? null,
                'access_token' => $accessToken,
            ];
        } catch (\Throwable $e) {
            Log::error('GitHub OAuth error', ['message' => $e->getMessage()]);
            throw $e;
        }
    }
}
