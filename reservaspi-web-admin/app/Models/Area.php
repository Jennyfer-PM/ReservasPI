<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $table = 'areas';
    protected $fillable = ['nombre'];
    public $timestamps = false;

    public function docentes()
    {
        return $this->hasMany(Docente::class, 'id_area');
    }

    public function administradores()
    {
        return $this->hasMany(Administrador::class, 'id_area');
    }

    public function espacios()
    {
        return $this->hasMany(Espacio::class, 'id_area');
    }
}