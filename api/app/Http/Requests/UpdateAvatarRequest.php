<?php

namespace App\Http\Requests;

class UpdateAvatarRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'avatar' => [
                'image',
                'mimes:png,jpeg',
                'max:2048',
            ],
        ];
    }
}
