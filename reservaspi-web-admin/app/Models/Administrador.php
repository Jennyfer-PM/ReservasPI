<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    protected $table = 'administradores';
    protected $fillable = ['noAdministrador', 'id_persona', 'id_area'];
    public $timestamps = false;

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'id_area');
    }
}