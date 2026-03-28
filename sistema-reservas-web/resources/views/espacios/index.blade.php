@extends('layouts.app')

@section('title', 'Explorar espacios')
@section('subtitle', 'Encuentra el espacio perfecto')
@section('description', 'Explora los espacios disponibles para tus actividades académicas')

@section('content')
<div class="search-box">
    <input type="text" id="search" placeholder="Buscar espacios, laboratorios, auditorios..." class="form-control">
</div>

<div class="filters">
    <button class="filter-btn active" data-filter="todos">Todos</button>
    <button class="filter-btn" data-filter="Laboratorio">Laboratorios</button>
    <button class="filter-btn" data-filter="Auditorio">Auditorios</button>
    <button class="filter-btn" data-filter="Sala">Salas</button>
    <button class="filter-btn" data-filter="Taller">Talleres</button>
    <button class="filter-btn" data-filter="Biblioteca">Biblioteca</button>
</div>

<div class="espacios-grid" id="espacios-grid">
    @foreach($espacios as $espacio)
    <div class="espacio-card" data-tipo="{{ $espacio['tipo'] }}" data-nombre="{{ strtolower($espacio['nombre']) }}">
        <h3>{{ $espacio['nombre'] }}</h3>
        <div class="espacio-info"> {{ $espacio['ubicacion'] ?? 'No especificada' }}</div>
        <div class="espacio-info"> Capacidad: {{ $espacio['capacidad'] }} personas</div>
        <div class="espacio-actions">
            <span class="badge badge-aprobada">Disponible</span>
            <button class="btn btn-primary" onclick="solicitar({{ $espacio['id'] }})">Solicitar</button>
        </div>
    </div>
    @endforeach
</div>

<script>
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            document.querySelectorAll('.espacio-card').forEach(card => {
                if (filter === 'todos' || card.dataset.tipo === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    document.getElementById('search').addEventListener('input', function() {
        const search = this.value.toLowerCase();
        document.querySelectorAll('.espacio-card').forEach(card => {
            if (card.dataset.nombre.includes(search)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    function solicitar(id) {
        alert('Solicitar espacio ID: ' + id);
    }
</script>
@endsection