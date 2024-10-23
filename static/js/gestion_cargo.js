$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#cargoTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar Cargo"
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-cargo" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar Cargo</button>');
        }
    });
});

function openModal(type, id = null, nombre = '', estado = true) {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Cargo';
        formAction = '/insertar_cargo';  // Asegúrate de que coincida con la ruta de Flask
        limpiarModal();
    } else if (type === 'edit') {
        modalTitle = 'Editar Cargo';
        formAction = '/procesar_actualizar_cargo';  // Asegúrate de que coincida con la ruta de Flask
        isReadOnly = false;
        document.getElementById('cargoId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('estado').checked = estado == 1 ? true : false;
    } else if (type === 'view') {
        modalTitle = 'Ver Cargo';
        formAction = '';  // No habrá acción de envío de formulario
        isReadOnly = true;  // Marcar todos los campos como solo lectura
        document.getElementById('cargoId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('estado').checked = estado == 1 ? true : false;
    }

    // Configurar el modal
    document.getElementById('cargoModalLabel').innerText = modalTitle;
    document.getElementById('cargoForm').action = formAction;

    // Hacer todos los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#cargoForm input').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Mostrar el modal
    var cargoModal = new bootstrap.Modal(document.getElementById('cargoModal'));
    cargoModal.show();
}

// Función para dar de baja el cargo (cambiar estado a inactivo)
function darDeBajaCargo(id) {
    if (confirm("¿Estás seguro de que deseas dar de baja este cargo?")) {
        fetch('/procesar_actualizar_cargo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, estado: 0 })  // Cambiar estado a inactivo
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cargo dado de baja exitosamente');
                location.reload();  // Recargar la página para reflejar los cambios
            } else {
                alert('Error al dar de baja el cargo: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function limpiarModal() {
    document.getElementById('cargoId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('estado').checked = true;  // Por defecto, activo
}
