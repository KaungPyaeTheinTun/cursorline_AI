<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\OAuthServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OAuthController extends BaseApiController
{
    public function __construct(
        protected OAuthServiceInterface $oAuthService,
    ) {}

    public function redirect(Request $request, string $provider): \Illuminate\Http\JsonResponse
    {
        try {
            $redirectUrl = $this->oAuthService->getRedirectUrl($provider);

            return $this->successResponse([
                'redirect_url' => $redirectUrl,
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function callback(Request $request, string $provider)
    {
        try {
            Log::info("OAuth callback received", [
                'provider' => $provider,
                'has_code' => $request->has('code'),
                'has_error' => $request->has('error'),
                'error_description' => $request->input('error_description'),
            ]);

            if ($request->has('error')) {
                $errorDesc = $request->input('error_description', $request->input('error', 'User denied access'));
                $frontendUrl = config('services.frontend.url', 'http://localhost:5173');
                return redirect()->to("{$frontendUrl}/login?oauth_error=" . urlencode($errorDesc));
            }

            $result = $this->oAuthService->handleCallback($provider, $request->all());

            $frontendUrl = config('services.frontend.url', 'http://localhost:5173');
            $token = $result['token'];

            return redirect()->to("{$frontendUrl}/auth/callback?provider={$provider}&token={$token}");
        } catch (\Throwable $e) {
            Log::error("OAuth callback failed", [
                'provider' => $provider,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $frontendUrl = config('services.frontend.url', 'http://localhost:5173');
            $error = urlencode($e->getMessage() ?: 'OAuth authentication failed');
            return redirect()->to("{$frontendUrl}/login?oauth_error={$error}");
        }
    }
}
