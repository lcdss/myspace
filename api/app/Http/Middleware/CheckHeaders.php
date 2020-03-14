<?php

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CheckHeaders
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$request->wantsJson() && $request->path() !== 'info') {
            throw new BadRequestHttpException('Accept header should be present and match the requirements.');
        }

        return $next($request);
    }
}
