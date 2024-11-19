$(document).ready(function () {
    var table = $('#asistenciaTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f>>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.bottom").append(`
                <div class="d-flex justify-content-center mt-3">
                    <button type="button" class="btn btn-success btn-lg custom-btn btn-agregar-ministro" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="guardar()">
                        <i class="bi bi-person-check"></i> Guardar asistencias
                    </button>
                </div>
            `);

            let opcionesFiltro = '<option value="">Todos</option>';
            fetch("/apiprogramacion")
                .then(response => response.json())
                .then(response => {
                    response.data.forEach(element => {
                        opcionesFiltro += `<option value="${element.id_programacion}">${element.hora_tema}</option>`;
                    });

                    $("div.dataTables_filter").addClass("d-flex align-items-center");
                    $("div.dataTables_filter").prepend(`
                        <div class="d-flex align-items-center me-2">
                            <label for="filtroProgramacion" class="me-2">Programación:</label>
                            <select id="filtroProgramacion" class="form-select" style="width: auto;" onchange="filtrarPorProgramacion()">
                                ${opcionesFiltro}
                            </select>
                        </div>
                    `);
                })
                .catch(error => {
                    console.error("Error al cargar los datos de programación:", error);
                });
        }
    });

    // Función para filtrar por id_programacion
    window.filtrarPorProgramacion = function () {
        const filtro = $('#filtroProgramacion').val();
        if (filtro) {
            table.column(1).search('^' + filtro + '$', true, false).draw(); // Filtra por id_programacion exacto
        } else {
            table.column(1).search('').draw(); // Muestra todo si no hay filtro
        }
    };
});


function mostrarAlerta(mensaje, tipo = 'success') {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo} mt-3`;
    alertaDiv.textContent = mensaje;
    document.getElementById('alerta').appendChild(alertaDiv);

    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        alertaDiv.remove();
    }, 5000);
}

function guardar() {
    // Capturar todos los checkboxes seleccionados que NO están deshabilitados
    const seleccionados = [];
    $('.asistencia-checkbox:checked:not(:disabled)').each(function () {
        const idAsistencia = $(this).data('id');
        seleccionados.push(idAsistencia);
    });

    console.log("IDs seleccionados para enviar:", seleccionados);

    if (seleccionados.length > 0) {
        fetch('/actualizar_asistencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: seleccionados })
        })
        .then(response => {
            console.log("Estado de la respuesta:", response.status);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mostrarAlerta('Asistencias actualizadas correctamente.', 'success');
                location.reload(); // Recargar para ver los cambios
            } else {
                mostrarAlerta('Error al actualizar las asistencias.', 'danger');
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
            mostrarAlerta('Hubo un error al procesar la solicitud.', 'danger');
        });
    } else {
        mostrarAlerta('No se ha seleccionado ninguna asistencia.', 'warning');
    }
}





