<?php

return [
    'name' => env('APP_NAME', 'Lumen'),

    'env' => env('APP_ENV', 'production'),

    'debug' => (bool) env('APP_DEBUG', false),

    'url' => env('APP_URL', 'http://localhost'),

    'timezone' => env('APP_TIMEZONE', 'UTC'),

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => 'pt_BR',

    'key' => env('APP_KEY'),

    'cipher' => 'AES-256-CBC',
];
