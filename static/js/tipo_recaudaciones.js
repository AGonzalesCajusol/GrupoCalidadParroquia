$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#tipoRecaudacionTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar tipo de recaudación" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="abrirModalAgregar()"><i class="bi bi-plus-circle"></i> Agregar Tipo de Recaudación </button>');
        }
    });
});

// Validación para Nombre de Recaudación
document.getElementById('nombre_recaudacion').addEventListener('input', function () {
    const nombreRecaudacion = this.value.trim();
    if (nombreRecaudacion === '') {
        this.setCustomValidity('El nombre de la recaudación no puede estar vacío ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');
    }
});

// Abrir el modal para agregar un nuevo tipo de recaudación
function abrirModalAgregar() {
    var modalRecaudacion = new bootstrap.Modal(document.getElementById('modalRecaudacion'));

    const modalTitle = document.getElementById('modalRecaudacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formRecaudacion = document.getElementById('formRecaudacion');

    modalTitle.textContent = 'Agregar Tipo de Recaudación';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formRecaudacion.setAttribute('action', insertarTipoRecaudacionURL);

    // Limpiar campos del modal
    document.getElementById('tipoRecaudacionId').value = '';
    document.getElementById('nombre_recaudacion').value = '';
    document.getElementById('tipo').value = '1';
    document.getElementById('estado').checked = true;

    document.getElementById('estado').setAttribute('disabled', true);

    modalRecaudacion.show();
}

// Abrir el modal para editar un tipo de recaudación
function abrirModalEditar(id, nombre, tipo, estado) {
    var modalRecaudacion = new bootstrap.Modal(document.getElementById('modalRecaudacion'));

    const modalTitle = document.getElementById('modalRecaudacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formRecaudacion = document.getElementById('formRecaudacion');

    modalTitle.textContent = 'Editar Tipo de Recaudación';
    submitBtn.textContent = 'Guardar cambios';

    // Cambiar el action del formulario para que apunte a la ruta de actualización
    formRecaudacion.setAttribute('action', actualizarTipoRecaudacionURL);

    // Llenar los campos con los datos existentes
    document.getElementById('tipoRecaudacionId').value = id;
    document.getElementById('nombre_recaudacion').value = nombre;
    document.getElementById('tipo').value = tipo;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    modalRecaudacion.show();
}

// Abrir el modal para ver los detalles de un tipo de recaudación
function abrirModalVer(id, nombre, tipo, estado) {
    var modalRecaudacion = new bootstrap.Modal(document.getElementById('modalRecaudacion'));

    const modalTitle = document.getElementById('modalRecaudacionLabel');
    const submitBtn = document.getElementById('submitBtn');

    modalTitle.textContent = 'Ver Tipo de Recaudación';
    submitBtn.style.display = 'none'; // Ocultar el botón de Guardar

    // Llenar los campos con los datos existentes
    document.getElementById('tipoRecaudacionId').value = id;
    document.getElementById('nombre_recaudacion').value = nombre;
    document.getElementById('tipo').value = tipo;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    // Deshabilitar los campos
    document.getElementById('nombre_recaudacion').setAttribute('disabled', true);
    document.getElementById('tipo').setAttribute('disabled', true);
    document.getElementById('estado').setAttribute('disabled', true);

    // Mostrar el modal
    modalRecaudacion.show();

    // Al cerrar el modal, restablecer los campos
    document.getElementById('modalRecaudacion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('nombre_recaudacion').removeAttribute('disabled');
        document.getElementById('tipo').removeAttribute('disabled');
        document.getElementById('estado').removeAttribute('disabled');

        // Mostrar el botón de Guardar si es necesario en otros contextos
        submitBtn.style.display = 'block';
    });
}

// Función para dar de baja un tipo de recaudación
function darBajaTipoRecaudacion(id, estado) {
    if (estado === false || estado === 'false' || estado === '0') {
        alert('El tipo de recaudación ya está dado de baja.');
        return;
    }

    const formRecaudacion = document.getElementById('formRecaudacion');

    formRecaudacion.setAttribute('action', darBajaTipoRecaudacionURL);

    document.getElementById('tipoRecaudacionId').value = id;
    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = true; // Cambiamos a inactivo

    alert('El estado del tipo de recaudación ha sido cambiado exitosamente a Inactivo');

    formRecaudacion.submit();
}

// Esperar a que la página esté completamente cargada
document.addEventListener("DOMContentLoaded", function() {
    // Seleccionar todos los elementos de alerta
    const alertElements = document.querySelectorAll('.alert-dismissible');
    
    // Iterar sobre cada alerta y configurar un temporizador
    alertElements.forEach(alert => {
        setTimeout(() => {
            // Iniciar el desvanecimiento ajustando la opacidad y el tiempo de transición
            alert.style.transition = "opacity 0.5s ease-out";
            alert.style.opacity = "0";  // Reducir la opacidad a 0

            // Eliminar el elemento después de la animación
            setTimeout(() => alert.remove(), 500);
        }, 3000);  // Espera 3 segundos antes de iniciar el desvanecimiento
    });
});
