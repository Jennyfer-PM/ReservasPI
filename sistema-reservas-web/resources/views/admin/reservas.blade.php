@extends('layouts.app')

@section('title', 'Administración')
@section('subtitle', 'Panel de administración')
@section('description', 'Gestiona las solicitudes de reserva de espacios')

@section('content')
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-number">{{ $pendientes ?? 0 }}</div>
        <div class="stat-label">Pendientes</div>
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
    <div class="card-header">Solicitudes</div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Espacio</th>
                        <th>Solicitante</th>
                        <th>Fecha</th>
                        <th>Horario</th>
                        <th>Propósito</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($reservas as $reserva)
                    <tr>
                        <td>{{ $reserva['espacio_nombre'] ?? 'N/A' }}</td>
                        <td>{{ $reserva['alumno'] ?? 'N/A' }}</td>
                        <td>{{ $reserva['fecha'] ?? 'N/A' }}</td>
                        <td>{{ $reserva['horario'] ?? 'N/A' }}</td>
                        <td>{{ $reserva['proposito'] ?? 'N/A' }}</td>
                        <td>
                            <span class="badge badge-{{ strtolower($reserva['estado'] ?? 'pendiente') }}">
                                {{ $reserva['estado'] ?? 'Pendiente' }}
                            </span>
                        </td>
                        <td>
                            @if($reserva['estado'] == 'Pendiente')
                            <button class="btn btn-success btn-sm" onclick="aprobar({{ $reserva['id'] }})">Aprobar</button>
                            <button class="btn btn-danger btn-sm" onclick="rechazar({{ $reserva['id'] }})">Rechazar</button>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    function aprobar(id) {
        if(confirm('¿Aprobar esta reserva?')) {
            alert('Aprobando reserva ID: ' + id);
        }
    }
    
    function rechazar(id) {
        if(confirm('¿Rechazar esta reserva?')) {
            alert('Rechazando reserva ID: ' + id);
        }
    }
</script>
@endsection