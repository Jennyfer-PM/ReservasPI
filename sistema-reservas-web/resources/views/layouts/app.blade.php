<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Reservas UPQ - @yield('title')</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h3>Reservas UPQ</h3>
                <p>Universidad Politécnica</p>
            </div>
            <nav class="sidebar-nav">
                <a href="{{ route('dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">
                     Inicio
                </a>
                <a href="{{ route('espacios.index') }}" class="{{ request()->routeIs('espacios.*') ? 'active' : '' }}">
                     Espacios
                </a>
                <a href="{{ route('reservas.historial') }}" class="{{ request()->routeIs('reservas.historial') ? 'active' : '' }}">
                     Mis solicitudes
                </a>
                @if(session('api_user') && session('api_user')['id'] == 1)
                <a href="{{ route('admin.reservas') }}" class="{{ request()->routeIs('admin.*') ? 'active' : '' }}">
                     Administración
                </a>
                @endif
                <a href="{{ route('perfil.index') }}" class="{{ request()->routeIs('perfil.*') ? 'active' : '' }}">
                    👤 Mi perfil
                </a>
            </nav>
        </aside>

        <!-- Contenido principal -->
        <main class="main-content">
            <div class="top-bar">
                <div class="page-title">
                    <h2>@yield('subtitle', 'Panel de control')</h2>
                    <p>@yield('description', 'Gestiona tus reservas de espacios')</p>
                </div>
                <div class="user-menu">
                    <div class="user-avatar">
                        {{ substr(session('api_user')['nombre'] ?? 'U', 0, 1) }}
                    </div>
                    <span class="user-name">{{ session('api_user')['nombre'] ?? 'Usuario' }}</span>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="btn-logout">Cerrar sesión</button>
                    </form>
                </div>
            </div>
            <div class="content">
                @yield('content')
            </div>
        </main>
    </div>
</body>
</html>