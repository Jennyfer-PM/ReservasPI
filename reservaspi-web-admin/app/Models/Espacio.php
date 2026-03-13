<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Espacio extends Model
{
    protected $table = 'espacios';
    protected $fillable = ['nombre', 'id_area', 'capacidad', 'id_estatus'];
    public $timestamps = false;

    public function area()
    {
        return $this->belongsTo(Area::class, 'id_area');
    }

    public function estatus()
    {
        return $this->belongsTo(Estatus::class, 'id_estatus');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'id_espacio');
    }
}