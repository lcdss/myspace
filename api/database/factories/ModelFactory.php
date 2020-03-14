<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(User::class, function (Faker\Generator $faker) {
    $createdAt = $faker->dateTimeBetween('-3 months');

    return [
        'name' => $faker->name,
        'email' => $faker->email,
        'password' => Hash::make('secret'),
        'cpf' => $faker->cpf,
        'points' => $faker->numberBetween(0, 100),
        'created_at' => $createdAt,
        'updated_at' => $faker->dateTimeBetween($createdAt),
    ];
});

$factory->afterCreating(User::class, function ($user) {
    $emailHash = md5($user->email);
    $url = "https://www.gravatar.com/avatar/$emailHash?d=robohash&s=512";

    $filePath = sys_get_temp_dir() . '/' . $emailHash . '.png';
    $fileContent = file_get_contents($url);
    file_put_contents($filePath, $fileContent);
    $file = new UploadedFile($filePath, $emailHash);

    $path = $file->store('avatars');

    $user->update(['avatar' => $path]);
});
