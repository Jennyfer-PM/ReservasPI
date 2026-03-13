<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $table = 'servicios';
    protected $fillable = ['nombre'];
    public $timestamps = false;

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'id_servicio');
    }
}