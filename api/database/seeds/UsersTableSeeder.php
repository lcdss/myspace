<?php

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::firstOrCreate(['email' => 'user@example.com'], [
            'name' => 'Example User',
            'password' => 'secret',
            'cpf' => '780.568.854-04',
        ]);

        $this->command->getOutput()->note('Example User created: user@example.com - secret');
    }
}
