<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    protected $table = 'alumnos';
    protected $fillable = ['matricula', 'id_persona', 'curp', 'id_carrera', 'cuatrimestre'];
    public $timestamps = false;

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }

    public function carrera()
    {
        return $this->belongsTo(Carrera::class, 'id_carrera');
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class, 'id_alumno');
    }
}