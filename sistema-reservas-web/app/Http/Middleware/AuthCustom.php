<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\AuthService;

class AuthCustom
{
    protected $authService;
    
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    
    public function handle(Request $request, Closure $next)
    {
        if (!$this->authService->isAuthenticated()) {
            return redirect()->route('login');
        }
        
        return $next($request);
    }
}