<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'provider' => $this->provider,
            'subscribed_at' => $this->subscribed_at?->toISOString(),
            'roles' => $this->roles->pluck('slug'),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
