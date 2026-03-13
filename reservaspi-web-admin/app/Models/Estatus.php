<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estatus extends Model
{
    protected $table = 'estatus';
    protected $fillable = ['descrpcion'];
    public $timestamps = false;

    public function personas()
    {
        return $this->hasMany(Persona::class, 'id_estatus');
    }

    public function espacios()
    {
        return $this->hasMany(Espacio::class, 'id_estatus');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'id_estatus');
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class, 'id_estatus');
    }
}