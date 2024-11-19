// Función para seleccionar/deseleccionar todos los checkboxes
function toggleAllCheckboxes() {
    const checkboxes = document.querySelectorAll('.asistencia-checkbox');
    const allChecked = [...checkboxes].every(checkbox => checkbox.checked);
    checkboxes.forEach(checkbox => checkbox.checked = !allChecked);
}

// Función para guardar las asistencias marcadas
function guardarAsistencias() {
    const checkboxes = document.querySelectorAll('.asistencia-checkbox');
    const asistenciaData = [];

    checkboxes.forEach(checkbox => {
        const idSolicitud = checkbox.getAttribute('data-id');
        const asistencia = checkbox.checked ? 1 : 0;
        asistenciaData.push({ id_solicitud: idSolicitud, asistencia: asistencia });
    });

    fetch('/actualizar_asistencias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ asistencias: asistenciaData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
