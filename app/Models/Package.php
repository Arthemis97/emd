<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'package';

    protected $fillable = ['name'];

    public function patient()
    {
        return $this->hasOne('App\Models\Patient');
    }

    public function template()
    {
        return $this->belongsToMany('App\Models\Template', 'template_package');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($package) {
            $package->template()->detach();
        });
    }
}
