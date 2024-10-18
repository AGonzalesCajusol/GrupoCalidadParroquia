document.addEventListener('DOMContentLoaded', function () {
    var yearSelect = document.getElementById('yearSelect');
    var calendarEl = document.getElementById('calendar');
    var currentYear = new Date().getFullYear();  // Obtener el año actual

    for (var year = 1900; year <= 2070; year++) {
        var option = document.createElement('option');
        option.value = year;
        option.textContent = year;

        // Seleccionar el año actual por defecto
        if (year === currentYear) {
            option.selected = true;
        }

        yearSelect.appendChild(option);  
    }
 
    var calendar = new FullCalendar.Calendar(calendarEl, {                
        initialView: 'dayGridMonth',
        locale: 'es',
        editable: true,
        height: 'auto',
        events: function(fetchInfo, successCallback, failureCallback) {
            // Cargar eventos según el rango de fechas visible en el calendario
            let start = fetchInfo.startStr;
            let end = fetchInfo.endStr;

            fetch(`/api/obtener_celebraciones?start=${start}&end=${end}`)
                .then(response => response.json())
                .then(events => successCallback(events))
                .catch(error => failureCallback(error));
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        dateClick: function(info) {
            limpiarModal();
            document.getElementById('fecha_inicio').value = info.dateStr;
            $('#celebracionModal').modal('show');
        },
        eventClick: function(info) {
            var evento = info.event;
            document.getElementById('celebracionId').value = evento.id;
            document.getElementById('titulo').value = evento.title;
            document.getElementById('fecha_inicio').value = evento.startStr.split('T')[0];
            document.getElementById('hora_inicio').value = evento.startStr.split('T')[1].substring(0, 5);
            document.getElementById('fecha_fin').value = evento.endStr ? evento.endStr.split('T')[0] : '';
            document.getElementById('hora_fin').value = evento.endStr ? evento.endStr.split('T')[1].substring(0, 5) : '';
            document.getElementById('sede').value = evento.extendedProps.sede;
            $('#celebracionModal').modal('show');
        },
        eventDrop: function(info) {
            actualizarEvento(info.event);
        },
        eventResize: function(info) {
            actualizarEvento(info.event);
        },
        
        datesSet: function(info) {
            var selectedDate = new Date(info.start);  // Obtener la fecha actual del calendario
            var selectedYear = selectedDate.getFullYear();  // Obtener el año
        
            yearSelect.value = selectedYear;
        }
    });

    calendar.render();  // Renderizar el calendario

    // Cuando se cambia el año en el select
    yearSelect.addEventListener('change', function() {
        var selectedYear = yearSelect.value;
        var newDate = new Date(selectedYear, 0, 1);  // Cambiar a enero 1 del año seleccionado
        calendar.gotoDate(newDate);  // Navegar al nuevo año en el calendario
    });

    // Función para limpiar el modal
    function limpiarModal() {
        document.getElementById('celebracionId').value = '';
        document.getElementById('titulo').value = '';
        document.getElementById('fecha_inicio').value = '';
        document.getElementById('hora_inicio').value = '';
        document.getElementById('fecha_fin').value = '';
        document.getElementById('hora_fin').value = '';
        document.getElementById('sede').value = '';
    }

    // Función para actualizar el evento
    function actualizarEvento(event) {
        let datos = {
            id: event.id,
            titulo: event.title,
            fecha_inicio: event.start.toISOString(),
            fecha_fin: event.end ? event.end.toISOString() : null,
            sede: event.extendedProps.sede
        };

        fetch('/api/actualizar_celebracion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Celebración actualizada exitosamente');
            } else {
                alert('Error al actualizar la celebración');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
