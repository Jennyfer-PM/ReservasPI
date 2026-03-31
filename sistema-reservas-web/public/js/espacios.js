const API_URL = 'http://localhost:5000/api';

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) { window.location.href = 'index.html'; return null; }
    return JSON.parse(user);
}

function showAdminLink(user) {
    const adminLink = document.getElementById('adminLink');
    if (user.id === 1) adminLink.style.display = 'flex';
}

function obtenerTipoEspacio(espacioNombre, espacioTipo) {
    // Primero usar el tipo que viene de FastAPI
    if (espacioTipo) {
        if (espacioTipo === 'Laboratorio') return 'Laboratorio';
        if (espacioTipo === 'Auditorio') return 'Auditorio';
        if (espacioTipo === 'Sala') return 'Sala';
        if (espacioTipo === 'Taller') return 'Taller';
        if (espacioTipo === 'Biblioteca') return 'Biblioteca';
    }
    
    // Si no, determinar por el nombre
    var nombre = espacioNombre.toLowerCase();
    if (nombre.includes('laboratorio') || nombre.includes('computo') || nombre.includes('lab')) {
        return 'Laboratorio';
    } else if (nombre.includes('auditorio')) {
        return 'Auditorio';
    } else if (nombre.includes('sala') || nombre.includes('aula')) {
        return 'Sala';
    } else if (nombre.includes('taller')) {
        return 'Taller';
    } else if (nombre.includes('biblioteca')) {
        return 'Biblioteca';
    }
    return 'Sala';
}

function mostrarCategoria(categoria) {
    document.getElementById('categoriaLaboratorios').style.display = 'none';
    document.getElementById('categoriaAuditorios').style.display = 'none';
    document.getElementById('categoriaSalas').style.display = 'none';
    document.getElementById('categoriaTalleres').style.display = 'none';
    document.getElementById('categoriaBiblioteca').style.display = 'none';
    document.getElementById('categoriaTodos').style.display = 'none';
    
    if (categoria === 'Laboratorio') {
        document.getElementById('categoriaLaboratorios').style.display = 'block';
    } else if (categoria === 'Auditorio') {
        document.getElementById('categoriaAuditorios').style.display = 'block';
    } else if (categoria === 'Sala') {
        document.getElementById('categoriaSalas').style.display = 'block';
    } else if (categoria === 'Taller') {
        document.getElementById('categoriaTalleres').style.display = 'block';
    } else if (categoria === 'Biblioteca') {
        document.getElementById('categoriaBiblioteca').style.display = 'block';
    } else {
        document.getElementById('categoriaTodos').style.display = 'block';
    }
}

function loadEspacios() {
    const user = checkAuth();
    if (!user) return;
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    showAdminLink(user);
    
    Promise.all([
        fetch(API_URL + '/espacios').then(res => res.json()),
        fetch(API_URL + '/reservas').then(res => res.json())
    ]).then(function(results) {
        var espacios = results[0];
        var reservas = results[1];
        
        // Obtener la fecha de hoy sin hora
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        // Filtrar solo reservas aprobadas con fecha >= hoy
        var reservasAprobadas = reservas.filter(function(r) {
            if (r.estado !== 'Autorizada') return false;
            
            var fechaReserva = new Date(r.fecha);
            fechaReserva.setHours(0, 0, 0, 0);
            
            return fechaReserva >= hoy;
        });
        
        var espaciosOcupadosPorNombre = {};
        for (var i = 0; i < reservasAprobadas.length; i++) {
            var r = reservasAprobadas[i];
            espaciosOcupadosPorNombre[r.espacio_nombre] = r;
        }
        
        function generarTarjeta(esp) {
            var ocupado = espaciosOcupadosPorNombre[esp.nombre];
            var badgeClass = 'badge-aprobada';
            var badgeText = 'Disponible';
            var infoReserva = '';
            
            if (ocupado) {
                badgeClass = 'badge-ocupado';
                badgeText = 'Ocupado';
                var fechaMostrar = ocupado.fecha ? ocupado.fecha.split(' ')[0] : 'N/A';
                var horaMostrar = ocupado.fecha ? ocupado.fecha.split(' ')[1] : 'N/A';
                infoReserva = '<div class="reserva-info">📅 ' + fechaMostrar + ' ' + horaMostrar + ' - ' + (ocupado.proposito || 'Evento') + ' (Solicitante: ' + (ocupado.alumno || 'N/A') + ')</div>';
            }
            
            var descripcion = '';
            if (esp.tipo === 'Laboratorio') descripcion = 'Equipado con computadoras, proyectores y software especializado.';
            else if (esp.tipo === 'Auditorio') descripcion = 'Ideal para conferencias, con sonido profesional y pantalla gigante.';
            else if (esp.tipo === 'Sala') descripcion = 'Espacio cómodo para reuniones y clases teóricas.';
            else if (esp.tipo === 'Taller') descripcion = 'Área de trabajo con herramientas y equipamiento práctico.';
            else if (esp.tipo === 'Biblioteca') descripcion = 'Ambiente silencioso para estudio e investigación.';
            else descripcion = 'Espacio versátil para diferentes actividades académicas.';
            
            return `
                <div class="espacio-card" data-tipo="${esp.tipo}" data-nombre="${esp.nombre.toLowerCase()}" data-id="${esp.id}">
                    <h3>🏢 ${esp.nombre}</h3>
                    <div class="espacio-info">📍 ${esp.ubicacion || 'No especificada'}</div>
                    <div class="espacio-info">👥 Capacidad: ${esp.capacidad} personas</div>
                    <div class="espacio-info">🏷️ Tipo: ${esp.tipo || 'General'}</div>
                    <div class="espacio-info">📝 ${descripcion}</div>
                    ${infoReserva}
                    <div class="espacio-actions">
                        <span class="badge ${badgeClass}">${badgeText}</span>
                        <button class="btn btn-info" onclick="mostrarInfo(${esp.id})">📋 Más info</button>
                    </div>
                </div>
            `;
        }
        
        var laboratorios = [];
        var auditorios = [];
        var salas = [];
        var talleres = [];
        var bibliotecas = [];
        var todos = [];
        
        for (var i = 0; i < espacios.length; i++) {
            var esp = espacios[i];
            var tipoReal = obtenerTipoEspacio(esp.nombre, esp.tipo);
            var tarjeta = generarTarjeta(esp);
            todos.push(tarjeta);
            
            if (tipoReal === 'Laboratorio') {
                laboratorios.push(tarjeta);
            } else if (tipoReal === 'Auditorio') {
                auditorios.push(tarjeta);
            } else if (tipoReal === 'Sala') {
                salas.push(tarjeta);
            } else if (tipoReal === 'Taller') {
                talleres.push(tarjeta);
            } else if (tipoReal === 'Biblioteca') {
                bibliotecas.push(tarjeta);
            } else {
                salas.push(tarjeta);
            }
        }
        
        document.getElementById('todosEspacios').innerHTML = todos.length > 0 ? todos.join('') : 'No hay espacios disponibles';
        document.getElementById('labEspacios').innerHTML = laboratorios.length > 0 ? laboratorios.join('') : 'No hay laboratorios disponibles';
        document.getElementById('audEspacios').innerHTML = auditorios.length > 0 ? auditorios.join('') : 'No hay auditorios disponibles';
        document.getElementById('salaEspacios').innerHTML = salas.length > 0 ? salas.join('') : 'No hay salas disponibles';
        document.getElementById('tallerEspacios').innerHTML = talleres.length > 0 ? talleres.join('') : 'No hay talleres disponibles';
        document.getElementById('biblioEspacios').innerHTML = bibliotecas.length > 0 ? bibliotecas.join('') : 'No hay espacios de biblioteca disponibles';
        
        mostrarCategoria('todos');
    }).catch(function(error) {
        console.log('Error:', error);
        document.getElementById('todosEspacios').innerHTML = '<div>Error al cargar espacios</div>';
    });
}

function mostrarInfo(id) {
    fetch(API_URL + '/espacios')
        .then(res => res.json())
        .then(data => {
            const espacio = data.find(e => e.id === id);
            if (espacio) {
                let descripcion = '';
                if (espacio.tipo === 'Laboratorio') descripcion = 'Equipado con computadoras, proyectores y software especializado.';
                else if (espacio.tipo === 'Auditorio') descripcion = 'Ideal para conferencias, con sonido profesional y pantalla gigante.';
                else if (espacio.tipo === 'Sala') descripcion = 'Espacio cómodo para reuniones y clases teóricas.';
                else if (espacio.tipo === 'Taller') descripcion = 'Área de trabajo con herramientas y equipamiento práctico.';
                else if (espacio.tipo === 'Biblioteca') descripcion = 'Ambiente silencioso para estudio e investigación.';
                else descripcion = 'Espacio versátil para diferentes actividades académicas.';
                
                document.getElementById('infoNombre').textContent = espacio.nombre;
                document.getElementById('infoUbicacion').textContent = espacio.ubicacion || 'No especificada';
                document.getElementById('infoCapacidad').textContent = espacio.capacidad;
                document.getElementById('infoTipo').textContent = espacio.tipo || 'General';
                document.getElementById('infoDescripcion').textContent = descripcion;
                document.getElementById('modalInfo').style.display = 'flex';
            }
        });
}

function cerrarModalInfo() {
    document.getElementById('modalInfo').style.display = 'none';
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        mostrarCategoria(this.dataset.filter);
    });
});

document.getElementById('search').addEventListener('input', function() {
    var search = this.value.toLowerCase();
    var todasTarjetas = document.querySelectorAll('.espacio-card');
    for (var i = 0; i < todasTarjetas.length; i++) {
        var card = todasTarjetas[i];
        var nombre = card.dataset.nombre;
        if (nombre && nombre.includes(search)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    }
});

loadEspacios();