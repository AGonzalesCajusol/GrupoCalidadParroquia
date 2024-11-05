$(document).ready(function () {
    // Inicializar DataTable para intenciones
    var table = $('#intencionTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Agregar botón para añadir una nueva intención
            $("div.button-section").html(`
                <button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-intencion" data-bs-toggle="modal" onclick="abrirModalIntencion('add')">
                    <i class="bi bi-plus-circle"></i> Agregar Intención
                </button>
            `);
        }
    });
});

function abrirModalIntencion(type, id = null, nombre_intencion = '', descripcion = '', nombre_actoliturgico = '') {
    let modalTitle = '';
    let formAction = '';
    let isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Intención';
        formAction = insertarIntencionURL;
        limpiarModal();
    } else if (type === 'edit' || type === 'view') {
        modalTitle = type === 'edit' ? 'Editar Intención' : 'Ver Intención';
        formAction = type === 'edit' ? actualizarIntencionURL : '';
        isReadOnly = type === 'view';

        $('#intencionId').val(id);
        $('#nombre_intencion').val(nombre_intencion);
        $('#descripcion').val(descripcion);
        
        // Seleccionar el nombre del acto litúrgico en el combo box
        $('#id_actoliturgico').val(nombre_actoliturgico);
    }

    $('#intencionModalLabel').text(modalTitle);
    $('#intencionForm').attr('action', formAction);

    /// Configurar campos como de solo lectura si es vista
    $('#intencionForm input, #intencionForm select').prop('readonly', isReadOnly);
    $('#id_actoliturgico').prop('disabled', isReadOnly); // Combo box específico
    $('#submitBtn').toggle(!isReadOnly);

    // Mostrar el modal
    const intencionModal = new bootstrap.Modal(document.getElementById('intencionModal'));
    intencionModal.show();
}

$('#intencionForm').on('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const formAction = $(this).attr('action');

    // Deshabilitar el botón para evitar múltiples envíos
    $('#submitBtn').prop('disabled', true);

    // Realizar la solicitud de inserción o actualización
    fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'fetch'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            actualizarTabla(data.intenciones);
            $('#intencionModal').modal('hide');
            mostrarMensaje(data.message, 'success');
        } else {
            mostrarMensaje(data.message, 'danger');
        }
    })
    .catch(() => {
        mostrarMensaje("Error en la operación.", 'danger');
    })
    .finally(() => {
        $('#submitBtn').prop('disabled', false);
    });
});

function eliminarIntencion(event, id) {
    event.preventDefault();

    if (confirm('¿Estás seguro de que deseas eliminar esta intención?')) {
        fetch(`/eliminar_intencion/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'fetch'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTabla(data.intenciones);
                mostrarMensaje(data.message, 'success');
            } else {
                mostrarMensaje(data.message, 'danger');
            }
        })
        .catch(() => {
            mostrarMensaje("Error al eliminar la intención.", 'danger');
        });
    }
}

function actualizarTabla(intenciones) {
    const table = $('#intencionTable').DataTable();
    table.clear();

    intenciones.forEach(intencion => {
        const row = `
            <tr class="text-center">
                <td>${intencion.id_intencion}</td>
                <td>${intencion.nombre_intencion}</td>
                <td>${intencion.descripcion}</td>
                <td>${intencion.nombre_liturgia}</td>
                <td>
                    <button class="btn btn-primary btn-sm" title="Ver" onclick="abrirModalIntencion('ver', '${intencion.id_intencion}', '${intencion.nombre_intencion}', '${intencion.descripcion}', '${intencion.nombre_liturgia}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Editar" onclick="abrirModalIntencion('edit', '${intencion.id_intencion}', '${intencion.nombre_intencion}', '${intencion.descripcion}', '${intencion.nombre_liturgia}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <form id="form-eliminar-${intencion.id_intencion}" style="display:inline-block;" title="Eliminar" onsubmit="eliminarIntencion(event, '${intencion.id_intencion}')">
                        <input type="hidden" name="id" value="${intencion.id_intencion}">
                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('¿Estás seguro de que deseas eliminar esta intención?');">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </form>
                </td>
            </tr>
        `;
        table.row.add($(row)[0]);
    });

    table.draw(false);
}


function limpiarModal() {
    $('#intencionId').val('');
    $('#id_actoliturgico').val('');
    $('#nombre_intencion').val('');
    $('#descripcion').val('');
}

function mostrarMensaje(mensaje, tipo) {
    const alerta = $(`
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `);

    $('.container.mt-3').append(alerta);
    setTimeout(() => alerta.fadeOut(500, () => alerta.remove()), 3000);
}
