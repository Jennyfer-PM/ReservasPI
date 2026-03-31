const API_URL = 'http://localhost:5000/api';

let chartInstance = null;

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
    if (user.id === 1) {
        adminLink.style.display = 'flex';
    }
}

function actualizarDashboard() {
    const user = checkAuth();
    if (!user) return;
    
    document.getElementById('userName').textContent = user.usuario;
    document.getElementById('userAvatar').textContent = user.usuario.charAt(0);
    showAdminLink(user);
    
    fetch(API_URL + '/reservas')
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            var pendientes = 0;
            var aprobadasHoy = 0;
            var espaciosActivos = 0;
            var usuariosActivos = 0;
            var totalPendientes = 0;
            var totalAprobadas = 0;
            var totalRechazadas = 0;
            
            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                
                if (r.estado === 'Pendiente') {
                    pendientes++;
                    totalPendientes++;
                }
                if (r.estado === 'Aprobada' || r.estado === 'Autorizada') {
                    totalAprobadas++;
                    var hoy = new Date().toISOString().split('T')[0];
                    if (r.fecha && r.fecha.startsWith(hoy)) {
                        aprobadasHoy++;
                    }
                }
                if (r.estado === 'Rechazada') {
                    totalRechazadas++;
                }
            }
            
            var nombresEspacios = [];
            for (var i = 0; i < data.length; i++) {
                var nombre = data[i].espacio_nombre;
                if (nombre && nombresEspacios.indexOf(nombre) === -1) {
                    nombresEspacios.push(nombre);
                }
            }
            espaciosActivos = nombresEspacios.length;
            
            var nombresAlumnos = [];
            for (var i = 0; i < data.length; i++) {
                var alumno = data[i].alumno;
                if (alumno && nombresAlumnos.indexOf(alumno) === -1) {
                    nombresAlumnos.push(alumno);
                }
            }
            usuariosActivos = nombresAlumnos.length;
            
            document.getElementById('pendientes').textContent = pendientes;
            document.getElementById('aprobadasHoy').textContent = aprobadasHoy;
            document.getElementById('espaciosActivos').textContent = espaciosActivos;
            document.getElementById('usuariosActivos').textContent = usuariosActivos;
            
            var ctx = document.getElementById('solicitudesChart').getContext('2d');
            
            if (chartInstance !== null) {
                chartInstance.destroy();
            }
            
            chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
                    datasets: [{
                        data: [totalPendientes, totalAprobadas, totalRechazadas],
                        backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
                        borderColor: ['#e0a800', '#1e7e34', '#bd2130'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Estado de solicitudes'
                        }
                    }
                }
            });
            
            var dataOrdenada = [];
            for (var i = 0; i < data.length; i++) {
                dataOrdenada.push(data[i]);
            }
            
            for (var i = 0; i < dataOrdenada.length - 1; i++) {
                for (var j = i + 1; j < dataOrdenada.length; j++) {
                    var fechaA = dataOrdenada[i].fecha;
                    var fechaB = dataOrdenada[j].fecha;
                    if (!fechaA) fechaA = '';
                    if (!fechaB) fechaB = '';
                    if (fechaA < fechaB) {
                        var temp = dataOrdenada[i];
                        dataOrdenada[i] = dataOrdenada[j];
                        dataOrdenada[j] = temp;
                    }
                }
            }
            
            var tbody = document.getElementById('actividadTable');
            var filas = '';
            var limite = 5;
            if (dataOrdenada.length < limite) {
                limite = dataOrdenada.length;
            }
            for (var i = 0; i < limite; i++) {
                var r = dataOrdenada[i];
                var estadoClass = '';
                if (r.estado === 'Pendiente') {
                    estadoClass = 'pendiente';
                } else if (r.estado === 'Aprobada' || r.estado === 'Autorizada') {
                    estadoClass = 'aprobada';
                } else if (r.estado === 'Rechazada') {
                    estadoClass = 'rechazada';
                }
                filas = filas + '<tr>' +
                    '<td>' + (r.proposito || '-') + '</td>' +
                    '<td>' + (r.espacio_nombre || '-') + '</td>' +
                    '<td>' + (r.fecha || '-') + '</td>' +
                    '<td><span class="badge badge-' + estadoClass + '">' + (r.estado || '-') + '</span></td>' +
                '</tr>';
            }
            if (filas === '') {
                tbody.innerHTML = '<tr><td colspan="4">No hay actividad reciente</td></tr>';
            } else {
                tbody.innerHTML = filas;
            }
        })
        .catch(function() {
            document.getElementById('actividadTable').innerHTML = '<tr><td colspan="4">Error al cargar datos</td></tr>';
        });
}

function recargarDashboard() {
    actualizarDashboard();
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

actualizarDashboard();
setInterval(recargarDashboard, 10000);