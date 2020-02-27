<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'avatar', 'cpf'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            app('filesystem')->delete($user->avatar);
        });
    }

    /**
     * Generates the avatar URL and fallbacks to Gravatar if the avatar is not defined.
     *
     * @param integer $size
     * @return string
     */
    public function avatarUrl()
    {
        if ($this->avatar) {
            return app('filesystem')->url($this->avatar);
        }

        $emailHash = md5($this->email);

        return "https://www.gravatar.com/avatar/$emailHash?d=identicon";
    }
}
