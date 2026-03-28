const API_URL = 'http://localhost:5000/api';

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) { window.location.href = 'index.html'; return null; }
    const userObj = JSON.parse(user);
    if (userObj.id !== 1) { window.location.href = 'dashboard.html'; return null; }
    return userObj;
}

function loadAdmin() {
    const user = checkAuth();
    if (!user) return;
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    fetch(`${API_URL}/reservas`).then(res => res.json()).then(data => {
        const pendientes = data.filter(r => r.estado === 'Pendiente').length;
        document.getElementById('pendientes').textContent = pendientes;
        const hoy = new Date().toISOString().split('T')[0];
        const aprobadasHoy = data.filter(r => r.estado === 'Aprobada' && r.fecha?.startsWith(hoy)).length;
        document.getElementById('aprobadasHoy').textContent = aprobadasHoy;
        document.getElementById('espaciosActivos').textContent = [...new Set(data.map(r => r.espacio_nombre))].length;
        document.getElementById('usuariosActivos').textContent = [...new Set(data.map(r => r.alumno))].length;
        const tbody = document.getElementById('reservasTable');
        tbody.innerHTML = data.map(r => `
            <tr>
                <td>${r.espacio_nombre || '-'}</td>
                <td>${r.alumno || '-'}</td>
                <td>${r.fecha || '-'}</td>
                <td>${r.proposito || '-'}</td>
                <td><span class="badge badge-${r.estado?.toLowerCase()}">${r.estado || '-'}</span></td>
                <td>${r.estado === 'Pendiente' ? `<button class="btn btn-success btn-sm" onclick="aprobar(${r.id})">Aprobar</button> <button class="btn btn-danger btn-sm" onclick="rechazar(${r.id})">Rechazar</button>` : '-'}</td>
            </tr>
        `).join('');
    }).catch(() => document.getElementById('reservasTable').innerHTML = '<tr><td colspan="6">Error</td></tr>');
}

window.aprobar = (id) => alert(`Aprobar reserva ID: ${id}`);
window.rechazar = (id) => alert(`Rechazar reserva ID: ${id}`);

document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.removeItem('user'); window.location.href = 'index.html'; });
loadAdmin();