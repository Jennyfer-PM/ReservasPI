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
            return redirect()->route('dashboard');
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
        
        return redirect()->route('dashboard');
    }
    
    public function logout(Request $request)
    {
        $this->authService->logout();
        return redirect()->route('login');
    }
    
    public function dashboard()
    {
        if (!$this->authService->isAuthenticated()) {
            return redirect()->route('login');
        }
        
        return view('dashboard', [
            'user' => $this->authService->getUser()
        ]);
    }
}