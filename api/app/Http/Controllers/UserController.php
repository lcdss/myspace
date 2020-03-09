<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateAvatarRequest;

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

    public function store(CreateUserRequest $request)
    {
        $user = User::create($request->all());

        return new UserResource($user);
    }

    public function update(int $id, UpdateUserRequest $request)
    {
        $user = User::findOrFail($id);

        $user->update($request->all());

        return new UserResource($user);
    }

    public function updateAvatar(int $id, UpdateAvatarRequest $request)
    {
        $user = User::findOrFail($id);

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
        $user = User::find($id);

        if ($user) {
            $user->delete();
        }

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function checkAvailability(Request $request)
    {
        $value = $request->value;

        if (!is_valid_cpf($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['available' => false]);
        }

        $value = format_cpf($value);

        $isAvailable = !User::where('email', $value)
            ->orWhere('cpf', $value)
            ->exists();

        return response()->json(['available' => $isAvailable]);
    }
}
