$(document).ready(function () {
    // Inicializar DataTable para la tabla de charlas
    var table = $('#charlasTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar charla" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" data-bs-target="#modalCharla" onclick="abrirModalAgregar()"><i class="bi bi-plus-circle"></i> Agregar charla</button>');
        }
    });
});

// Función para abrir el modal de agregar una nueva charla
function abrirModalAgregar() {
    var modalCharla = new bootstrap.Modal(document.getElementById('modalCharla'));

    const modalTitle = document.getElementById('modalCharlaLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formCharla = document.getElementById('formCharla');

    modalTitle.textContent = 'Agregar Charla';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formCharla.setAttribute('action', insertarCharlaURL);

    // Limpiar campos del modal
    document.getElementById('charlaId').value = '';
    document.getElementById('estado').value = 'P';
    document.getElementById('fecha_inicio').value = '';
    document.getElementById('id_actoliturgico').value = '';

    modalCharla.show();
}

// Función para abrir el modal de edición de una charla
function abrirModalEditar(id, estado, fecha_inicio, id_actoliturgico) {
    var modalCharla = new bootstrap.Modal(document.getElementById('modalCharla'));

    const modalTitle = document.getElementById('modalCharlaLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formCharla = document.getElementById('formCharla');

    modalTitle.textContent = 'Editar Charla';
    submitBtn.textContent = 'Guardar cambios';

    // Cambiar el action del formulario para que apunte a la ruta de actualización
    formCharla.setAttribute('action', actualizarCharlaURL);

    // Llenar los campos con los datos existentes
    document.getElementById('charlaId').value = id;
    document.getElementById('estado').value = estado;
    document.getElementById('fecha_inicio').value = fecha_inicio;
    document.getElementById('id_actoliturgico').value = id_actoliturgico;

    modalCharla.show();
}

// Función para abrir el modal de ver detalles de una charla
function abrirModalVer(id, estado, fecha_inicio, acto) {
    var modalCharla = new bootstrap.Modal(document.getElementById('modalCharla'));

    const modalTitle = document.getElementById('modalCharlaLabel');
    const submitBtn = document.getElementById('submitBtn');

    modalTitle.textContent = 'Ver Charla';
    submitBtn.style.display = 'none'; // Ocultar el botón de Guardar

    // Llenar los campos con los datos existentes
    document.getElementById('charlaId').value = id;
    document.getElementById('estado').value = estado;
    document.getElementById('fecha_inicio').value = fecha_inicio;

    // Bloquear los campos para solo permitir ver los datos usando 'disabled' para el estilo gris
    document.getElementById('estado').setAttribute('disabled', true);
    document.getElementById('fecha_inicio').setAttribute('disabled', true);
    document.getElementById('id_actoliturgico').setAttribute('disabled', true);

    // Al cerrar el modal, restablecer los campos
    document.getElementById('modalCharla').addEventListener('hidden.bs.modal', function () {
        document.getElementById('estado').removeAttribute('disabled');
        document.getElementById('fecha_inicio').removeAttribute('disabled');
        document.getElementById('id_actoliturgico').removeAttribute('disabled');
        submitBtn.style.display = 'block'; // Volver a mostrar el botón de Guardar si es necesario en otros contextos
    });

    modalCharla.show();
}
