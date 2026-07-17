<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetCode extends Model
{
    protected $fillable = [
        'email',
        'code',
        'expires_at',
        'used',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];

    public function isExpired(): bool
    {
        return now()->greaterThan($this->expires_at);
    }

    public function isValid(): bool
    {
        return ! $this->used && ! $this->isExpired();
    }
}
