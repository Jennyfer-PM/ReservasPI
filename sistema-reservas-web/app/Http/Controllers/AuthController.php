<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $authService;
    
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    
    public function showLogin()
    {
        if ($this->authService->isAuthenticated()) {
            return redirect()->intended('/dashboard');
        }
        return view('auth.login');
    }
    
   public function login(Request $request)
{
    $request->validate([
        'correo' => 'required|email',
        'clave' => 'required|string'
    ]);
    
    $response = $this->authService->login(
        $request->correo,
        $request->clave
    );
    
    if (isset($response['error'])) {
        return back()->withErrors([
            'correo' => $response['message'] ?? 'Credenciales incorrectas'
        ]);
    }
    
    // Redirigir directamente a /dashboard sin usar route()
    return redirect('/dashboard');
}
}