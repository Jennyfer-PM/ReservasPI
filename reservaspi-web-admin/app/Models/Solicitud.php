<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    protected $table = 'solicitudes';
    protected $fillable = ['id_alumno', 'id_reserva', 'id_estatus'];
    public $timestamps = false;

    public function alumno()
    {
        return $this->belongsTo(Alumno::class, 'id_alumno');
    }

    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'id_reserva');
    }

    public function estatus()
    {
        return $this->belongsTo(Estatus::class, 'id_estatus');
    }
}