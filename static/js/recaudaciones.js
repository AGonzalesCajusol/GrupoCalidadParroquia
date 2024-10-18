$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#recaudacionesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar recaudación" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar Recaudación</button>');
        }
    });
});

// Función para abrir el modal para agregar, ver o editar una recaudación
function openModal(type, id = null, monto = '', observacion = '', id_sede = '', id_tipo_recaudacion = '', fecha = '', hora = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Recaudación';
        formAction = urlInsertarRecaudacion;
        isReadOnly = false;
        limpiarModal();  // Limpiar campos al abrir el modal para agregar
        document.getElementById('saveChanges').style.display = 'block';
        document.getElementById('fecha_container').style.display = 'none';
        document.getElementById('hora_container').style.display = 'none';

    } else if (type === 'edit') {
        modalTitle = 'Editar Recaudación';
        formAction = urlActualizarRecaudacion;
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';

        // Asignar valores al modal
        document.getElementById('recaudacionId').value = id;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('sede').value = id_sede;
        document.getElementById('id_tipo_recaudacion').value = id_tipo_recaudacion;

        document.getElementById('fecha_container').style.display = 'none';
        document.getElementById('hora_container').style.display = 'none';

    } else if (type === 'view') {
        modalTitle = 'Ver Recaudación';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none'; // Ocultar el botón de guardar

        // Asignar valores al modal en modo solo lectura
        document.getElementById('recaudacionId').value = id;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('sede').value = id_sede;  // Mostrar el nombre de la sede

        // Asignar el tipo de recaudación al select
        let tipoRecaudacionSelect = document.getElementById('id_tipo_recaudacion');
        tipoRecaudacionSelect.value = id_tipo_recaudacion; // Selecciona el tipo de recaudación

        // Asignar fecha y hora
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;

        document.getElementById('fecha_container').style.display = 'block';
        document.getElementById('hora_container').style.display = 'block';
    }

    // Configuración del título del modal
    document.getElementById('recaudacionModalLabel').innerText = modalTitle;
    document.getElementById('recaudacionForm').action = formAction;

    // Hacer los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#recaudacionForm input, #recaudacionForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;  // Para desactivar el select de tipo de recaudación
    });

    // Mostrar el modal
    var recaudacionModal = new bootstrap.Modal(document.getElementById('recaudacionModal'));
    recaudacionModal.show();
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('recaudacionId').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('observacion').value = '';
    document.getElementById('id_sede').value = '';
    document.getElementById('id_tipo_recaudacion').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('hora').value = '';
}

// Función para eliminar una recaudación
function eliminarRecaudacion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta recaudación?')) {
        fetch('/eliminar_recaudacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Recaudación eliminada exitosamente');
                location.reload();
            } else {
                alert('Error al eliminar la recaudación');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
