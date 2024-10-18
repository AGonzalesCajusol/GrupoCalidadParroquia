$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#tipoMinistroTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar tipo de ministro"
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo-ministro" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar Tipo de Ministro</button>');
        }
    });
});

function openModal(type, id = null, nombre = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Tipo de Ministro';
        formAction = urlInsertarTipoMinistro;  // URL para insertar
        limpiarModal();  // Limpiar campos
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Tipo de Ministro';
        formAction = urlActualizarTipoMinistro;  // URL para actualizar
        isReadOnly = false;
        document.getElementById('TipoMinistroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'view') {
        modalTitle = 'Ver Tipo de Ministro';
        formAction = '';
        isReadOnly = true;
        document.getElementById('TipoMinistroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('saveChanges').style.display = 'none';
    }

    // Configurar el modal
    document.getElementById('TipoMinistroModalLabel').innerText = modalTitle;
    document.getElementById('TipoMinistroForm').action = formAction;

    // Hacer los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#TipoMinistroForm input').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Mostrar el modal
    var tipoMinistroModal = new bootstrap.Modal(document.getElementById('TipoMinistroModal'));
    tipoMinistroModal.show();

    // Manejo del envío del formulario
    document.getElementById('TipoMinistroForm').onsubmit = function (event) {
        event.preventDefault();  // Prevenir el envío del formulario tradicional

        let formData = new FormData(this);  // Recoger los datos del formulario

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(type === 'edit' ? 'Tipo de Ministro actualizado exitosamente' : 'Tipo de Ministro agregado exitosamente');
                location.reload();
            } else {
                alert('Error al procesar el Tipo de Ministro');
            }
        })
        .catch(error => console.error('Error:', error));
    };
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('TipoMinistroId').value = '';
    document.getElementById('nombre').value = '';
}

// Función para eliminar un tipo de ministro
function eliminarTipoMinistro(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de ministro?")) {
        fetch('/eliminar_tipo_ministro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Tipo de Ministro eliminado exitosamente');
                location.reload();
            } else {
                alert('Error al eliminar el Tipo de Ministro');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
