<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', 'in:user,assistant'],
            'content' => ['required', 'string', 'max:50000'],
            'tokens' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.required' => 'Message role is required.',
            'role.in' => 'Role must be either user or assistant.',
            'content.required' => 'Message content is required.',
            'content.max' => 'Message content cannot exceed 50000 characters.',
            'tokens.min' => 'Token count cannot be negative.',
        ];
    }
}
