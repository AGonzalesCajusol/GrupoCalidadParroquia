document.addEventListener('DOMContentLoaded', function () {
    console.log("Iniciando el cronograma...");

    const yearSelect = document.getElementById('yearSelect');
    const calendarEl = document.getElementById('calendar');

    if (!calendarEl) {
        console.error("El contenedor del calendario no se encontró.");
        return;
    }

    // Inicializar el año actual en el selector
    const currentYear = new Date().getFullYear();
    yearSelect.value = currentYear;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        height: 'auto',
        events: function (fetchInfo, successCallback, failureCallback) {
            const selectedYear = yearSelect.value; // Obtener el año seleccionado
            console.log("Cargando eventos para el año:", selectedYear);

            fetch(`/api/obtener_actividades?year=${selectedYear}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Eventos cargados:", data);
                    successCallback(data);
                })
                .catch(error => {
                    console.error("Error al cargar eventos:", error);
                    failureCallback(error);
                });
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventClick: function (info) {
            console.log("Evento seleccionado:", info.event);
            const evento = info.event;

            // Mostrar datos en el modal
            document.getElementById('modalTitulo').textContent = 'Datos de la Actividad';
            document.getElementById('celebracionId').value = evento.id;
            document.getElementById('titulo').value = evento.title;
            document.getElementById('fecha_inicio').value = evento.startStr.split('T')[0];
            document.getElementById('hora_inicio').value = evento.startStr.split('T')[1].substring(0, 5);
            document.getElementById('fecha_fin').value = evento.endStr ? evento.endStr.split('T')[0] : '';
            document.getElementById('hora_fin').value = evento.endStr ? evento.endStr.split('T')[1].substring(0, 5) : '';
            document.getElementById('sede').value = evento.extendedProps.sede || '';

            // Bloquear edición
            document.getElementById('titulo').readOnly = true;
            document.getElementById('fecha_inicio').readOnly = true;
            document.getElementById('hora_inicio').readOnly = true;
            document.getElementById('fecha_fin').readOnly = true;
            document.getElementById('hora_fin').readOnly = true;
            document.getElementById('sede').disabled = true;

            $('#celebracionModal').modal('show');
        }
    });

    console.log("Renderizando el calendario...");
    calendar.render();

    // Cambiar el año y recargar eventos
    yearSelect.addEventListener('change', function () {
        const selectedYear = yearSelect.value;
        console.log("Cambiando al año:", selectedYear);

        // Actualizar el rango del calendario al nuevo año
        const newDate = new Date(selectedYear, 0, 1);
        calendar.gotoDate(newDate); // Cambiar la vista al nuevo año
        calendar.refetchEvents(); // Recargar los eventos
    });
});
