<?php

namespace App\Http\Controllers;

use App\Services\ReservaService;
use App\Services\AuthService;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    protected $reservaService;
    protected $authService;
    
    public function __construct(ReservaService $reservaService, AuthService $authService)
    {
        $this->reservaService = $reservaService;
        $this->authService = $authService;
    }
    
    public function index()
    {
        if (!$this->authService->isAuthenticated()) {
            return redirect()->route('login');
        }
        
        $reservas = $this->reservaService->listarReservas();
        $espacios = $this->reservaService->listarEspacios();
        
        return view('reservas.index', [
            'reservas' => $reservas ?? [],
            'espacios' => $espacios ?? [],
            'user' => $this->authService->getUser()
        ]);
    }
    
    public function historial()
    {
        if (!$this->authService->isAuthenticated()) {
            return redirect()->route('login');
        }
        
        $usuarioId = $this->authService->getUser()['id'];
        $reservas = $this->reservaService->obtenerHistorial($usuarioId);
        
        return view('reservas.historial', [
            'reservas' => $reservas ?? [],
            'user' => $this->authService->getUser()
        ]);
    }
    
    public function perfil()
    {
        if (!$this->authService->isAuthenticated()) {
            return redirect()->route('login');
        }
        
        $user = $this->authService->getUser();
        $perfil = $this->reservaService->obtenerPerfil($user['id']);
        $carreras = $this->reservaService->obtenerCarreras();
        
        return view('perfil.index', [
            'user' => $user,
            'perfil' => $perfil ?? [],
            'carreras' => $carreras ?? []
        ]);
    }
}