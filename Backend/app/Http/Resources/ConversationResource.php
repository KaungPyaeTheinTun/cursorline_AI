<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'last_message_at' => $this->last_message_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
        ];
    }
}
