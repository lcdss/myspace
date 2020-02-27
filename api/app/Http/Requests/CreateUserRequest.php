<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class CreateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'max:100',
            ],
            'email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('users', 'email'),
            ],
            'cpf' => [
                'required',
                'cpf',
                Rule::unique('users', 'cpf'),
            ],
        ];
    }
}
