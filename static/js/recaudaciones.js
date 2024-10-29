$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#recaudacionesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar recaudación" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar Recaudación</button>');
        
            // Insertar el botón "Exportar recaudaciones" con el mismo estilo
            $("div.button-section").append('<button type="button" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" data-bs-target="#exportModal"><i class="bi bi-file-earmark-arrow-down"></i> Exportar Recaudaciones</button>');
        }
    });
});

// Función para abrir el modal para agregar, ver o editar una recaudación
function openModal(type, id = null, fecha = '', hora = '', monto = '', observacion = '', estado = '', id_sede = '', id_tipo_recaudacion = '', tipo_recaudacion_nombre = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Recaudación';
        formAction = urlInsertarRecaudacion;
        limpiarModal();
        document.getElementById('saveChanges').style.display = 'block';
        document.getElementById('fecha_container').style.display = 'none';
        document.getElementById('hora_container').style.display = 'none';
        document.getElementById('estado').checked = true;

        document.getElementById('id_tipo_recaudacion').style.display = 'block';

    } else if (type === 'edit') {
        modalTitle = 'Editar Recaudación';
        formAction = urlActualizarRecaudacion;
        document.getElementById('saveChanges').style.display = 'block';

        // Asignar valores para la edición
        document.getElementById('recaudacionId').value = id;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('estado').checked = (estado === '1');
        document.getElementById('id_sede').value = id_sede;
        document.getElementById('id_tipo_recaudacion').value = id_tipo_recaudacion;

    } else if (type === 'view') {
        modalTitle = 'Ver Recaudación';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';

        // Asignar valores en modo solo lectura
        document.getElementById('recaudacionId').value = id;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('estado').checked = (estado === '1');
        document.getElementById('id_sede').value = id_sede;
        document.getElementById('id_tipo_recaudacion').value = id_tipo_recaudacion;
    }

    document.getElementById('recaudacionModalLabel').innerText = modalTitle;
    document.getElementById('recaudacionForm').action = formAction;

    document.querySelectorAll('#recaudacionForm input, #recaudacionForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    var recaudacionModal = new bootstrap.Modal(document.getElementById('recaudacionModal'));
    recaudacionModal.show();
}

// Función para enviar el formulario y actualizar la tabla sin cerrar el modal
document.getElementById('recaudacionForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const actionUrl = form.getAttribute('action');

    fetch(actionUrl, {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            actualizarTabla(data.recaudaciones);
            mostrarMensaje(data.message, 'success');
        } else {
            mostrarMensaje(data.message, 'danger');
        }
    })
    .catch(error => console.error("Error:", error));
});

// Función para dar de baja una recaudación
function darBajaRecaudacion(id) {
    if (confirm('¿Estás seguro de que deseas dar de baja esta recaudación?')) {
        fetch('/dar_baja_recaudacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Recaudación dada de baja exitosamente');
                location.reload();
            } else {
                alert('Error al dar de baja la recaudación');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('recaudacionId').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('observacion').value = '';
    document.getElementById('id_sede').value = '';
    document.getElementById('id_tipo_recaudacion').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('hora').value = '';
}

// Función para eliminar una recaudación
function eliminarRecaudacion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta recaudación?')) {
        fetch('/eliminar_recaudacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Recaudación eliminada exitosamente');
                location.reload();
            } else {
                alert('Error al eliminar la recaudación');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Funciones para cargar recaudaciones por año y manejar exportación
$('#exportModal').on('show.bs.modal', function () {
    var año = $('#año').val();
    cargarRecaudacionesPorAnio(año);
});

$('#año').change(function () {
    var año = $(this).val();
    cargarRecaudacionesPorAnio(año);
});

function cargarRecaudacionesPorAnio(año) {
    $.ajax({
        url: '/obtener_recaudaciones_por_anio',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ año: año }),
        success: function (response) {
            var tbody = $('#previsualizacionTable tbody');
            tbody.empty();

            if (response.recaudaciones) {
                response.recaudaciones.forEach(function (recaudacion) {
                    tbody.append(`
                        <tr>
                            <td>${recaudacion.id}</td>
                            <td>${recaudacion.fecha}</td>
                            <td>${recaudacion.monto}</td>
                            <td>${recaudacion.observacion}</td>
                            <td>${recaudacion.sede}</td>
                            <td>${recaudacion.tipo_recaudacion}</td>
                        </tr>
                    `);
                });
            } else {
                tbody.append('<tr><td colspan="7" class="text-center">No se encontraron recaudaciones</td></tr>');
            }
        },
        error: function (error) {
            console.error('Error al cargar las recaudaciones:', error);
        }
    });
}

$('#exportarButton').click(function () {
    var tipoExportacion = $('#tipo_exportacion').val();
    var form = $('#exportForm');

    if (tipoExportacion === 'csv') {
        form.attr('action', '/exportar_recaudaciones_csv');
    } else if (tipoExportacion === 'pdf') {
        form.attr('action', '/exportar_recaudaciones_pdf');
    }

    form.submit();
});
