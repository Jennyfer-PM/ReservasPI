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

window.solicitarEspacio = (id) => alert(`Solicitar espacio ID: ${id}`);

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

loadEspacios();