<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Template extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "template";

    protected $fillable = ['name', 'template'];


    public function package()
    {
        return $this->belongsToMany('App\Models\Package', 'template_package');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($template) {
            $template->package()->detach();
        });
    }
}
