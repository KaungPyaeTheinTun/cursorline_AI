<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\PasswordResetServiceInterface;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasswordResetController extends BaseApiController
{
    public function __construct(
        protected PasswordResetServiceInterface $passwordResetService,
    ) {}

    public function sendCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $this->passwordResetService->sendCode($request->email);

        return $this->successResponse(null, 'Verification code sent to your email.');
    }

    public function verifyCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $this->passwordResetService->verifyCode($request->email, $request->code);

        return $this->successResponse(null, 'Code verified successfully.');
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'code' => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $this->passwordResetService->resetPassword(
            $request->email,
            $request->code,
            $request->password,
        );

        return $this->successResponse(null, 'Password reset successfully. You can now sign in.');
    }
}
