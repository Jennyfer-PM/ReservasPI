const API_URL = 'http://localhost:5000/api';

let espacioSeleccionadoGlobal = null;

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) { window.location.href = 'index.html'; return null; }
    return JSON.parse(user);
}

function showAdminLink(user) {
    const adminLink = document.getElementById('adminLink');
    if (user.id === 1) adminLink.style.display = 'flex';
}

function obtenerTipoEspacio(espacioNombre) {
    if (!espacioNombre) return 'Sala';
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

function cargarActividadesAprobadas() {
    fetch(API_URL + '/reservas')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var aprobadas = data.filter(function(r) {
                return r.estado === 'Aprobada' || r.estado === 'Autorizada';
            });
            
            var laboratorios = [];
            var auditorios = [];
            var salas = [];
            var talleres = [];
            var bibliotecas = [];
            
            for (var i = 0; i < aprobadas.length; i++) {
                var r = aprobadas[i];
                var tipo = obtenerTipoEspacio(r.espacio_nombre);
                var fechaMostrar = r.fecha ? r.fecha.split(' ')[0] : 'N/A';
                var item = '<div class="actividad-item">' +
                    '<strong>' + (r.proposito || 'Sin título') + '</strong><br>' +
                    '📅 ' + fechaMostrar + '<br>' +
                    '🏢 ' + (r.espacio_nombre || 'N/A') + '<br>' +
                    '👤 ' + (r.alumno || 'N/A') +
                    '</div>';
                
                if (tipo === 'Laboratorio') laboratorios.push(item);
                else if (tipo === 'Auditorio') auditorios.push(item);
                else if (tipo === 'Sala') salas.push(item);
                else if (tipo === 'Taller') talleres.push(item);
                else if (tipo === 'Biblioteca') bibliotecas.push(item);
            }
            
            document.getElementById('labActividades').innerHTML = laboratorios.length > 0 ? laboratorios.join('') : 'No hay actividades aprobadas';
            document.getElementById('audActividades').innerHTML = auditorios.length > 0 ? auditorios.join('') : 'No hay actividades aprobadas';
            document.getElementById('salaActividades').innerHTML = salas.length > 0 ? salas.join('') : 'No hay actividades aprobadas';
            document.getElementById('tallerActividades').innerHTML = talleres.length > 0 ? talleres.join('') : 'No hay actividades aprobadas';
            document.getElementById('biblioActividades').innerHTML = bibliotecas.length > 0 ? bibliotecas.join('') : 'No hay actividades aprobadas';
        })
        .catch(function() {
            console.log('Error al cargar actividades');
        });
}

function loadEspacios() {
    const user = checkAuth();
    if (!user) return;
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    showAdminLink(user);
    
    fetch(`${API_URL}/espacios`).then(res => res.json()).then(data => {
        const grid = document.getElementById('espaciosGrid');
        grid.innerHTML = data.map(esp => {
            let descripcion = '';
            if (esp.tipo === 'Laboratorio') descripcion = 'Equipado con computadoras, proyectores y software especializado.';
            else if (esp.tipo === 'Auditorio') descripcion = 'Ideal para conferencias, con sonido profesional y pantalla gigante.';
            else if (esp.tipo === 'Sala') descripcion = 'Espacio cómodo para reuniones y clases teóricas.';
            else if (esp.tipo === 'Taller') descripcion = 'Área de trabajo con herramientas y equipamiento práctico.';
            else if (esp.tipo === 'Biblioteca') descripcion = 'Ambiente silencioso para estudio e investigación.';
            else descripcion = 'Espacio versátil para diferentes actividades académicas.';
            
            return `
                <div class="espacio-card" data-tipo="${esp.tipo}" data-nombre="${esp.nombre.toLowerCase()}" data-descripcion="${descripcion}" data-id="${esp.id}">
                    <h3>${esp.nombre}</h3>
                    <div class="espacio-info">📍 ${esp.ubicacion || 'No especificada'}</div>
                    <div class="espacio-info">👥 Capacidad: ${esp.capacidad} personas</div>
                    <div class="espacio-info">🏷️ Tipo: ${esp.tipo || 'General'}</div>
                    <div class="espacio-actions">
                        <span class="badge badge-aprobada">Disponible</span>
                        <button class="btn btn-info" onclick="mostrarInfo(${esp.id})">📋 Más info</button>
                    </div>
                </div>
            `;
        }).join('');
        cargarActividadesAprobadas();
    }).catch(() => document.getElementById('espaciosGrid').innerHTML = '<div>Error al cargar espacios</div>');
}

function mostrarInfo(id) {
    fetch(`${API_URL}/espacios`)
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

document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.removeItem('user'); window.location.href = 'index.html'; });

// Filtros y búsqueda
document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.espacio-card').forEach(card => {
        card.style.display = (filter === 'todos' || card.dataset.tipo === filter) ? 'block' : 'none';
    });
}));

document.getElementById('search').addEventListener('input', function() {
    const search = this.value.toLowerCase();
    document.querySelectorAll('.espacio-card').forEach(card => {
        card.style.display = card.dataset.nombre.includes(search) ? 'block' : 'none';
    });
});

loadEspacios();