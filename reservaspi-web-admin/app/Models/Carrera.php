<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrera extends Model
{
    protected $table = 'carreras';
    protected $fillable = ['nombre', 'siglas'];
    public $timestamps = false;

    public function alumnos()
    {
        return $this->hasMany(Alumno::class, 'id_carrera');
    }
}