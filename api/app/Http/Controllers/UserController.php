<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use App\Http\Resources\UserCollection;
use App\Http\Resources\User as UserResource;

class UserController extends Controller
{
    public function index()
    {
        return new UserCollection(User::all());
    }

    public function show(int $id)
    {
        return new UserResource(User::findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $this->validate($request, [
            'name' => ['required'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
            ],
            'cpf' => [
                'required',
                'cpf',
                Rule::unique('users', 'cpf')
            ],
        ]);

        $user = User::create($data);

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(int $id, Request $request)
    {
        $user = User::findOrFail($id);

        $data = $this->validate($request, [
            'name' => ['sometimes', 'required'],
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($id)
            ],
            'cpf' => [
                'sometimes',
                'required',
                'cpf',
                Rule::unique('users', 'cpf')->ignore($id)
            ],
        ]);

        $user->update($data);

        return new UserResource($user);
    }

    public function replaceAvatar(int $id, Request $request)
    {
        $user = User::findOrFail($id);

        // TODO: Validate the file
        $data = $this->validate($request, ['avatar' => ['required']]);

        // TODO: Store the file
        // TODO: Update the user's avatar column

        return new UserResource($user);
    }

    public function destroy(int $id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
