<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    public function handle($request, Closure $next)
    {
        if (!$this->isCorsRequest($request)) {
            return $next($request);
        }

        if (!$this->isAllowed($request)) {
            return $this->forbiddenResponse();
        }

        if ($this->isPreflightRequest($request)) {
            return $this->handlePreflightRequest();
        }

        $response = $next($request);

        return $this->addCorsHeaders($response);
    }

    private function isCorsRequest($request): bool
    {
        if (!$request->headers->has('Origin')) {
            return false;
        }

        return $request->headers->get('Origin') !== $request->getSchemeAndHttpHost();
    }

    private function isAllowed($request): bool
    {
        if (strpos($this->allowedMethods(), $request->method()) === false) {
            return false;
        }

        if (strpos($this->allowedOrigins(), '*') !== false) {
            return true;
        }

        return strpos($this->allowedOrigins(), $request->header('Origin')) !== false;
    }

    private function isPreflightRequest($request): bool
    {
        return $request->getMethod() === 'OPTIONS';
    }

    private function forbiddenResponse()
    {
        return response('Forbidden (cors).', 403);
    }

    private function handlePreflightRequest()
    {
        $response = response('Preflight OK', 200);

        return $this->addPreflightHeaders($response);
    }

    private function addPreflightHeaders($response)
    {
        return $response
            ->header('Access-Control-Allow-Methods', $this->allowedMethods())
            ->header('Access-Control-Allow-Headers', $this->allowedHeaders())
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Max-Age', $this->maxAge());
    }

    private function addCorsHeaders($response)
    {
        if ($this->exposedHeaders()) {
            $response = $response->header('Access-Control-Expose-Headers', $this->exposedHeaders());
        }

        return $response->header('Access-Control-Allow-Origin', '*');
    }

    private function allowedMethods(): string
    {
        return env('CORS_ALLOWED_METHODS', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    }

    private function allowedOrigins(): string
    {
        return env('CORS_ALLOWED_ORIGINS', '*');
    }

    private function allowedHeaders(): string
    {
        return env(
            'CORS_ALLOWED_HEADERS',
            'Content-Type, Origin, Authorization'
        );
    }

    private function exposedHeaders(): string
    {
        return env('CORS_EXPOSED_HEADERS', '');
    }

    private function maxAge(): int
    {
        return (int) env('CORS_MAX_AGE', 60 * 60 * 24);
    }
}
