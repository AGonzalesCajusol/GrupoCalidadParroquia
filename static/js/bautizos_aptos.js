function filtrarBautizos() {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    
    window.location.href = `/reportes/bautizos_aptos?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
}

function verDetalles(idSolicitud) {
    // Implementar vista de detalles
    window.location.href = `/reportes/detalle_bautizo/${idSolicitud}`;
} 