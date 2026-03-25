<?php

namespace App\Services;

class ReservaService extends FastApiService
{
    public function listarEspacios()
    {
        return $this->get('/espacios');
    }
    
    public function listarReservas()
    {
        return $this->get('/reservas');
    }
    
    public function obtenerHistorial($usuarioId)
    {
        return $this->get("/reservas/usuario/{$usuarioId}");
    }
    
    public function obtenerPerfil($usuarioId)
    {
        return $this->get("/usuario/{$usuarioId}");
    }
    
    public function obtenerCarreras()
    {
        return $this->get('/carreras');
    }
}