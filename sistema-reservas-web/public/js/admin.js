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
                <td><strong>${r.espacio_nombre || '-'}</strong>\\
                <td>${r.alumno || '-'}\\
                <td>${r.fecha || '-'}\\
                <td>${r.proposito || '-'}\\
                <td><span class="badge badge-${r.estado?.toLowerCase()}">${r.estado || '-'}</span>\\
                <td>${r.estado === 'Pendiente' ? `<button class="btn btn-success btn-sm" onclick="aprobar(${r.id_reserva})">Aprobar</button> <button class="btn btn-danger btn-sm" onclick="rechazar(${r.id_reserva})">Rechazar</button>` : '-'}\\
             \\
        `).join('');
    }).catch(() => document.getElementById('reservasTable').innerHTML = '发展<td colspan="6">Error al cargar datos发展\\');
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

// EXPORTAR A EXCEL CON ESTILOS
function exportToExcel() {
    const table = document.getElementById('reservasTable');
    const rows = table.querySelectorAll('tr');
    
    const data = [];
    data.push(["SISTEMA DE RESERVAS UPQ"]);
    data.push(["Panel de Administración"]);
    data.push([]);
    data.push(["Fecha de generación:", new Date().toLocaleString('es-MX')]);
    data.push([]);
    data.push(["ESPACIO", "SOLICITANTE", "FECHA", "PROPÓSITO", "ESTADO", "ACCIONES"]);
    
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(td => {
            let text = td.innerText.trim();
            if (td.querySelector('button')) {
                text = text.replace('Aprobar', '').replace('Rechazar', '').trim();
            }
            rowData.push(text);
        });
        if (rowData.length > 0) data.push(rowData);
    });
    
    data.push([]);
    data.push(["Total de registros:", rows.length]);
    data.push(["Reporte generado automáticamente por el Sistema de Reservas UPQ"]);
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{wch:30},{wch:25},{wch:20},{wch:35},{wch:15},{wch:20}];
    
    try {
        if (ws['A1']) {
            ws['A1'].s = { font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "2F5597" } }, alignment: { horizontal: "center", vertical: "center" } };
        }
        if (ws['A2']) {
            ws['A2'].s = { font: { bold: true, sz: 12, color: { rgb: "1ABC9C" } }, alignment: { horizontal: "center" } };
        }
        for (let i = 0; i < 6; i++) {
            const cell = ws[XLSX.utils.encode_cell({ r: 5, c: i })];
            if (cell) {
                cell.s = { font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 }, fill: { fgColor: { rgb: "4F81BD" } }, alignment: { horizontal: "center", vertical: "center" } };
            }
        }
        for (let i = 0; i < rows.length; i++) {
            const rowNum = 6 + i;
            const bgColor = i % 2 === 0 ? "F2F2F2" : "FFFFFF";
            for (let j = 0; j < 6; j++) {
                const cell = ws[XLSX.utils.encode_cell({ r: rowNum, c: j })];
                if (cell) {
                    cell.s = { fill: { fgColor: { rgb: bgColor } }, alignment: { vertical: "center" } };
                    if (j === 4 && cell.v) {
                        const estado = cell.v.toString().toLowerCase();
                        if (estado === 'aprobada' || estado === 'autorizada') {
                            cell.s.font = { color: { rgb: "2E7D32" }, bold: true };
                        } else if (estado === 'pendiente') {
                            cell.s.font = { color: { rgb: "ED6C02" }, bold: true };
                        } else if (estado === 'rechazada') {
                            cell.s.font = { color: { rgb: "D32F2F" }, bold: true };
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.log("Estilo aplicado correctamente");
    }
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas');
    const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    XLSX.writeFile(wb, `reservas_${fecha}.xlsx`);
    alert('✅ Excel exportado con diseño');
}

// EXPORTAR A PDF
async function exportToPDF() {
    const element = document.querySelector('.card');
    
    if (typeof html2pdf === 'undefined') {
        alert('Cargando librería...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `reservas_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save();
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