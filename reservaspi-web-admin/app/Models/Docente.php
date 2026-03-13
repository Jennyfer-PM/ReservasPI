<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    protected $table = 'docentes';
    protected $fillable = ['noEmpleado', 'id_persona', 'rfc', 'id_area'];
    public $timestamps = false;

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'id_area');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'id_docente');
    }

    public function reservasColaborador()
    {
        return $this->hasMany(Reserva::class, 'id_colaborador');
    }
}