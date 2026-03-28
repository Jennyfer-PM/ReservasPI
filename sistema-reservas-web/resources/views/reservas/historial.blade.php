@extends('layouts.app')

@section('title', 'Mis solicitudes')
@section('subtitle', 'Gestión y revisión del estado de tus reservas')
@section('description', 'Consulta el estado de tus solicitudes de espacios')

@section('content')
<div class="tabs">
    <button class="tab-btn active" data-tab="pendientes">Pendientes ({{ count(array_filter($reservas, function($r) { return $r['estado'] == 'Pendiente'; })) }})</button>
    <button class="tab-btn" data-tab="aprobadas">Aprobadas ({{ count(array_filter($reservas, function($r) { return $r['estado'] == 'Aprobada'; })) }})</button>
    <button class="tab-btn" data-tab="rechazadas">Rechazadas ({{ count(array_filter($reservas, function($r) { return $r['estado'] == 'Rechazada'; })) }})</button>
</div>

<div class="tab-pane active" id="pendientes">
    @foreach($reservas as $reserva)
        @if($reserva['estado'] == 'Pendiente')
        <div class="card">
            <div class="card-body">
                <h4>{{ $reserva['nombre_evento'] ?? 'Sin título' }}</h4>
                <p><strong>Espacio:</strong> {{ $reserva['nombre_espacio'] ?? 'N/A' }}</p>
                <p><strong>Fecha:</strong> {{ $reserva['fecha'] ?? 'N/A' }}</p>
                <p><strong>Horario:</strong> {{ $reserva['hora_inicio'] ?? 'N/A' }}</p>
                <p><strong>Duración:</strong> {{ $reserva['duracion'] ?? 'N/A' }}</p>
                <span class="badge badge-pendiente">Pendiente</span>
            </div>
        </div>
        @endif
    @endforeach
</div>

<div class="tab-pane" id="aprobadas">
    @foreach($reservas as $reserva)
        @if($reserva['estado'] == 'Aprobada')
        <div class="card">
            <div class="card-body">
                <h4>{{ $reserva['nombre_evento'] ?? 'Sin título' }}</h4>
                <p><strong>Espacio:</strong> {{ $reserva['nombre_espacio'] ?? 'N/A' }}</p>
                <p><strong>Fecha:</strong> {{ $reserva['fecha'] ?? 'N/A' }}</p>
                <p><strong>Horario:</strong> {{ $reserva['hora_inicio'] ?? 'N/A' }}</p>
                <p><strong>Duración:</strong> {{ $reserva['duracion'] ?? 'N/A' }}</p>
                <span class="badge badge-aprobada">Aprobada</span>
            </div>
        </div>
        @endif
    @endforeach
</div>

<div class="tab-pane" id="rechazadas">
    @foreach($reservas as $reserva)
        @if($reserva['estado'] == 'Rechazada')
        <div class="card">
            <div class="card-body">
                <h4>{{ $reserva['nombre_evento'] ?? 'Sin título' }}</h4>
                <p><strong>Espacio:</strong> {{ $reserva['nombre_espacio'] ?? 'N/A' }}</p>
                <p><strong>Fecha:</strong> {{ $reserva['fecha'] ?? 'N/A' }}</p>
                <p><strong>Horario:</strong> {{ $reserva['hora_inicio'] ?? 'N/A' }}</p>
                <p><strong>Duración:</strong> {{ $reserva['duracion'] ?? 'N/A' }}</p>
                <span class="badge badge-rechazada">Rechazada</span>
            </div>
        </div>
        @endif
    @endforeach
</div>

<script>
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });
</script>
@endsection