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

function loadEspacios() {
    const user = checkAuth();
    if (!user) return;
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    showAdminLink(user);
    fetch(`${API_URL}/espacios`).then(res => res.json()).then(data => {
        const grid = document.getElementById('espaciosGrid');
        grid.innerHTML = data.map(esp => `
            <div class="espacio-card" data-tipo="${esp.tipo}" data-nombre="${esp.nombre.toLowerCase()}">
                <h3>${esp.nombre}</h3>
                <div class="espacio-info">📍 ${esp.ubicacion || 'No especificada'}</div>
                <div class="espacio-info">👥 Capacidad: ${esp.capacidad} personas</div>
                <div class="espacio-actions">
                    <span class="badge badge-aprobada">Disponible</span>
                    <button class="btn btn-primary" onclick="solicitarEspacio(${esp.id})">Solicitar</button>
                </div>
            </div>
        `).join('');
    }).catch(() => document.getElementById('espaciosGrid').innerHTML = '<div>Error</div>');
}

document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.removeItem('user'); window.location.href = 'index.html'; });

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

// Variables para el modal
let espacioSeleccionado = null;

function solicitarEspacio(id) {
    espacioSeleccionado = id;
    document.getElementById('espacioId').value = id;
    document.getElementById('nombreEvento').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('hora').value = '';
    document.getElementById('duracion').value = '2';
    document.getElementById('asistentes').value = '';
    document.getElementById('detalles').value = '';
    document.getElementById('modalSolicitar').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalSolicitar').style.display = 'none';
    espacioSeleccionado = null;
}

async function enviarSolicitud() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Debes iniciar sesión');
        window.location.href = 'index.html';
        return;
    }

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const duracion = parseInt(document.getElementById('duracion').value);
    const nombreEvento = document.getElementById('nombreEvento').value;
    const asistentes = document.getElementById('asistentes').value;
    const detalles = document.getElementById('detalles').value;

    if (!fecha || !hora || !nombreEvento || !asistentes) {
        alert('Por favor completa todos los campos');
        return;
    }

    const fechaHora = `${fecha}T${hora}:00`;

    const reservaData = {
        id_docente: 1,
        nombre: nombreEvento,
        id_espacio: espacioSeleccionado,
        fecha: fechaHora,
        duracion: duracion,
        id_servicio: 1,
        detalles: detalles,
        asistentes: parseInt(asistentes)
    };

    try {
        const response = await fetch('http://localhost:5000/api/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });

        if (response.ok) {
            alert('✅ Solicitud enviada exitosamente');
            cerrarModal();
        } else if (response.status === 409) {
            alert('⚠️ El espacio ya está reservado en ese horario. Por favor elige otra fecha u hora.');
        } else {
            const error = await response.json();
            alert('❌ Error: ' + (error.detail || 'No se pudo enviar la solicitud'));
        }
    } catch (error) {
        alert('❌ Error de conexión con el servidor');
    }
}

loadEspacios();