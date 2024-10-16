$(document).ready(function () {
    // Inicializar DataTable para la tabla de recaudaciones
    $('#tabla_recaudaciones').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json"
        },
        initComplete: function () {
            // Insertar el botón "Registrar Recaudación"
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-plus-lg"></i> Registrar Recaudación</button>');
        }
    });
});

// Función para abrir el modal para agregar, ver o editar una recaudación
function openModal(type, id = null, sede = '', monto = '', observacion = '', fecha = '', hora = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Registrar Recaudación';
        formAction = urlInsertarRecaudacion;  // URL global para insertar recaudación
        isReadOnly = false;
        limpiarModal();  // Limpiar campos al abrir el modal para agregar
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Recaudación';
        formAction = urlActualizarRecaudacion;  // URL global para actualizar recaudación
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';

        // Asignar valores al modal
        document.getElementById('recaudacionId').value = id;
        document.getElementById('sede').value = sede;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;

    } else if (type === 'view') {
        modalTitle = 'Ver Recaudación';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';

        // Asignar valores al modal
        document.getElementById('recaudacionId').value = id;
        document.getElementById('sede').value = sede;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;
    }

    document.getElementById('modalTitle').textContent = modalTitle;
    document.getElementById('recaudacionForm').action = formAction;

    // Mostrar el modal
    var myModal = new bootstrap.Modal(document.getElementById('recaudacionModal'));
    myModal.show();
}

// Función para limpiar los campos del modal al agregar una recaudación
function limpiarModal() {
    document.getElementById('recaudacionId').value = '';
    document.getElementById('sede').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('observacion').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('hora').value = '';
}
