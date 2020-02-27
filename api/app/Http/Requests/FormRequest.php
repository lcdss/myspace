<?php

namespace App\Http\Requests;

use Laravel\Lumen\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\ValidatesWhenResolvedTrait;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Validation\Factory as ValidationFactory;
use Illuminate\Contracts\Validation\ValidatesWhenResolved;

class FormRequest extends Request implements ValidatesWhenResolved
{
    use ValidatesWhenResolvedTrait;

    protected $container;

    public function messages(): array
    {
        return [];
    }

    public function attributes(): array
    {
        return [];
    }

    public function validationData(): array
    {
        return $this->all();
    }

    public function setContainer(Container $container)
    {
        $this->container = $container;
    }

    public function validator()
    {
        $factory = $this->container->make(ValidationFactory::class);

        return $factory->make(
            $this->validationData(),
            $this->container->call([$this, 'rules']),
            $this->messages(),
            $this->attributes()
        );
    }

    protected function failedValidation(Validator $validator)
    {
        throw new ValidationException(
            $validator,
            $this->buildFailedValidationResponse($validator)
        );
    }

    protected function buildFailedValidationResponse(Validator $validator)
    {
        return new JsonResponse($validator->errors()->getMessages(), 422);
    }
}
