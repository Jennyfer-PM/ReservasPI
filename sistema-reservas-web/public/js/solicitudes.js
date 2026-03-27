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

function loadSolicitudes() {
    const user = checkAuth();
    if (!user) return;
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    showAdminLink(user);
    fetch(`${API_URL}/reservas/usuario/${user.id}`).then(res => res.json()).then(data => {
        const pendientes = data.filter(r => r.estado === 'Pendiente');
        const aprobadas = data.filter(r => r.estado === 'Aprobada');
        const rechazadas = data.filter(r => r.estado === 'Rechazada');
        document.getElementById('pendientesCount').textContent = pendientes.length;
        document.getElementById('aprobadasCount').textContent = aprobadas.length;
        document.getElementById('rechazadasCount').textContent = rechazadas.length;
        document.getElementById('pendientes').innerHTML = pendientes.map(r => `<div class="card"><div class="card-body"><h4>${r.nombre_evento || 'Sin título'}</h4><p><strong>Espacio:</strong> ${r.nombre_espacio || 'N/A'}</p><p><strong>Fecha:</strong> ${r.fecha || 'N/A'}</p><p><strong>Horario:</strong> ${r.hora_inicio || 'N/A'}</p><span class="badge badge-pendiente">Pendiente</span></div></div>`).join('') || '<div class="card"><div class="card-body">No hay solicitudes</div></div>';
        document.getElementById('aprobadas').innerHTML = aprobadas.map(r => `<div class="card"><div class="card-body"><h4>${r.nombre_evento || 'Sin título'}</h4><p><strong>Espacio:</strong> ${r.nombre_espacio || 'N/A'}</p><p><strong>Fecha:</strong> ${r.fecha || 'N/A'}</p><span class="badge badge-aprobada">Aprobada</span></div></div>`).join('') || '<div class="card"><div class="card-body">No hay solicitudes</div></div>';
        document.getElementById('rechazadas').innerHTML = rechazadas.map(r => `<div class="card"><div class="card-body"><h4>${r.nombre_evento || 'Sin título'}</h4><p><strong>Espacio:</strong> ${r.nombre_espacio || 'N/A'}</p><p><strong>Fecha:</strong> ${r.fecha || 'N/A'}</p><span class="badge badge-rechazada">Rechazada</span></div></div>`).join('') || '<div class="card"><div class="card-body">No hay solicitudes</div></div>';
    }).catch(() => console.error('Error'));
}

document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.removeItem('user'); window.location.href = 'index.html'; });
document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.dataset.tab).classList.add('active');
}));
loadSolicitudes();