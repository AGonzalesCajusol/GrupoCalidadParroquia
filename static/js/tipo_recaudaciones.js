$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#tiposRecaudacionTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',  // Utilizar "justify-content-end" para alinear a la derecha
        language: {
            search: "Buscar:"  // Cambiar el texto de "Search" a "Buscar"
        },
        initComplete: function () {
            // Insertar el botón "Agregar tipo de recaudación" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar Tipo de Recaudación</button>');
        }
    });
});

// Función para abrir el modal para agregar, ver o editar un tipo de recaudación
function openModal(type, id = null, nombre = '', tipo = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Tipo de Recaudación';
        formAction = urlInsertarTipoRecaudacion;  // URL global para insertar tipo de recaudación
        isReadOnly = false;
        limpiarModal();  // Limpiar campos al abrir el modal para agregar
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Tipo de Recaudación';
        formAction = urlActualizarTipoRecaudacion;  // URL global para actualizar tipo de recaudación
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';

        // Asignar valores al modal
        document.getElementById('tipoRecaudacionId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('tipo').value = tipo;

    } else if (type === 'view') {
        modalTitle = 'Ver Tipo de Recaudación';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none'; 

        // Asignar valores al modal
        document.getElementById('tipoRecaudacionId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('tipo').value = tipo;
    }

    // Configuración del modal
    document.getElementById('tipoRecaudacionModalLabel').innerText = modalTitle;
    document.getElementById('tipoRecaudacionForm').action = formAction;

    // Hacer los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#tipoRecaudacionForm input, #tipoRecaudacionForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Inicializar y mostrar el modal
    var tipoRecaudacionModal = new bootstrap.Modal(document.getElementById('tipoRecaudacionModal'));
    tipoRecaudacionModal.show();

    // Manejo del envío del formulario
    document.getElementById('tipoRecaudacionForm').onsubmit = function (event) {
        event.preventDefault();  // Prevenir el envío del formulario tradicional

        let formData = new FormData(this);  // Recoger los datos del formulario

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(type === 'edit' ? 'Tipo de recaudación actualizado exitosamente' : 'Tipo de recaudación agregado exitosamente');
                    if (type === 'add') {
                        // Agregar el nuevo tipo de recaudación a la tabla
                        agregarTipoRecaudacionATabla(data.tipo_recaudacion);  // Se asume que el servidor devuelve el nuevo tipo agregado
                        limpiarModal();  // Limpiar los campos del modal para una nueva inserción
                    } else {
                        location.reload();  // Recargar la página para reflejar los cambios si se está editando
                    }
                } else {
                    alert('Error al procesar el tipo de recaudación');
                }
            })
            .catch(error => console.error('Error:', error));
    };
}
// Función para eliminar un tipo de recaudación
function eliminarTipoRecaudacion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de recaudación?')) {
        fetch('/eliminar_tipo_recaudacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })  // Enviar el ID del tipo de recaudación que se va a eliminar
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Tipo de recaudación eliminado exitosamente');
                location.reload();  // Recargar la página para reflejar los cambios
            } else {
                alert('Error al eliminar tipo de recaudación: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('tipoRecaudacionId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('tipo').value = '';
}
