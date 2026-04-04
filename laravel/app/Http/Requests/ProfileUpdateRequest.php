<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:2048'],
            'age' => ['nullable', 'integer', 'min:1', 'max:150'],
            'weight' => ['nullable', 'integer', 'min:1', 'max:500'],
            'height' => ['nullable', 'integer', 'min:50', 'max:300'],
            'goal' => ['nullable', 'string', 'max:255'],
            'level' => ['nullable', 'string', Rule::in(['beginner', 'intermediate', 'advanced', 'expert', 'professional'])],
        ];
    }
}
