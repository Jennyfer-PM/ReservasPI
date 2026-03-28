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

function loadDashboard() {
    const user = checkAuth();
    if (!user) return;
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    showAdminLink(user);
    fetch(`${API_URL}/reservas`).then(res => res.json()).then(data => {
        const pendientes = data.filter(r => r.estado === 'Pendiente').length;
        document.getElementById('pendientes').textContent = pendientes;
        const hoy = new Date().toISOString().split('T')[0];
        const aprobadasHoy = data.filter(r => r.estado === 'Aprobada' && r.fecha?.startsWith(hoy)).length;
        document.getElementById('aprobadasHoy').textContent = aprobadasHoy;
        document.getElementById('espaciosActivos').textContent = [...new Set(data.map(r => r.espacio_nombre))].length;
        document.getElementById('usuariosActivos').textContent = [...new Set(data.map(r => r.alumno))].length;
        const tbody = document.getElementById('actividadTable');
        tbody.innerHTML = data.slice(0,5).map(r => `<tr><td>${r.proposito || '-'}</td><td>${r.espacio_nombre || '-'}</td><td>${r.fecha || '-'}</td><td><span class="badge badge-${r.estado?.toLowerCase()}">${r.estado || '-'}</span></td></tr>`).join('');
    }).catch(() => document.getElementById('actividadTable').innerHTML = '<tr><td colspan="4">Error</td></tr>');
}

document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.removeItem('user'); window.location.href = 'index.html'; });
loadDashboard();