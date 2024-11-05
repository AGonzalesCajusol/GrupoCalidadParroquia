$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#tipoMinistroTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar Tipo"
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar Tipo</button>');
        }
    });
});

function openModal(type, id = null, nombre = '', estado = true) {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Tipo de Ministro';
        formAction = urlInsertarTipo;  // Asegúrate de que coincida con la ruta de Flask
        limpiarModal();
    } else if (type === 'edit') {
        modalTitle = 'Editar Tipo de Ministro';
        formAction = urlActualizarTipo;  // Asegúrate de que coincida con la ruta de Flask
        isReadOnly = false;
        document.getElementById('tipoMinistroId').value = id;
        document.getElementById('tipo').value = nombre;
        document.getElementById('estado').checked = estado == 1 ? true : false;
    } else if (type === 'view') {
        modalTitle = 'Ver Tipo de Ministro';
        formAction = '';  // No habrá acción de envío de formulario
        isReadOnly = true;  // Marcar todos los campos como solo lectura
        document.getElementById('tipoMinistroId').value = id;
        document.getElementById('tipo').value = nombre;
        document.getElementById('estado').checked = estado == 1 ? true : false;
    }

    // Configurar el modal
    document.getElementById('tipoMinistroModalLabel').innerText = modalTitle;
    document.getElementById('tipoMinistroForm').action = formAction;

    // Hacer todos los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#tipoMinistroForm input').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Mostrar el modal
    var tipoMinistroModal = new bootstrap.Modal(document.getElementById('tipoMinistroModal'));
    tipoMinistroModal.show();
}
function eliminarTipoMinistro(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de ministro?")) {
        fetch('/eliminar_tipo_ministro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })  // Enviando el ID del tipo de ministro a eliminar
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Tipo de Ministro eliminado exitosamente');
                location.reload();  // Recargar la página para reflejar los cambios
            } else {
                alert('Error al eliminar el tipo de ministro: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}


// Función para dar de baja el tipo de ministro (cambiar estado a inactivo)
function darDeBajaTipoMinistro(id) {
    if (confirm("¿Estás seguro de que deseas dar de baja este tipo de ministro?")) {
        fetch('/procesar_dar_baja', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, estado: 0 })  // Cambiar estado a inactivo
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Tipo de Ministro dado de baja exitosamente');
                location.reload();  // Recargar la página para reflejar los cambios
            } else {
                alert('Error al dar de baja el tipo de ministro: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function limpiarModal() {
    document.getElementById('tipoMinistroId').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('estado').checked = true;  // Por defecto, activo
}
