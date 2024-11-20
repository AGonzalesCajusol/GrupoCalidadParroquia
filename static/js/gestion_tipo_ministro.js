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
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar tipo ministro</button>');
        }
    });
});


document.getElementById('tipoMinistroForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío normal del formulario

    const id = document.getElementById('tipoMinistroId').value;
    const tipo = document.getElementById('tipo').value;
    const estado = document.getElementById('estado').checked ? 1 : 0;

    const action = this.action; // Obtiene la URL de acción del formulario

    fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Asegúrate de enviar datos como JSON
        },
        body: JSON.stringify({
            id: id,
            tipo: tipo,
            estado: estado
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Operación realizada con éxito');
            location.reload(); // Recargar la página para reflejar los cambios
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});


function openModal(type, id = null, nombre = '', estado = true) {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar tipo de ministro';
        formAction = '/procesar_insertar_tipo_ministro';
        limpiarModal();
    } else if (type === 'edit') {
        modalTitle = 'Editar tipo de ministro';
        formAction = '/procesar_actualizar_tipo_ministro';
        isReadOnly = false;
        document.getElementById('tipoMinistroId').value = id;
        document.getElementById('tipo').value = nombre;
        document.getElementById('estado').checked = estado == 1 ? true : false;
    } else if (type === 'view') {
        modalTitle = 'Ver tipo de ministro';
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


function cambiarEstadoTipoMinistro(button) {
    const id = button.getAttribute("data-id");
    const estadoActual = button.getAttribute("data-estado") === "1";

    // Confirmar la acción con el usuario
    const confirmacion = estadoActual 
        ? "¿Estás seguro de que deseas dar de baja este tipo de ministro?" 
        : "¿Estás seguro de que deseas activar este tipo de ministro?";
    if (!confirm(confirmacion)) return;

    // Definir el nuevo estado
    const nuevoEstado = estadoActual ? 0 : 1;

    // Enviar la solicitud para cambiar el estado
    fetch("/actualizar_estado_tipo_ministro", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${encodeURIComponent(id)}&estado=${nuevoEstado}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar dinámicamente el botón
            button.setAttribute("data-estado", nuevoEstado);
            button.setAttribute("title", nuevoEstado ? "Dar de baja" : "Activar");
            button.className = `btn ${nuevoEstado ? "btn-secondary" : "btn-success"} btn-sm estado-btn`;
            button.innerHTML = `<i class="${nuevoEstado ? "fas fa-ban" : "fas fa-check"}"></i>`;
            
            // Mostrar mensaje de éxito con Toastify
            Toastify({
                text: data.message || "El estado se actualizó correctamente.",
                duration: 3000,
                close: true,
                backgroundColor: nuevoEstado ? "#ffc107" : "#28a745", // Amarillo para dar de baja, verde para activar
                gravity: "bottom", // Aparece desde abajo
                position: "right", // Aparece en la derecha
            }).showToast();
        } else {
            // Mostrar mensaje de error con Toastify
            Toastify({
                text: data.message || "Error al cambiar el estado.",
                duration: 3000,
                close: true,
                backgroundColor: "#dc3545", // Rojo para errores
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    })
    .catch(error => {
        console.error("Error:", error);
        // Mostrar mensaje de error general con Toastify
        Toastify({
            text: "Ocurrió un error al cambiar el estado del tipo de ministro.",
            duration: 3000,
            close: true,
            backgroundColor: "#dc3545", // Rojo para errores
            gravity: "bottom",
            position: "right",
        }).showToast();
    });
}

function limpiarModal() {
    document.getElementById('tipoMinistroId').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('estado').checked = true;  // Por defecto, activo
}
