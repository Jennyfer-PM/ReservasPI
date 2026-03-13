<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Persona extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'personas';
    protected $fillable = ['nombre', 'ap', 'am', 'edad', 'correoI', 'clave', 'telefono', 'id_estatus'];
    protected $hidden = ['clave'];
    public $timestamps = false;

    public function getAuthPassword()
    {
        return $this->clave;
    }

    public function estatus()
    {
        return $this->belongsTo(Estatus::class, 'id_estatus');
    }

    public function alumno()
    {
        return $this->hasOne(Alumno::class, 'id_persona');
    }

    public function docente()
    {
        return $this->hasOne(Docente::class, 'id_persona');
    }

    public function administrador()
    {
        return $this->hasOne(Administrador::class, 'id_persona');
    }
}