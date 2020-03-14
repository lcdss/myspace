<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['max:100'],
            'email' => [
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($this->route('id')),
            ],
            'password' => ['pwd'],
            'cpf' => [
                'cpf',
                Rule::unique('users', 'cpf')->ignore($this->route('id')),
            ],
            'points' => ['integer'],
        ];
    }
}
