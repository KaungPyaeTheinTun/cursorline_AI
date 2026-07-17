<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plan' => ['required', 'string', Rule::exists('plans', 'slug')->where('is_active', true)],
        ];
    }

    public function messages(): array
    {
        return [
            'plan.required' => 'Please select a plan.',
            'plan.exists' => 'Invalid or inactive plan selected.',
        ];
    }
}
