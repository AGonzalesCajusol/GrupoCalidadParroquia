$(document).ready(function () {
    // Inicializar DataTable para la tabla de asistencias
    var table = $('#asistenciasTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:",
            paginate: {
                previous: "Anterior",
                next: "Siguiente"
            },
            lengthMenu: "Mostrar _MENU_ entradas"
        }
    });
});

// Función para seleccionar/deseleccionar todos los checkboxes
function toggleAllCheckboxes() {
    const checkboxes = document.querySelectorAll('.asistencia-checkbox');
    const allChecked = [...checkboxes].every(checkbox => checkbox.checked);
    checkboxes.forEach(checkbox => checkbox.checked = !allChecked);
}

function guardarAsistencias() {
    const guardarButton = document.querySelector('#guardarAsistenciasButton'); // Botón de guardar
    guardarButton.disabled = true; // Deshabilitar el botón mientras se procesa

    const checkboxes = document.querySelectorAll('.asistencia-checkbox');
    const asistenciaData = [];

    checkboxes.forEach(checkbox => {
        const idSolicitud = checkbox.getAttribute('data-id'); // Obtener el ID de la solicitud
        const asistencia = checkbox.checked ? 1 : 0; // Marcar como 1 si está seleccionado, 0 si no
        asistenciaData.push({ id_solicitud: idSolicitud, asistencia: asistencia });
    });

    // Enviar los datos al servidor
    fetch('/actualizar_asistencias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ asistencias: asistenciaData }) // Enviar datos en formato JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message);
            location.reload(); // Recargar la página después de guardar
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al guardar las asistencias. Inténtalo nuevamente.');
    })
    .finally(() => {
        guardarButton.disabled = false; // Habilitar el botón después de procesar
    });
}
