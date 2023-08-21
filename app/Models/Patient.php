<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patient';
    protected $fillable = ['first_name', 'last_name', 'gender', 'dob', 'age', 'rd', 'package_id', 'story'];


    public function package()
    {
        return $this->belongsTo('App\Models\Package');
    }

    public function images()
    {
        return $this->hasMany('App\Models\Image');
    }

    public function document()
    {
        return $this->hasMany('App\Models\Document');
    }
}
