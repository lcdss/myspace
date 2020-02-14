<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->perPage ?? 10;

        return new UserCollection(
            User::orderByDesc('id')->paginate($perPage)
        );
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
                Rule::unique('users', 'email'),
            ],
            'cpf' => [
                'required',
                'cpf',
                Rule::unique('users', 'cpf'),
            ],
        ]);

        $user = User::create($data);

        return new UserResource($user);
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
                Rule::unique('users', 'email')->ignore($id),
            ],
            'cpf' => [
                'sometimes',
                'required',
                'cpf',
                Rule::unique('users', 'cpf')->ignore($id),
            ],
        ]);

        $user->update($data);

        return new UserResource($user);
    }

    public function replaceAvatar(int $id, Request $request)
    {
        $user = User::findOrFail($id);

        $this->validate($request, [
            'avatar' => ['image', 'mimes:png,jpeg', 'max:1024'],
        ]);

        if ($user->avatar) {
            app('filesystem')->delete($user->avatar);
        }

        $path = null;

        if ($request->avatar) {
            $path = $request->avatar->store('avatars');
        }

        $user->update(['avatar' => $path]);

        return new UserResource($user);
    }

    public function destroy(int $id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
