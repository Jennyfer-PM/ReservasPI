@extends('layouts.app')

@section('title', 'Dashboard')
@section('subtitle', 'Bienvenido de vuelta')
@section('description', 'Panel de control del sistema de reservas')

@section('content')
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-number">{{ $pendientes ?? 0 }}</div>
        <div class="stat-label">Reservas pendientes</div>
    </div>
    <div class="stat-card">
        <div class="stat-number">{{ $aprobadasHoy ?? 0 }}</div>
        <div class="stat-label">Aprobadas hoy</div>
    </div>
    <div class="stat-card">
        <div class="stat-number">{{ $espaciosActivos ?? 0 }}</div>
        <div class="stat-label">Espacios activos</div>
    </div>
    <div class="stat-card">
        <div class="stat-number">{{ $usuariosActivos ?? 0 }}</div>
        <div class="stat-label">Usuarios activos</div>
    </div>
</div>

<div class="card">
    <div class="card-header">Actividad reciente</div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Evento</th>
                        <th>Espacio</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($actividadReciente ?? [] as $actividad)
                    <tr>
                        <td>{{ $actividad['proposito'] ?? 'N/A' }}</td>
                        <td>{{ $actividad['espacio_nombre'] ?? 'N/A' }}</td>
                        <td>{{ $actividad['fecha'] ?? 'N/A' }}</td>
                        <td>
                            <span class="badge badge-{{ strtolower($actividad['estado'] ?? 'pendiente') }}">
                                {{ $actividad['estado'] ?? 'N/A' }}
                            </span>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" class="text-center">No hay actividad reciente</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection