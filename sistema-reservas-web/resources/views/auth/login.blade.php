<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión - Sistema Reservas UPQ</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body style="background: linear-gradient(135deg, #1e2a3a, #0f1724); display: flex; justify-content: center; align-items: center; min-height: 100vh;">
    <div class="login-container">
        <div class="login-card">
            <div class="logo">
                <h2>Reservas UPQ</h2>
                <p>Universidad Politécnica</p>
            </div>
            <div class="login-title">
                <h3>Iniciar sesión</h3>
            </div>
            
            @if($errors->any())
                <div class="alert alert-danger">
                    {{ $errors->first() }}
                </div>
            @endif
            
            <form method="POST" action="http://localhost:8000/login">
                @csrf
                <div class="form-group">
                    <label for="correo">Correo electrónico</label>
                    <input type="email" class="form-control" id="correo" name="correo" required>
                </div>
                <div class="form-group">
                    <label for="clave">Contraseña</label>
                    <input type="password" class="form-control" id="clave" name="clave" required>
                </div>
                <button type="submit" class="btn-login">Ingresar</button>
            </form>
            <div class="footer" style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
                <p>Sistema de reservas de espacios UPQ</p>
            </div>
        </div>
    </div>
</body>
</html>