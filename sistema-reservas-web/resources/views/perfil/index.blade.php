@extends('layouts.app')

@section('title', 'Mi perfil')
@section('subtitle', 'Gestión de información personal')
@section('description', 'Administra tus datos y preferencias')

@section('content')
<div class="row">
    <div class="col-md-4">
        <div class="card">
            <div class="card-header">Información personal</div>
            <div class="card-body">
                <h4>{{ $perfil['nombre'] ?? $user['nombre'] }}</h4>
                <p><strong>Puesto:</strong> {{ $perfil['puesto'] ?? 'Usuario' }}</p>
                <p><strong>Carrera:</strong> {{ $perfil['carrera'] ?? 'No asignada' }}</p>
                <hr>
                <p><strong>Email:</strong> {{ $user['email'] }}</p>
                <p><strong>Teléfono:</strong> {{ $perfil['telefono'] ?? $user['telefono'] ?? 'No registrado' }}</p>
                <p><strong>Miembro desde:</strong> {{ $perfil['miembroDesde'] ?? '2024' }}</p>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card">
            <div class="card-header">Estadísticas</div>
            <div class="card-body text-center">
                <div class="stat-number">{{ $perfil['totales'] ?? 0 }}</div>
                <div class="stat-label">Solicitudes totales</div>
                <div class="stat-number mt-3">{{ $perfil['aprobadas'] ?? 0 }}</div>
                <div class="stat-label">Solicitudes aprobadas</div>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card">
            <div class="card-header">¿Necesitas ayuda?</div>
            <div class="card-body">
                <p>Contacta al equipo de administración de espacios para resolver cualquier duda.</p>
                <button class="btn btn-primary w-100">Contactar soporte</button>
                <a href="#" class="btn btn-link w-100 mt-2">Ver políticas de uso</a>
            </div>
        </div>
    </div>
</div>

<div class="card mt-3">
    <div class="card-header">Actualizar perfil</div>
    <div class="card-body">
        @if(session('message'))
            <div class="alert alert-success">{{ session('message') }}</div>
        @endif
        
        <form method="POST" action="{{ route('perfil.update') }}">
            @csrf
            @method('PUT')
            
            <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input type="text" class="form-control" id="telefono" name="telefono" 
                       value="{{ $perfil['telefono'] ?? '' }}" maxlength="10">
            </div>
            
            <div class="form-group">
                <label for="carrera">Carrera</label>
                <select class="form-control" id="carrera" name="carrera">
                    <option value="">Selecciona una carrera</option>
                    @foreach($carreras as $carrera)
                        <option value="{{ $carrera['nombre'] }}" 
                            {{ ($perfil['carrera'] ?? '') == $carrera['nombre'] ? 'selected' : '' }}>
                            {{ $carrera['nombre'] }}
                        </option>
                    @endforeach
                </select>
            </div>
            
            <div class="form-group">
                <label for="contrasena">Nueva contraseña (opcional)</label>
                <input type="password" class="form-control" id="contrasena" name="contrasena" minlength="6">
            </div>
            
            <button type="submit" class="btn btn-primary">Actualizar perfil</button>
        </form>
    </div>
</div>
@endsection