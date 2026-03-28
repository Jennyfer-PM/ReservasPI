<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservaController;

// Rutas públicas
Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth.custom')->group(function () {
    Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::get('/reservas', [ReservaController::class, 'index'])->name('reservas.index');
    Route::get('/historial', [ReservaController::class, 'historial'])->name('reservas.historial');
    Route::get('/perfil', [ReservaController::class, 'perfil'])->name('perfil.index');
});