const API_URL = 'http://localhost:5000/api';

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

function loadSolicitudes() {
    const user = checkAuth();
    if (!user) return;
    
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    
    fetch(API_URL + '/reservas')
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            var pendientes = [];
            var aprobadas = [];
            var rechazadas = [];
            
            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                if (r.estado === 'Pendiente') {
                    pendientes.push(r);
                } else if (r.estado === 'Aprobada' || r.estado === 'Autorizada') {
                    aprobadas.push(r);
                } else if (r.estado === 'Rechazada') {
                    rechazadas.push(r);
                }
            }
            
            document.getElementById('pendientesCount').textContent = pendientes.length;
            document.getElementById('aprobadasCount').textContent = aprobadas.length;
            document.getElementById('rechazadasCount').textContent = rechazadas.length;
            
            var pendientesHtml = '';
            for (var i = 0; i < pendientes.length; i++) {
                var r = pendientes[i];
                var titulo = r.proposito || 'Sin título';
                pendientesHtml = pendientesHtml + 
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h4>📌 ' + titulo + '</h4>' +
                            '<p>🏢 <strong>Espacio:</strong> ' + (r.espacio_nombre || 'N/A') + '</p>' +
                            '<p>👤 <strong>Solicitante:</strong> ' + (r.alumno || 'N/A') + '</p>' +
                            '<p>📅 <strong>Fecha:</strong> ' + (r.fecha || 'N/A') + '</p>' +
                            '<span class="badge badge-pendiente">⏳ Pendiente</span>' +
                        '</div>' +
                    '</div>';
            }
            if (pendientesHtml === '') {
                pendientesHtml = '<div class="card"><div class="card-body">📭 No hay solicitudes pendientes</div></div>';
            }
            document.getElementById('pendientes').innerHTML = pendientesHtml;
            
            var aprobadasHtml = '';
            for (var i = 0; i < aprobadas.length; i++) {
                var r = aprobadas[i];
                var titulo = r.proposito || 'Sin título';
                aprobadasHtml = aprobadasHtml + 
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h4>✅ ' + titulo + '</h4>' +
                            '<p>🏢 <strong>Espacio:</strong> ' + (r.espacio_nombre || 'N/A') + '</p>' +
                            '<p>👤 <strong>Solicitante:</strong> ' + (r.alumno || 'N/A') + '</p>' +
                            '<p>📅 <strong>Fecha:</strong> ' + (r.fecha || 'N/A') + '</p>' +
                            '<span class="badge badge-aprobada">✅ Aprobada</span>' +
                        '</div>' +
                    '</div>';
            }
            if (aprobadasHtml === '') {
                aprobadasHtml = '<div class="card"><div class="card-body">📭 No hay solicitudes aprobadas</div></div>';
            }
            document.getElementById('aprobadas').innerHTML = aprobadasHtml;
            
            var rechazadasHtml = '';
            for (var i = 0; i < rechazadas.length; i++) {
                var r = rechazadas[i];
                var titulo = r.proposito || 'Sin título';
                rechazadasHtml = rechazadasHtml + 
                    '<div class="card">' +
                        '<div class="card-body">' +
                            '<h4>❌ ' + titulo + '</h4>' +
                            '<p>🏢 <strong>Espacio:</strong> ' + (r.espacio_nombre || 'N/A') + '</p>' +
                            '<p>👤 <strong>Solicitante:</strong> ' + (r.alumno || 'N/A') + '</p>' +
                            '<p>📅 <strong>Fecha:</strong> ' + (r.fecha || 'N/A') + '</p>' +
                            '<span class="badge badge-rechazada">❌ Rechazada</span>' +
                        '</div>' +
                    '</div>';
            }
            if (rechazadasHtml === '') {
                rechazadasHtml = '<div class="card"><div class="card-body">📭 No hay solicitudes rechazadas</div></div>';
            }
            document.getElementById('rechazadas').innerHTML = rechazadasHtml;
        })
        .catch(function() {
            document.getElementById('pendientes').innerHTML = '<div class="card"><div class="card-body">❌ Error al cargar datos</div></div>';
        });
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(function(p) {
            p.classList.remove('active');
        });
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

loadSolicitudes();