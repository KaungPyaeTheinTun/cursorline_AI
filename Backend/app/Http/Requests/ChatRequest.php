<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'messages' => ['required', 'array', 'min:1'],
            'messages.*.role' => ['required', 'string', 'in:user,assistant'],
            'messages.*.content' => ['required', 'string', 'max:10000'],
        ];
    }

    public function messages(): array
    {
        return [
            'messages.required' => 'Messages array is required.',
            'messages.min' => 'At least one message is required.',
            'messages.*.role.required' => 'Each message must have a role.',
            'messages.*.role.in' => 'Role must be either user or assistant.',
            'messages.*.content.required' => 'Each message must have content.',
            'messages.*.content.max' => 'Message content cannot exceed 10000 characters.',
        ];
    }
}
