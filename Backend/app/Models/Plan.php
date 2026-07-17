<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'price',
        'period',
        'description',
        'features',
        'cta',
        'highlighted',
        'is_active',
        'sort_order',
        'usage_duration_minutes',
    ];

    protected $casts = [
        'features' => 'array',
        'highlighted' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'integer',
        'sort_order' => 'integer',
        'usage_duration_minutes' => 'integer',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
