<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('users', 'UserController@index');
$router->get('users/available', 'UserController@checkAvailability');
$router->get('users/{id}', 'UserController@show');
$router->post('users', 'UserController@store');
$router->patch('users/{id}', 'UserController@update');
$router->delete('users/{id}', 'UserController@destroy');
$router->post('users/{id}/avatar', 'UserController@updateAvatar');

if (config('app.debug')) {
    $router->get('/info', function () {
        phpinfo();
    });
}
