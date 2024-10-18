$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#ministrosTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar ministro"
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar ministro</button>');
        }
    });
});




function openModal(type, id = null, nombre = '', documento = '', nacimiento = '', ordenacion = '', actividades = '', tipo = '', sede = '', cargo = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Ministro';
        formAction = '/insertar_ministro';  // Asegúrate de que coincida con la ruta de Flask
        limpiarModal();
        document.getElementById('passwordSection').style.display = 'block';
        document.getElementById('confirmPasswordSection').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Ministro';
        formAction = '/procesar_actualizar_ministro';  // Asegúrate de que coincida con la ruta de Flask
        isReadOnly = false;
        document.getElementById('ministroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('documento').value = documento;
        document.getElementById('nacimiento').value = nacimiento;
        document.getElementById('ordenacion').value = ordenacion;
        document.getElementById('actividades').value = actividades;
        document.getElementById('id_tipoministro').value = tipo;
        document.getElementById('id_sede').value = sede;
        document.getElementById('id_cargo').value = cargo;
        document.getElementById('passwordSection').style.display = 'block';
        document.getElementById('confirmPasswordSection').style.display = 'block';
    } else if (type === 'view') {
        modalTitle = 'Ver Ministro';
        formAction = '';  // No habrá acción de envío de formulario
        isReadOnly = true;  // Marcar todos los campos como solo lectura
        document.getElementById('ministroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('documento').value = documento;
        document.getElementById('nacimiento').value = nacimiento;
        document.getElementById('ordenacion').value = ordenacion;
        document.getElementById('actividades').value = actividades;
        document.getElementById('id_tipoministro').value = tipo;
        document.getElementById('id_sede').value = sede;
        document.getElementById('id_cargo').value = cargo;
        document.getElementById('passwordSection').style.display = 'none';
        document.getElementById('confirmPasswordSection').style.display = 'none';  // Ocultar los campos de contraseña en modo "Ver"
    }

    // Configurar el modal
    document.getElementById('ministroModalLabel').innerText = modalTitle;
    document.getElementById('ministroForm').action = formAction;

    // Hacer todos los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#ministroForm input, #ministroForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Mostrar el modal
    var ministroModal = new bootstrap.Modal(document.getElementById('ministroModal'));
    ministroModal.show();
}


function eliminarMinistro(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este ministro?")) {
        fetch('/eliminar_ministro', {
            method: 'POST',  // O 'DELETE' si es más adecuado en tu caso
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Ministro eliminado exitosamente');
                location.reload();  // Recargar la página para reflejar los cambios
            } else {
                alert('Error al eliminar el ministro: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}


// Función para encriptar la contraseña (SHA-256)
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function limpiarModal() {
    document.getElementById('ministroId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('documento').value = '';
    document.getElementById('nacimiento').value = '';
    document.getElementById('ordenacion').value = '';
    document.getElementById('actividades').value = '';
    document.getElementById('id_tipoministro').value = '';
    document.getElementById('id_sede').value = '';
    document.getElementById('id_cargo').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
}
