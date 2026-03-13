<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdministradorController;
use App\Http\Controllers\Api\EspacioController;
use App\Http\Controllers\Api\SolicitudController;
use App\Http\Controllers\Api\ReservaController;
use App\Http\Controllers\Api\PersonaController;
use App\Http\Controllers\Api\EstatusController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Acciones adicionales
    Route::post('/solicitudes/{id}/aprobar', [SolicitudController::class, 'aprobar']);
    Route::post('/solicitudes/{id}/rechazar', [SolicitudController::class, 'rechazar']);
    
    // Recursos API
    Route::apiResource('administradores', AdministradorController::class);
    Route::apiResource('espacios', EspacioController::class);
    Route::apiResource('solicitudes', SolicitudController::class);
    Route::apiResource('reservas', ReservaController::class);
    Route::apiResource('personas', PersonaController::class);
    Route::apiResource('estatus', EstatusController::class);
});