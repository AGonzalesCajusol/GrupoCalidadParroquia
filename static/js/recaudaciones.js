$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#recaudacionesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" data-bs-toggle="modal" onclick="abrirModalRecaudacion(\'add\')"><i class="bi bi-person-plus"></i> Agregar Recaudación</button>');
            $("div.button-section").append('<button type="button" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" data-bs-target="#exportModal"><i class="bi bi-file-earmark-arrow-down"></i> Exportar Recaudaciones</button>');
        }
    });
});

// Validación para el monto de recaudación
document.getElementById('monto').addEventListener('input', function () {
    const montoValue = this.value.trim();
    if (montoValue === '' || isNaN(montoValue)) {
        this.setCustomValidity('El monto debe ser un número válido y no puede estar vacío.');
    } else {
        this.setCustomValidity('');
    }
});

function abrirModalRecaudacion(type, id = null, fecha = '', hora = '', monto = '', observacion = '', sede_nombre = '', tipo_recaudacion = '') {
    let modalTitle = '';
    let formAction = '';
    let isReadOnly = false;

    // Ocultar los campos de fecha y hora por defecto
    document.getElementById('fechaContainer').style.display = 'none';
    document.getElementById('horaContainer').style.display = 'none';

    if (type === 'add') {
        modalTitle = 'Agregar recaudación';
        formAction = '/insertar_recaudacion';
        limpiarModal(); // Limpia todos los campos
    } else if (type === 'edit') {
        modalTitle = 'Editar recaudación';
        formAction = '/procesar_actualizar_recaudacion';
        isReadOnly = false;
        document.getElementById('recaudacionId').value = id;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('id_tipo_recaudacion').value = tipo_recaudacion;
        
        // Limpiar campos de fecha y hora en modo de edición
        document.getElementById('fecha').value = '';
        document.getElementById('hora').value = '';
    } else if (type === 'view') {
        modalTitle = 'Ver recaudación';
        formAction = '';
        isReadOnly = true;
        document.getElementById('recaudacionId').value = id;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('id_tipo_recaudacion').value = tipo_recaudacion;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;

        // Mostrar los campos de fecha y hora solo en modo de visualización
        document.getElementById('fechaContainer').style.display = 'block';
        document.getElementById('horaContainer').style.display = 'block';
    }

    // Configurar el título y la acción del formulario en el modal
    document.getElementById('recaudacionModalLabel').innerText = modalTitle;
    document.getElementById('recaudacionForm').action = formAction;

    // Asignar el valor de la cookie "sede" al campo de sede y configurarlo como no editable
    const sedeInput = document.getElementById('sede_nombre');
    sedeInput.value = getCookie('sede').replace(/^"|"$/g, '');
    sedeInput.readOnly = true;
    sedeInput.disabled = true;

    // Configurar campos en modo de solo lectura según el tipo de acción
    document.querySelectorAll('#recaudacionForm input, #recaudacionForm select').forEach(function (input) {
        if (input.id !== 'sede_nombre') {
            input.readOnly = isReadOnly;
            input.disabled = isReadOnly;
        }
    });

    // Mostrar el botón de guardar solo si no está en modo "Ver"
    document.getElementById('submitBtn').style.display = isReadOnly ? 'none' : 'block';

    // Mostrar el modal
    const recaudacionModal = new bootstrap.Modal(document.getElementById('recaudacionModal'));
    recaudacionModal.show();
}

$('#recaudacionForm').on('submit', function(event) {
    event.preventDefault();
    const formData = $(this).serialize();
    const formAction = $(this).attr('action');

    // Deshabilitar el botón para evitar múltiples envíos
    $('#submitBtn').prop('disabled', true);

    // Realizar la solicitud de inserción o actualización
    $.post(formAction, formData)
        .done(function(response) {
            if (response.success) {
                actualizarTabla(response.recaudaciones); // Actualizar la tabla
                $('#recaudacionModal').modal('hide'); // Cerrar el modal
                mostrarMensaje(response.message, 'success'); // Mostrar mensaje de éxito
            } else {
                mostrarMensaje(response.message, 'danger'); // Mostrar mensaje de error
            }
        })
        .fail(function() {
            mostrarMensaje("Error en la operación.", 'danger');
        })
        .always(function() {
            $('#submitBtn').prop('disabled', false);
        });
});

// Función para mostrar el mensaje en la estructura de Bootstrap
function mostrarMensaje(mensaje, tipo) {
    // Crear la alerta HTML
    const alerta = $(`
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `);

    // Agregar la alerta al contenedor de mensajes
    $('.container.mt-3').append(alerta);

    // Hacer que desaparezca después de 3 segundos
    setTimeout(function() {
        alerta.fadeOut(500, function() { $(this).remove(); });
    }, 3000);
}


function actualizarTabla(recaudaciones) {
    const table = $('#recaudacionesTable').DataTable();

    // Limpiar el contenido actual del DataTable
    table.clear();

    // Generar filas con el diseño HTML específico y añadirlas
    recaudaciones.forEach(recaudacion => {
        const row = $(`
            <tr class="text-center">
                <td style="vertical-align: middle; text-align: center;">${recaudacion.id}</td>
                <td>${recaudacion.sede}</td>
                <td>${recaudacion.tipo_recaudacion}</td>
                <td>${recaudacion.observacion}</td>
                <td style="vertical-align: middle; text-align: center; width: 100px;">${recaudacion.monto}</td>
                <td class="text-center" style="vertical-align: middle; text-align: center; width: 100px;">
                    <button class="btn btn-primary btn-sm" title="Ver" onclick="abrirModalRecaudacion('view', '${recaudacion.id}', '${recaudacion.fecha}', '${recaudacion.hora}', '${recaudacion.monto}', '${recaudacion.observacion}', '${recaudacion.sede}', '${recaudacion.tipo_recaudacion}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Editar" onclick="abrirModalRecaudacion('edit', '${recaudacion.id}', '${recaudacion.fecha}', '${recaudacion.hora}', '${recaudacion.monto}', '${recaudacion.observacion}', '${recaudacion.sede}', '${recaudacion.tipo_recaudacion}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `);

        // Añadir la fila generada al DataTable
        table.row.add(row[0]);
    });

    // Dibujar la tabla con los nuevos datos y mantener la configuración
    table.draw(false);
}

// Función para limpiar los campos del modal
function limpiarModal() {
    const recaudacionId = document.getElementById('recaudacionId');
    const monto = document.getElementById('monto');
    const observacion = document.getElementById('observacion');
    const tipoRecaudacion = document.getElementById('id_tipo_recaudacion');
    const fechaContainer = document.getElementById('fechaContainer');
    const horaContainer = document.getElementById('horaContainer');

    if (recaudacionId) recaudacionId.value = '';
    if (monto) monto.value = '';
    if (observacion) observacion.value = '';
    if (tipoRecaudacion) tipoRecaudacion.value = '';
    if (fechaContainer) fechaContainer.style.display = 'none';
    if (horaContainer) horaContainer.style.display = 'none';
}

// Función para obtener una cookie por su nombre
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}
