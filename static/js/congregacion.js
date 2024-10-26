$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#sedeTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',  // Utilizar "justify-content-end" para alinear a la derecha
        language: {
            search: "Buscar:"  // Cambiar el texto de "Search" a "Buscar"
        },
        //dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"l<"d-flex justify-content-between align-items-center"f<"ml-3 button-section">>>rt<"bottom"p>',
        initComplete: function () {
            // Insertar el botón "Agregar ministro" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="abirC()"><i class="bi bi-person-plus"></i> Agregar Congregación </button>');
        }
    });
});


document.getElementById('nombre_congregacion').addEventListener('input', function () {
    const nombrecongregacion = this.value.trim();  // Elimina espacios en blanco al inicio y al final
    if (nombrecongregacion === '') {
        this.setCustomValidity('El nombre de la congregación no puede estar vacío ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});


function abirC() {
    var modalCongreg = new bootstrap.Modal(document.getElementById('modalCongregacion'));

    const modalTitle = document.getElementById('ModalCongregacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formCongregacion = document.getElementById('formCongregacion'); // Obtener el formulario

    modalTitle.textContent = 'Agregar Congregación';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formCongregacion.setAttribute('action', insertarCongreURL);

    // Limpiar campos del modal
    document.getElementById('congregacionId').value = '';
    document.getElementById('nombre_congregacion').value = '';

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = true;

    document.getElementById('estado').setAttribute('disabled', true);

    modalCongreg.show();
}



function abrirModalEditarC(id, nombre, estado) {
    var modalCongreg = new bootstrap.Modal(document.getElementById('modalCongregacion'));

    const modalTitle = document.getElementById('ModalCongregacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formCongregacion = document.getElementById('formCongregacion'); // Obtener el formulario

    modalTitle.textContent = 'Editar Congregación';
    submitBtn.textContent = 'Guardar cambios';

    // Cambiar el action del formulario para que apunte a la ruta de actualización
    formCongregacion.setAttribute('action', actualizarCongreURL);

    // Llenar los campos con los datos existentes
    document.getElementById('congregacionId').value = id;
    document.getElementById('nombre_congregacion').value = nombre;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    modalCongreg.show();
}


function abrirModalVerC(id, nombre, estado) {
    var modalCongreg = new bootstrap.Modal(document.getElementById('modalCongregacion'));

    const modalTitle = document.getElementById('ModalCongregacionLabel');
    const submitBtn = document.getElementById('submitBtn');

    modalTitle.textContent = 'Ver Congregación';
    submitBtn.style.display = 'none'; // Ocultar el botón de Guardar

    document.getElementById('congregacionId').value = id;
    document.getElementById('nombre_congregacion').value = nombre;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    // Bloquear los campos para solo permitir ver los datos usando 'disabled' para el estilo gris
    document.getElementById('nombre_congregacion').setAttribute('disabled', true);
    document.getElementById('estado').setAttribute('disabled', true);


    // Al cerrar el modal, restablecer los campos
    document.getElementById('modalCongregacion').addEventListener('hidden.bs.modal', function () {
        // Eliminar el atributo 'disabled' de los campos
        document.getElementById('nombre_congregacion').removeAttribute('disabled');
        document.getElementById('estado').removeAttribute('disabled');

        // Volver a mostrar el botón de Guardar si es necesario en otros contextos
        submitBtn.style.display = 'block';
    });

    // Mostrar el modal
    modalCongreg.show();
}

function darBajaCongre(id, estado) {
    // Comprobar si la sede ya está inactiva
    if (estado === false || estado === 'false' || estado === '0') {
        alert('La Congregación ya está dada de baja.');
        return; // Salir de la función
    }

    const formCongregacion = document.getElementById('formCongregacion');

    formCongregacion.setAttribute('action', darBajaCongreURL);

    document.getElementById('congregacionId').value = id;
    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = true; // Marcamos como inactivo

    alert('Estado de la sede cambiado exitosamente a Inactivo');

    formCongregacion.submit();
}
