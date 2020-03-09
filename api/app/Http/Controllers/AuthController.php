<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Response;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    protected $auth;

    public function __construct(JWTAuth $auth)
    {
        $this->auth = $auth;
    }

    public function me()
    {
        $user = new UserResource($this->auth->user());

        return response()->json(['data' => $user]);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = $this->auth->attempt($credentials)) {
                return response()->json([
                    'message' => 'unauthorized'
                ], Response::HTTP_UNAUTHORIZED);
            }

            return $this->respondWithToken($token);
        } catch (JWTException $e) {
            return response()->json(
                ['message' => 'could not create the token'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    public function refresh()
    {
        $token = $this->auth->parseToken()->refresh();

        return $this->respondWithToken($token);
    }


    public function logout()
    {
        $this->auth->parseToken()->invalidate();

        return response()->json(['message' => 'token invalidated']);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'data' => [
                'accessToken' => $token,
                'tokenType' => 'bearer',
                'expiresIn' => $this->auth->factory()->getTTL() * 60,
            ],
        ]);
    }
}
