/* $(document).ready(function () {
    // Inicializar DataTable
    var table = $('#recaudacionesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" data-bs-toggle="modal" onclick="abrirModalRecaudacion(\'add\')"><i class="bi bi-person-plus"></i> Agregar recaudación</button>');
            $("div.button-section").append('<button type="button" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" data-bs-target="#exportModal"><i class="bi bi-file-earmark-arrow-down"></i> Exportar recaudaciones</button>');
         // Agregar el selector de año junto al campo de búsqueda
         $("div.dataTables_filter").addClass("d-flex align-items-center"); // Para alinear ambos elementos
         $("div.dataTables_filter").prepend(`
             <div class="d-flex align-items-center me-3">
                 <label for="filtroAño" class="me-2">Año:</label>
                 <select id="filtroAño" class="form-select" style="width: auto;" onchange="filtrarPorAño()">
                     <option value="">Todos</option>
                     {% for año in años %}
                         <option value="{{ año }}">{{ año }}</option>
                     {% endfor %}
                 </select>
             </div>
         `);
        }
    });
});
 */
$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#recaudacionesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Agregar botones para agregar y exportar recaudaciones
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" data-bs-toggle="modal" onclick="abrirModalRecaudacion(\'add\')"><i class="bi bi-person-plus"></i> Agregar recaudación</button>');
            $("div.button-section").append('<button type="button" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" data-bs-target="#exportModal"><i class="bi bi-file-earmark-arrow-down"></i> Exportar recaudaciones</button>');

            // Agregar el selector de año después del campo de búsqueda
            $("div.dataTables_filter").addClass("d-flex align-items-center"); // Para alinear ambos elementos
            $("div.dataTables_filter").append(`
                <div class="d-flex align-items-center ms-3">
                    <label for="filtroAño" class="me-2">Año:</label>
                    <select id="filtroAño" class="form-select" style="width: auto;" onchange="filtrarPorAño()">
                        <option value="">Todos</option>
                        {% for año in años %}
                            <option value="{{ año }}">{{ año }}</option>
                        {% endfor %}
                    </select>
                </div>
            `);
        }
    });
});
S
$(document).ready(function () {
    // Cambiar el label de "Monto" a "Valoración" según el tipo de recaudación
    $('#id_tipo_recaudacion').on('change', function () {
        const selectedType = $(this).find("option:selected").text().toLowerCase();
        const montoLabel = $('label[for="monto"]');

        // Verificar si el tipo seleccionado es "No Monetario"
        if (selectedType.includes("no monetario") || selectedType.includes("intercambio") || selectedType.includes("donación")) { 
            montoLabel.text('Valoración');
        } else {
            montoLabel.text('Monto');
        }
    });

    // Trigger para ejecutar el cambio de label cuando el modal se abre con el tipo ya seleccionado
    $('#id_tipo_recaudacion').trigger('change');
});

$('#recaudacionModal').on('shown.bs.modal', function () {
    const nombreRecaudacionInput = document.getElementById('nombre_recaudacion');
    if (nombreRecaudacionInput) {
        nombreRecaudacionInput.addEventListener('input', function () {
            const nombreRecaudacion = this.value.trim();
            if (nombreRecaudacion === '') {
                this.setCustomValidity('El nombre de la recaudación no puede estar vacío ni contener solo espacios en blanco.');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
// filtro por año en el combo 
function filtrarPorAño() {
    const añoSeleccionado = $('#filtroAño').val();
    const tabla = $('#recaudacionesTable').DataTable();

    if (añoSeleccionado) {
        tabla.column(4).search('^' + añoSeleccionado, true, false).draw();
    } else {
        tabla.column(4).search('').draw();  // Limpiar el filtro si no hay año seleccionado
    }
}


document.getElementById('monto').addEventListener('input', function () {
    const valoracionInput = this.value;

    // Expresión regular que permite solo números positivos con hasta dos decimales
    const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(valoracionInput);
    
    if (!isValid) {
        this.value = valoracionInput.slice(0, -1);  // Elimina el último carácter ingresado si es inválido
    }
});

document.getElementById('observacion').addEventListener('input', function () {
    const observacionInput = this.value;

    // Expresión regular que permite solo letras y espacios
    const isValid = /^[a-zA-Z\s]*$/.test(observacionInput);
    
    if (!isValid) {
        this.value = observacionInput.slice(0, -1);  // Elimina el último carácter ingresado si es inválido
    }
});



function abrirModalRecaudacion(type, id = null, fecha = '', hora = '', monto = '', observacion = '', sede_nombre = '', tipo_recaudacion = '') {
    let modalTitle = '';
    let formAction = '';
    let isReadOnly = false;

    document.getElementById('fechaContainer').style.display = 'none';
    document.getElementById('horaContainer').style.display = 'none';

    if (type === 'add') {
        modalTitle = 'Agregar recaudación';
        formAction = '/insertar_recaudacion';
        limpiarModal();
    } else if (type === 'edit' || type === 'view') {
        modalTitle = type === 'edit' ? 'Editar recaudación' : 'Ver recaudación';
        formAction = type === 'edit' ? '/procesar_actualizar_recaudacion' : '';
        isReadOnly = type === 'view';

        document.getElementById('recaudacionId').value = id;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;

        if (type === 'view') {
            // Convertir la fecha de YYYY-MM-DD a DD-MM-YYYY
            if (fecha) {
                const [year, month, day] = fecha.split('-');
                fecha = `${day}-${month}-${year}`;
            }
            
            document.getElementById('fecha').value = fecha;
            document.getElementById('hora').value = hora;
            document.getElementById('fechaContainer').style.display = 'block';
            document.getElementById('horaContainer').style.display = 'block';
        } else {
            document.getElementById('fecha').value = '';
            document.getElementById('hora').value = '';
        }

        // Seleccionar el tipo de recaudación en base al texto
        
        const tipoSelect = document.getElementById('id_tipo_recaudacion');
        tipoSelect.value =tipo_recaudacion;
        
    }

    document.getElementById('recaudacionModalLabel').innerText = modalTitle;
    document.getElementById('recaudacionForm').action = formAction;

    const sedeInput = document.getElementById('sede_nombre');
    sedeInput.value = getCookie('sede').replace(/^"|"$/g, '');
    sedeInput.readOnly = true;
    sedeInput.disabled = true;

    document.querySelectorAll('#recaudacionForm input, #recaudacionForm select').forEach(function (input) {
        if (input.id !== 'sede_nombre') {
            input.readOnly = isReadOnly;
            input.disabled = isReadOnly;
        }
    });

    document.getElementById('submitBtn').style.display = isReadOnly ? 'none' : 'block';

    const recaudacionModal = new bootstrap.Modal(document.getElementById('recaudacionModal'));
    recaudacionModal.show();
}

$('#recaudacionForm').on('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);  // Cambiar a FormData para manejar los datos del formulario
    const formAction = $(this).attr('action');
    console.log("Datos enviados:", formData);

    // Deshabilitar el botón para evitar múltiples envíos
    $('#submitBtn').prop('disabled', true);

    // Realizar la solicitud de inserción o actualización
    fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'fetch'  // Opcional: indica que la solicitud se hizo con fetch
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            actualizarTabla(data.recaudaciones);
            $('#recaudacionModal').modal('hide');
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
        // Asegúrate de que `fecha` esté definida en `recaudacion`
        const fechaFormatted = recaudacion.fecha 
            ? new Date(recaudacion.fecha).toLocaleDateString('es-ES') 
            : 'Fecha no disponible';

        const row = $(` 
            <tr class="text-center">
                <td style="vertical-align: middle; text-align: center;">${recaudacion.id}</td>
                <td>${recaudacion.sede}</td>
                <td>${recaudacion.tipo_recaudacion}</td>
                <td>${recaudacion.observacion}</td>
                <td>${fechaFormatted}</td>
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
    const tipoRecaudacion = document.getElementById('id_tipo_recaudacion');
    const monto = document.getElementById('monto');
    const observacion = document.getElementById('observacion');
    const fechaContainer = document.getElementById('fechaContainer');
    const horaContainer = document.getElementById('horaContainer');

    if (recaudacionId) recaudacionId.value = '';
    if (tipoRecaudacion) tipoRecaudacion.value = '';
    if (monto) monto.value = '';
    if (observacion) observacion.value = '';
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
