const API_URL = 'http://localhost:5000/api';

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

function loadPerfil() {
    const user = checkAuth();
    if (!user) return;
    
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    
    fetch(API_URL + '/usuario/' + user.id)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            document.getElementById('perfilNombre').textContent = data.nombre || user.usuario;
            document.getElementById('perfilEmail').textContent = data.email || user.email;
            document.getElementById('perfilTelefono').textContent = data.telefono || 'No registrado';
            document.getElementById('perfilCarrera').textContent = data.carrera || 'No asignada';
            document.getElementById('telefono').value = data.telefono || '';
        })
        .catch(function() {
            console.log('Error al cargar perfil');
        });
    
    fetch(API_URL + '/reservas')
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            var total = data.length;
            var aprobadas = 0;
            var rechazadas = 0;
            
            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                if (r.estado === 'Aprobada' || r.estado === 'Autorizada') {
                    aprobadas++;
                } else if (r.estado === 'Rechazada') {
                    rechazadas++;
                }
            }
            
            document.getElementById('totales').textContent = total;
            document.getElementById('aprobadas').textContent = aprobadas;
            document.getElementById('rechazadas').textContent = rechazadas;
        })
        .catch(function() {
            document.getElementById('totales').textContent = 'Error';
        });
}

document.getElementById('perfilForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = checkAuth();
    if (!user) return;
    
    var telefono = document.getElementById('telefono').value;
    var contrasena = document.getElementById('contrasena').value;
    var msg = document.getElementById('perfilMsg');
    
    var data = {
        id_persona: user.id,
        telefono: telefono
    };
    
    if (contrasena) {
        data.contrasena = contrasena;
    }
    
    fetch(API_URL + '/usuario/actualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        msg.style.display = 'block';
        msg.textContent = data.message || 'Perfil actualizado';
        msg.className = 'alert alert-success';
        setTimeout(function() {
            msg.style.display = 'none';
        }, 3000);
        if (contrasena) {
            document.getElementById('contrasena').value = '';
        }
    })
    .catch(function() {
        msg.style.display = 'block';
        msg.textContent = 'Error al actualizar';
        msg.className = 'alert alert-danger';
        setTimeout(function() {
            msg.style.display = 'none';
        }, 3000);
    });
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

loadPerfil();