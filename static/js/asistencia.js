$(document).ready(function () {
    var table = $('#asistenciaTable').DataTable({
        pageLength: 7,
        dom: '<"d-flex justify-content-between align-items-start mb-2"<"d-flex"f>>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.dataTables_filter label").addClass("ms-3 mt-1");
            $("div.bottom").append(`
                <div class="d-flex justify-content-center mt-2">
                    <button type="button" class="btn btn-success btn-lg custom-btn btn-agregar-ministro" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="guardar()">
                        <i class="bi bi-person-check"></i> Guardar asistencias
                    </button>
                </div>
            `);

            let opcionesFiltro = '<option value=""> Todos </option>';
            let opcionesFiltroH = '<option value=""> 00:00:00 </option>';
            let opcionesFiltroD = '<option value=""> 00:00:00 </option>';
            let opcionesFiltroM = '<option value=""> ---------- </option>';
            fetch("/apiprogramacion")
                .then(response => response.json())
                .then(response => {
                    response.data.forEach(element => {
                        opcionesFiltro += `<option value="${element.id_programacion}">${element.hora_tema}</option>`;
                        opcionesFiltroH += `<option value="${element.id_programacion}">${element.hora_inicio}</option>`;
                        opcionesFiltroD += `<option value="${element.id_programacion}">${element.duracion}</option>`;
                        opcionesFiltroM += `<option value="${element.id_programacion}">${element.nombre_ministro}</option>`;
                    });

                    $("div.dataTables_filter").addClass("d-flex align-items-start");
                    $("div.dataTables_filter").prepend(`
                        <div>
                            <div class="d-flex align-items-center mb-2">
                                <label for="filtroProgramacion" class="me-2">Programación:</label>
                                <select id="filtroProgramacion" class="form-select" style="width: auto;" onchange="filtrarPorProgramacion()">
                                    ${opcionesFiltro}
                                </select>
                                <label for="filtroMinistro" class="ms-4 me-4">Ministro:</label>
                                <select id="filtroMinistro" class="form-select" style="width: auto;" disabled>
                                    ${opcionesFiltroM}
                                </select>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <label for="filtroHoraInicio" class="ms-4 me-4">Hora de inicio:</label>
                                <select id="filtroHoraInicio" class="form-select" style="width: auto;" disabled>
                                    ${opcionesFiltroH}
                                </select>
                                <label for="filtroDuracion" class="ms-4 me-4">Duración:</label>
                                <select id="filtroDuracion" class="form-select" style="width: auto;" disabled>
                                    ${opcionesFiltroD}
                                </select>
                            </div>
                        </div>
                    `);
                })
                .catch(error => {
                    console.error("Error al cargar los datos de programación:", error);
                });
        },
    });

    // Función para filtrar por id_programacion
    window.filtrarPorProgramacion = function () {
        const filtro = $('#filtroProgramacion').val();
        // Seleccionar automáticamente las opciones de los otros combobox
        $('#filtroMinistro').val(filtro);
        $('#filtroHoraInicio').val(filtro);
        $('#filtroDuracion').val(filtro);
        if (filtro) {
            table.column(1).search('^' + filtro + '$', true, false).draw(); // Filtra por id_programacion exacto
        } else {
            table.column(1).search('').draw(); // Muestra todo si no hay filtro
        }
    };

    // Código para minimizar o mostrar el calendario
    $('#toggle-calendar').click(function () {
        var calendarContainer = $('#calendar');
        var isHidden = calendarContainer.css('display') === 'none';

        // Alternar entre mostrar y ocultar el calendario
        if (isHidden) {
            calendarContainer.show();
            $(this).text('Minimizar Calendario');
            calendar.render();
            calendar.updateSize();
        } else {
            calendarContainer.hide();
            $(this).text('Mostrar Calendario');  // Cambiar texto del botón
        }
    });

    // Inicializar el calendario
    var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        height: '400px',
        contentHeight: 'auto',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
        },
        events: function (info, successCallback, failureCallback) {
            fetch('/apicalendar')
                .then(response => response.json())
                .then(data => {
                    if (data.data && data.data.length > 0) {
                        const eventos = data.data.map(evento => ({
                            title: evento.title,
                            start: evento.start,
                            extendedProps: {
                                id_programacion: evento.extendedProps.id_programacion,
                                hora_tema: evento.extendedProps.hora_tema
                            }
                        }));
                        successCallback(eventos); // Cargar los eventos en el calendario
                    } else {
                        console.error("No hay eventos disponibles.");
                    }
                })
                .catch(error => {
                    console.error("Error al cargar los eventos del calendario:", error);
                    failureCallback(error);
                });
        },
        loading: function (isLoading) {
            if (isLoading) {
                console.log("Cargando eventos...");
            } else {
                console.log("Eventos cargados.");
            }
        },
        dateClick: function (info) {
            // Cambiar color del día seleccionado
            $(".fc-day").removeClass("fc-selected-day"); // Quitar clase de selección anterior
            $(`[data-date="${info.dateStr}"]`).addClass("fc-selected-day");

            // Minimizar el calendario
            $('#calendar').hide();
            $('#toggle-calendar').text('Mostrar Calendario');

            // Filtrar registros de la tabla por fecha seleccionada
            const fechaSeleccionada = info.dateStr;
            table
                .column(0).search('^' + fechaSeleccionada + '$', true, false) // Filtro en la columna de fecha
                .draw();

            // Verificar si hay opciones disponibles para la fecha seleccionada
            fetch('/apiprogramacion')
                .then(response => response.json())
                .then(response => {
                    const opcionesDisponibles = response.data.filter(item => item.Fecha === fechaSeleccionada);
                    if (opcionesDisponibles.length === 0) {
                        // Si no hay opciones para la fecha seleccionada, seleccionar "Todos"
                        $('#filtroProgramacion').val('').trigger('change');
                    }
                })
                .catch(error => {
                    console.error("Error al filtrar por fecha:", error);
                });
        },
        eventClick: function (info) {
            // Cambiar color del día del evento seleccionado
            $(".fc-day").removeClass("fc-selected-day"); // Quitar clase de selección anterior
            $(`[data-date="${info.event.startStr.split('T')[0]}"]`).addClass("fc-selected-day");

            // Minimizar el calendario
            $('#calendar').hide();
            $('#toggle-calendar').text('Mostrar Calendario');

            // Filtrar registros de la tabla por fecha y id_programacion
            const selectedDate = info.event.startStr.split('T')[0]; // Fecha seleccionada
            const idProgramacion = info.event.extendedProps.id_programacion; // ID de programación seleccionada
            const horaTema = info.event.extendedProps.hora_tema;

            // Aplicar filtro a la tabla
            table
                .column(0).search('^' + selectedDate + '$', true, false) // Filtro en la columna de fecha
                .column(1).search('^' + idProgramacion + '$', true, false) // Filtro en la columna de id_programacion
                .draw();

            // Seleccionar el hora-tema en el combobox
            let comboBox = $('#filtroProgramacion');
            let selectedOption = comboBox.find('option').filter(function () {
                return $(this).text() === horaTema; // Verificar si el texto del option coincide con el hora_tema
            });

            if (selectedOption.length > 0) {
                comboBox.val(selectedOption.val()).trigger('change'); // Selecciona el valor correspondiente
            }
        }
    });

    // Mostrar el calendario al cargar la página
    calendar.render();
    setTimeout(() => {
        calendar.updateSize(); // Actualiza el tamaño para adaptarse al contenedor
    }, 300);

    // Añadir estilo para el día seleccionado
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .fc-selected-day {
                background-color: #FFDD57 !important;
                border-radius: 5px;
                color: black;
            }
        `)
        .appendTo('head');

    // Función para filtrar por fecha seleccionada
    function filtrarPorFecha(selectedDate) {
        fetch('/apiprogramacion')
            .then(response => response.json())
            .then(response => {
                // Filtramos las opciones del combo según la fecha seleccionada
                const opcionesFiltro = response.data.filter(item => item.Fecha === selectedDate)
                    .map(item => {
                        return `<option value="${item.id_programacion}">${item.hora_tema}</option>`;
                    });
                $('#filtroProgramacion').html('<option value="">Seleccionar programación</option>' + opcionesFiltro.join(''));
            })
            .catch(error => {
                console.error("Error al filtrar por fecha:", error);
            });
    }

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
                    //mostrarAlerta('Asistencias actualizadas correctamente.', 'success');
                    Toastify({
                        text: `Asistencias actualizadas correctamente.`,
                        duration: 2000,
                        close: true,
                        backgroundColor: "--bs-primary",
                        gravity: "bottom",
                        position: "right",
                    }).showToast();
                    location.reload(); // Recargar para ver los cambios
                } else {
                    Toastify({
                        text: data.message || "Error al actualizar las asistencias.",
                        duration: 2000,
                        close: true,
                        backgroundColor: "#dc3545",
                        gravity: "bottom",
                        position: "right",
                    }).showToast();
                    //mostrarAlerta('Error al actualizar las asistencias.', 'danger');
                }
            })
            .catch(error => {
                console.error('Error en la petición:', error);
                Toastify({
                    text: "Ocurrió un error al intentar actualizar las asistencias.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                //mostrarAlerta('Hubo un error al procesar la solicitud.', 'danger');
            });
    } else {
        Toastify({
            text: "No se ha seleccionado ninguna asistencia.",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
        //mostrarAlerta('No se ha seleccionado ninguna asistencia.', 'warning');
    }
}
