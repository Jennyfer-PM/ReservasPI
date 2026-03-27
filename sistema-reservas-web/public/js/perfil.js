const API_URL = 'http://localhost:5000/api';

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

function showAdminLink(user) {
    const adminLink = document.getElementById('adminLink');
    if (adminLink && user.id === 1) {
        adminLink.style.display = 'flex';
    }
}

async function loadPerfil() {
    const user = checkAuth();
    if (!user) return;
    
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    if (userName) userName.textContent = user.usuario;
    if (userAvatar) userAvatar.textContent = user.usuario.charAt(0);
    
    showAdminLink(user);
    
    try {
        const response = await fetch(`${API_URL}/usuario/${user.id}`);
        const data = await response.json();
        
        const perfilNombre = document.getElementById('perfilNombre');
        const perfilEmail = document.getElementById('perfilEmail');
        const perfilTelefono = document.getElementById('perfilTelefono');
        const perfilCarrera = document.getElementById('perfilCarrera');
        const totales = document.getElementById('totales');
        const aprobadas = document.getElementById('aprobadas');
        const telefonoInput = document.getElementById('telefono');
        
        if (perfilNombre) perfilNombre.textContent = data.nombre || 'N/A';
        if (perfilEmail) perfilEmail.textContent = data.email || 'N/A';
        if (perfilTelefono) perfilTelefono.textContent = data.telefono || 'No registrado';
        if (perfilCarrera) perfilCarrera.textContent = data.carrera || 'No asignada';
        if (totales) totales.textContent = data.totales || 0;
        if (aprobadas) aprobadas.textContent = data.aprobadas || 0;
        if (telefonoInput) telefonoInput.value = data.telefono || '';
        
    } catch (error) {
        console.error('Error al cargar perfil:', error);
    }
}

const perfilForm = document.getElementById('perfilForm');
if (perfilForm) {
    perfilForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = checkAuth();
        if (!user) return;
        
        const telefono = document.getElementById('telefono').value;
        const contrasena = document.getElementById('contrasena').value;
        const msg = document.getElementById('perfilMsg');
        
        try {
            const response = await fetch(`${API_URL}/usuario/actualizar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id_persona: user.id, 
                    telefono: telefono,
                    contrasena: contrasena || undefined
                })
            });
            const data = await response.json();
            
            if (msg) {
                msg.style.display = 'block';
                msg.textContent = data.message || 'Perfil actualizado';
                msg.className = 'alert alert-success';
                setTimeout(() => msg.style.display = 'none', 3000);
            }
            if (contrasena) document.getElementById('contrasena').value = '';
            
        } catch (error) {
            if (msg) {
                msg.style.display = 'block';
                msg.textContent = 'Error al actualizar';
                msg.className = 'alert alert-danger';
                setTimeout(() => msg.style.display = 'none', 3000);
            }
        }
    });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

loadPerfil();