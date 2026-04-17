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
        console.log("Datos recibidos:", data);
        console.log("Estados:", data.map(r => r.estado));
        const pendientes = data.filter(r => r.estado === 'Pendiente').length;
        document.getElementById('pendientes').textContent = pendientes;
        const hoy = new Date().toISOString().split('T')[0];
        const aprobadasHoy = data.filter(r => (r.estado === 'Aprobada' || r.estado === 'Autorizada') && r.fecha?.startsWith(hoy)).length;
        document.getElementById('aprobadasHoy').textContent = aprobadasHoy;
        document.getElementById('espaciosActivos').textContent = [...new Set(data.map(r => r.espacio_nombre))].length;
        document.getElementById('usuariosActivos').textContent = [...new Set(data.map(r => r.alumno))].length;
        const tbody = document.getElementById('reservasTable');
        tbody.innerHTML = data.map(r => `
            <tr>
                <td><strong>${r.espacio_nombre || '-'}</strong>
                <td>${r.alumno || '-'}
                <td>${r.fecha || '-'}
                <td>${r.proposito || '-'}
                <td><span class="badge badge-${r.estado?.toLowerCase()}">${r.estado || '-'}</span>
                <td>${r.estado === 'Pendiente' ? `<button class="btn btn-success btn-sm" onclick="aprobar(${r.id_reserva})">Aprobar</button> <button class="btn btn-danger btn-sm" onclick="rechazar(${r.id_reserva})">Rechazar</button>` : '-'}
             
        `).join('');
    }).catch(() => document.getElementById('reservasTable').innerHTML = '<td colspan="6">Error al cargar datos\\');
}

// Funciones de aprobar/rechazar con manejo de error 409
window.aprobar = async (id) => {
    if (confirm('¿Aprobar esta reserva?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/reservas/${id}/aprobar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                alert('✅ Reserva aprobada');
                location.reload();
            } else if (response.status === 409) {
                alert('⚠️ El espacio ya está reservado en ese horario. No se puede aprobar.');
            } else {
                alert('❌ Error al aprobar');
            }
        } catch (error) {
            alert('❌ Error de conexión');
        }
    }
};

window.rechazar = async (id) => {
    if (confirm('¿Rechazar esta reserva?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/reservas/${id}/rechazar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                alert('✅ Reserva rechazada');
                location.reload();
            } else {
                alert('❌ Error al rechazar');
            }
        } catch (error) {
            alert('❌ Error de conexión');
        }
    }
};

// EXPORTAR A EXCEL (encabezados verdes, filas blancas, bordes grises, con pie de página)
function exportToExcel() {
    try {
        if (typeof XLSX === 'undefined') {
            alert('Error: Librería XLSX no cargada');
            return;
        }
        
        const table = document.getElementById('reservasTable');
        const rows = table.querySelectorAll('tbody tr');
        const data = [];
        
        // Contar aprobados y rechazados
        let totalAprobados = 0;
        let totalRechazados = 0;
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const estado = cells[4]?.innerText.trim() || '';
                if (estado === 'Autorizada') totalAprobados++;
                else if (estado === 'Rechazada') totalRechazados++;
            }
        });
        
        // TÍTULO (bien centrado, sin que se corte)
        data.push(["SISTEMA DE RESERVAS UPQ"]);
        data.push([]);
        data.push(["Fecha de generación:", new Date().toLocaleString('es-MX')]);
        data.push(["Total de registros:", rows.length]);
        data.push(["Total de aprobados:", totalAprobados]);
        data.push(["Total de rechazados:", totalRechazados]);
        data.push([]);
        
        // ENCABEZADOS
        data.push(["ESPACIO", "SOLICITANTE", "FECHA", "PROPÓSITO", "ESTADO"]);
        
        // DATOS
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                data.push([
                    cells[0]?.innerText.trim() || '-',
                    cells[1]?.innerText.trim() || '-',
                    cells[2]?.innerText.trim() || '-',
                    cells[3]?.innerText.trim() || '-',
                    cells[4]?.innerText.trim() || '-'
                ]);
            }
        });
        
        // PIE DE PÁGINA
        data.push([]);
        data.push(["Reporte generado automáticamente por el Sistema de Reservas UPQ"]);
        
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // ANCHOS DE COLUMNAS
        ws['!cols'] = [
            {wch: 30},  // Espacio
            {wch: 25},  // Solicitante
            {wch: 20},  // Fecha
            {wch: 35},  // Propósito
            {wch: 15}   // Estado
        ];
        
        // APLICAR ESTILOS
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
                if (!ws[cellRef]) continue;
                
                // TÍTULO (fila 0) - Verde, texto blanco, centrado
                if (i === 0) {
                    ws[cellRef].s = {
                        font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
                        fill: { fgColor: { rgb: "1abc9c" } },
                        alignment: { horizontal: "center", vertical: "center" }
                    };
                }
                // INFORMACIÓN DEL REPORTE (filas 2 a 6) - Fondo gris claro
                else if (i >= 2 && i <= 6) {
                    ws[cellRef].s = {
                        font: { bold: i === 2 ? false : true, sz: 11 },
                        fill: { fgColor: { rgb: "E9F0F9" } },
                        alignment: { horizontal: "left" }
                    };
                    // Color verde para "Total de aprobados"
                    if (data[i][0] === "Total de aprobados:") {
                        ws[cellRef].s.font = { bold: true, color: { rgb: "2E7D32" } };
                    }
                    // Color rojo para "Total de rechazados"
                    if (data[i][0] === "Total de rechazados:") {
                        ws[cellRef].s.font = { bold: true, color: { rgb: "D32F2F" } };
                    }
                }
                // ENCABEZADOS DE TABLA (fila 7) - Verde, texto blanco
                else if (i === 7) {
                    ws[cellRef].s = {
                        font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
                        fill: { fgColor: { rgb: "1abc9c" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        border: {
                            top: { style: "thin", color: { rgb: "FFFFFF" } },
                            bottom: { style: "thin", color: { rgb: "FFFFFF" } },
                            left: { style: "thin", color: { rgb: "FFFFFF" } },
                            right: { style: "thin", color: { rgb: "FFFFFF" } }
                        }
                    };
                }
                // DATOS (fila > 7) - Fondo blanco, bordes grises
                else if (i > 7 && i < data.length - 1) {
                    ws[cellRef].s = {
                        fill: { fgColor: { rgb: "FFFFFF" } },
                        alignment: { vertical: "center" },
                        border: {
                            top: { style: "thin", color: { rgb: "D0D0D0" } },
                            bottom: { style: "thin", color: { rgb: "D0D0D0" } },
                            left: { style: "thin", color: { rgb: "D0D0D0" } },
                            right: { style: "thin", color: { rgb: "D0D0D0" } }
                        }
                    };
                    
                    // COLOR PARA ESTADO (columna 4)
                    if (j === 4) {
                        const estado = ws[cellRef].v;
                        if (estado === 'Autorizada') {
                            ws[cellRef].s.font = { bold: true, color: { rgb: "2E7D32" } };
                        } else if (estado === 'Pendiente') {
                            ws[cellRef].s.font = { bold: true, color: { rgb: "ED6C02" } };
                        } else if (estado === 'Rechazada') {
                            ws[cellRef].s.font = { bold: true, color: { rgb: "D32F2F" } };
                        }
                    }
                }
                // PIE DE PÁGINA (última fila) - Texto gris, centrado
                else if (i === data.length - 1) {
                    ws[cellRef].s = {
                        font: { italic: true, sz: 10, color: { rgb: "6C757D" } },
                        alignment: { horizontal: "center" }
                    };
                }
            }
        }
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reservas');
        
        const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        XLSX.writeFile(wb, `reservas_${fecha}.xlsx`);
        
        alert('✅ Excel exportado');
        
    } catch (error) {
        console.error('Error al exportar Excel:', error);
        alert('❌ Error al exportar Excel');
    }
}

// EXPORTAR A PDF (datos del admin en línea + tabla con colores)
async function exportToPDF() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (typeof html2pdf === 'undefined') {
        alert('Cargando librería...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Crear contenedor para el PDF
    const contenedor = document.createElement('div');
    contenedor.style.padding = '20px';
    contenedor.style.fontFamily = 'Arial, sans-serif';
    contenedor.style.backgroundColor = 'white';
    
    // Título con datos del admin en línea (sin cuadro)
    contenedor.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2F5597; padding-bottom: 15px;">
            <h1 style="color: #1abc9c; margin: 0;">Reservas UPQ</h1>
            <p style="color: #2F5597; margin: 5px 0;">Universidad Politécnica</p>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 12px;">
                <strong>Reporte generado por:</strong> ${user ? user.usuario : 'Administrador'} | 
                <strong>Email:</strong> ${user ? user.email : 'admin@upq.edu.mx'} | 
                <strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}
            </p>
        </div>
    `;
    
    // Clonar la tabla
    const tablaOriginal = document.querySelector('.table');
    const tablaClon = tablaOriginal.cloneNode(true);
    
    // Aplicar estilos a la tabla
    tablaClon.style.width = '100%';
    tablaClon.style.borderCollapse = 'collapse';
    tablaClon.style.marginBottom = '20px';
    
    // Estilos para las celdas
    const celdas = tablaClon.querySelectorAll('th, td');
    celdas.forEach(celda => {
        celda.style.border = '1px solid #ddd';
        celda.style.padding = '10px';
        celda.style.textAlign = 'left';
    });
    
    // Encabezados con color azul (#2F5597)
    const encabezados = tablaClon.querySelectorAll('th');
    encabezados.forEach(th => {
        th.style.backgroundColor = '#2F5597';
        th.style.color = 'white';
        th.style.fontWeight = 'bold';
        th.style.fontSize = '14px';
    });
    
    // Filas con color alternado (gris claro / blanco)
    const filas = tablaClon.querySelectorAll('tbody tr');
    filas.forEach((fila, index) => {
        if (index % 2 === 0) {
            fila.style.backgroundColor = '#f8f9fa';
        } else {
            fila.style.backgroundColor = 'white';
        }
    });
    
    // Colores para los badges de estado (verde, amarillo, rojo)
    const badges = tablaClon.querySelectorAll('.badge');
    badges.forEach(badge => {
        const texto = badge.textContent.toLowerCase();
        badge.style.display = 'inline-block';
        badge.style.padding = '5px 12px';
        badge.style.borderRadius = '20px';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = '500';
        
        if (texto === 'pendiente') {
            badge.style.backgroundColor = '#ffc107';
            badge.style.color = '#333';
        } else if (texto === 'aprobada' || texto === 'autorizada') {
            badge.style.backgroundColor = '#28a745';
            badge.style.color = 'white';
        } else if (texto === 'rechazada') {
            badge.style.backgroundColor = '#dc3545';
            badge.style.color = 'white';
        }
    });
    
    contenedor.appendChild(tablaClon);
    
    // Pie de página
    const pie = document.createElement('div');
    pie.style.marginTop = '20px';
    pie.style.paddingTop = '10px';
    pie.style.borderTop = '1px solid #1abc9c';
    pie.style.textAlign = 'center';
    pie.style.fontSize = '10px';
    pie.style.color = '#64748b';
    pie.innerHTML = 'Reporte generado automáticamente por el Sistema de Reservas UPQ';
    contenedor.appendChild(pie);
    
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `reservas_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(contenedor).save();
    alert('✅ PDF exportado');
}


// Eventos
document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
document.getElementById('logoutBtn').addEventListener('click', () => { 
    localStorage.removeItem('user'); 
    window.location.href = 'index.html'; 
});

loadAdmin();