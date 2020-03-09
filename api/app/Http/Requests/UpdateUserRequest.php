<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
                Rule::unique('users', 'email')->ignore($this->route('id')),
            ],
            'password' => ['pwd'],
            'cpf' => [
                'required',
                'cpf',
                Rule::unique('users', 'cpf')->ignore($this->route('id')),
            ],
        ];
    }
}
