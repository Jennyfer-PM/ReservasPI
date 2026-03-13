<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    protected $fillable = ['id_docente', 'nombre', 'id_espacio', 'fecha', 'duracion', 'id_servicio', 'detalles', 'id_colaborador', 'restricciones', 'id_estatus'];
    public $timestamps = false;

    protected $casts = [
        'fecha' => 'datetime',
        'duracion' => 'interval'
    ];

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'id_docente');
    }

    public function colaborador()
    {
        return $this->belongsTo(Docente::class, 'id_colaborador');
    }

    public function espacio()
    {
        return $this->belongsTo(Espacio::class, 'id_espacio');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'id_servicio');
    }

    public function estatus()
    {
        return $this->belongsTo(Estatus::class, 'id_estatus');
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class, 'id_reserva');
    }
}