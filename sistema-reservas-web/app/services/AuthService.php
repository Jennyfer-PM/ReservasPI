<?php

namespace App\Services;

class AuthService extends FastApiService
{
    public function login($correo, $clave)
    {
        $response = $this->post('/login', [
            'correo' => $correo,
            'clave' => $clave
        ]);
        
        if (isset($response['error'])) {
            return $response;
        }
        
        session([
            'api_user' => [
                'id' => $response['id'],
                'nombre' => $response['usuario'],
                'email' => $response['email'],
                'telefono' => $response['telefono']
            ]
        ]);
        
        return $response;
    }
    
    public function logout()
    {
        session()->forget('api_user');
        return true;
    }
    
    public function getUser()
    {
        return session('api_user');
    }
    
    public function isAuthenticated()
    {
        return session()->has('api_user');
    }
}