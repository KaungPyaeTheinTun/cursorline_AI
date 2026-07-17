<?php

namespace App\Services;

use App\Contracts\Services\PasswordResetServiceInterface;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class PasswordResetService extends BaseService implements PasswordResetServiceInterface
{
    public function sendCode(string $email): void
    {
        PasswordResetCode::where('email', $email)
            ->where('used', false)
            ->update(['used' => true]);

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        PasswordResetCode::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => now()->addMinutes(15),
        ]);

        $html = view('emails.password-reset-code', ['code' => $code, 'email' => $email])->render();

        Mail::send([], [], function ($message) use ($email, $html) {
            $message->to($email)
                ->subject('Your Cursorline Verification Code')
                ->from(config('mail.from.address'), config('mail.from.name'))
                ->html($html);
        });
    }

    public function verifyCode(string $email, string $code): bool
    {
        $record = PasswordResetCode::where('email', $email)
            ->where('code', $code)
            ->where('used', false)
            ->latest()
            ->first();

        if (! $record) {
            abort(422, 'Invalid verification code.');
        }

        if ($record->isExpired()) {
            abort(422, 'Verification code has expired. Please request a new one.');
        }

        return true;
    }

    public function resetPassword(string $email, string $code, string $password): void
    {
        $record = PasswordResetCode::where('email', $email)
            ->where('code', $code)
            ->where('used', false)
            ->latest()
            ->first();

        if (! $record) {
            abort(422, 'Invalid verification code.');
        }

        if ($record->isExpired()) {
            abort(422, 'Verification code has expired. Please request a new one.');
        }

        $record->update(['used' => true]);

        $user = User::where('email', $email)->first();

        if (! $user) {
            abort(422, 'No account found with this email.');
        }

        $user->update([
            'password' => Hash::make($password),
        ]);
    }
}
