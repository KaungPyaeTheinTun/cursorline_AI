<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticateToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(["message" => "Unauthenticated."], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (! $accessToken) {
            return response()->json(["message" => "Unauthenticated."], 401);
        }

        $user = $accessToken->tokenable;

        if (! $user) {
            return response()->json(["message" => "Unauthenticated."], 401);
        }

        Auth::setUser($user);

        return $next($request);
    }
}
