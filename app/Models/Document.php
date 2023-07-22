<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'document';

    protected $fillable = ['patient_id', 'template_id', 'data'];

    public function patient()
    {
        return $this->belongsTo('App\Models\Patient');
    }
}
