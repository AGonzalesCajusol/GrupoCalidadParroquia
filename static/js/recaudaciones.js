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
         let opciones = '<option value="">Todos</option>';

            fetch("/apiaños")
                .then(response => response.json())
                .then(response => { 
                    // Generar las opciones directamente en la variable opciones
                    response.data.forEach(element => {
                        opciones += `<option value="${element.año}">${element.año}</option>`;
                    });

                    // Insertar el selector de año en el DOM después de que opciones esté lleno
                    $("div.dataTables_filter").addClass("d-flex align-items-center"); // Para alinear ambos elementos
                    $("div.dataTables_filter").append(`
                        <div class="d-flex align-items-center ms-2">
                            <label for="filtroAño" class="me-2">Año:</label>
                            <select id="filtroAño" class="form-select" style="width: auto;" onchange="filtrarPorAño()">
                                ${opciones}
                            </select>
                        </div>
                    `);
                })
                .catch(error => {
                    console.error("Error al cargar los años:", error);
                });
         `);
        }
    });
});
 */
/* $(document).ready(function () {
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
            $("div.button-section").append('<button type="button" onclick= "exportarTablaPDF()" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" data-bs-target="#exportModal"><i class="bi bi-file-earmark-arrow-down"></i> Exportar recaudaciones</button>');
            let opciones = '<option value="">Todos</option>';

            fetch("/apiaños")
                .then(response => response.json())
                .then(response => { 
                    // Generar las opciones directamente en la variable opciones
                    response.data.forEach(element => {
                        opciones += `<option value="${element.año}">${element.año}</option>`;
                    });

                    // Insertar el selector de año en el DOM después de que opciones esté lleno
                    $("div.dataTables_filter").addClass("d-flex align-items-center"); // Para alinear ambos elementos
                    $("div.dataTables_filter").append(`
                        <div class="d-flex align-items-center ms-2">
                            <label for="filtroAño" class="me-2">Año:</label>
                            <select id="filtroAño" class="form-select" style="width: auto;" onchange="filtrarPorAño()">
                                ${opciones}
                            </select>
                        </div>
                    `);
                })
                .catch(error => {
                    console.error("Error al cargar los años:", error);
                });
        }
    });
}); */
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
            $("div.button-section").html(`
                <button type="button" class="btn btn-success btn-lg custom-btn me-3 btn-agregar-recaudacion" data-bs-toggle="modal" onclick="abrirModalRecaudacion('add')">
                    <i class="bi bi-person-plus"></i> Agregar recaudación
                </button>
                <button type="button" onclick="exportarTablaPDF()" class="btn btn-success btn-lg custom-btn" data-bs-toggle="modal" data-bs-target="#exportModal">
                    <i class="bi bi-file-earmark-arrow-down"></i> Exportar recaudaciones
                </button>
            `);
            // Opciones para el filtro de año
            let opcionesAño = '<option value="">Todos</option>';
            fetch("/apiaños")
                .then(response => response.json())
                .then(response => { 
                    response.data.forEach(element => {
                        opcionesAño += `<option value="${element.año}">${element.año}</option>`;
                    });

                    // Insertar el selector de año en el DOM
                    $("div.dataTables_filter").addClass("d-flex align-items-center");
                    $("div.dataTables_filter").html(`
                        <div class="d-flex align-items-center me-2">
                            <label for="filtroAño" class="me-2">Año:</label>
                            <select id="filtroAño" class="form-select" style="width: auto;" onchange="filtrarPorAño()">
                                ${opcionesAño}
                            </select>
                        </div>
                        <div class="d-flex align-items-center me-2">
                            <label for="filtroTipo" class="me-2">Tipo:</label>
                            <select id="filtroTipo" class="form-select" style="width: auto;" onchange="filtrarPorTipo()">
                                ${opcionesTipo}
                            </select>
                        </div>
                        <div class="d-flex align-items-center">
                        <label for="buscar" class="me-2">Buscar:</label>
                        <input type="search" id="buscar" style="flex-grow: 1; max-width: 200px; height: 37.5px; padding: 5px;" placeholder="" aria-controls="recaudacionesTable">
                        </div>
                    `);
                    $('#buscar').on('keyup', function() {
                        table.search(this.value).draw();
                    });
                })
                .catch(error => {
                    console.error("Error al cargar los años:", error);
                });

            // Opciones para el filtro de tipo
            let opcionesTipo = '<option value="">Todos</option>';
            fetch("/api/tipos_todos")
                .then(response => response.json())
                .then(response => {
                    if (response.data) {
                        response.data.forEach(element => {
                            opcionesTipo += `<option value="${element.tipo}">${element.tipo}</option>`;
                        });
            
                        // Insertar las opciones en el select ya existente
                        $('#filtroTipo').html(opcionesTipo);
                    }
                })
                .catch(error => {
                    console.error("Error al cargar los tipos:", error);
                });
        }
    });
});


// Función para filtrar por año en el combo
function filtrarPorAño() {
    const añoSeleccionado = $('#filtroAño').val();
    const tabla = $('#recaudacionesTable').DataTable();

    if (añoSeleccionado) {
        tabla.column(4).search(añoSeleccionado, true, false).draw();
    } else {
        tabla.column(4).search('').draw();  // Limpiar el filtro
    }
}

// Función para filtrar por tipo en el combo
function filtrarPorTipo() {
    const tipoSeleccionado = $('#filtroTipo').val();
    const tabla = $('#recaudacionesTable').DataTable();

    if (tipoSeleccionado) {
        tabla.column(2).search(tipoSeleccionado, true, false).draw();
    } else {
        tabla.column(2).search('').draw();  // Limpiar el filtro
    }
}


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
        // Ajusta el filtro para buscar el año en cualquier parte de la cadena de la fecha
        tabla.column(4).search(añoSeleccionado, true, false).draw();
    } else {
        tabla.column(4).search('').draw();  // Limpiar el filtro
    }
}

function exportarTablaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Ruta del logo de la iglesia
    const logoRuta = '/static/img/calidazzzz.jpg';

    // Dimensiones del logo
    const logoWidth = 25;
    const logoHeight = 25;
    const logoX = 10;
    const logoY = 10;

    const img = new Image();
    img.src = logoRuta;

    img.onload = function () {
        // Configuración de la tabla
        const table = $('#recaudacionesTable').DataTable();
        const datos = [];
        table.rows({ search: 'applied' }).every(function () {
            const data = this.data();
            datos.push([
                data[0], // ID
                data[1], // Sede
                data[2], // Tipo
                data[3], // Observaciones
                data[4], // Fecha
                data[5]  // Monto
            ]);
        });

        // Agregar contenido en todas las páginas
        function addHeader() {
            // Fondo blanco para evitar cuadros negros
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

            // Logo y título
            doc.addImage(img, 'JPEG', logoX, logoY, logoWidth, logoHeight);
            doc.setFontSize(18);
            doc.text("Informe de Recaudaciones", 40, 25);
        }

        // Renderizar la tabla con encabezado en todas las páginas
        doc.autoTable({
            head: [['ID', 'Sede', 'Tipo', 'Observaciones', 'Fecha', 'Monto']],
            body: datos,
            startY: 40, // La tabla comienza después del logo y título
            styles: {
                fontSize: 10,
                cellPadding: 3,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [167, 192, 221],
                textColor: 255,
                fontSize: 11,
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: [0, 0, 0],
            },
            alternateRowStyles: {
                fillColor: [240, 248, 255],
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 40, halign: 'left' },
                3: { cellWidth: 50, halign: 'left' },
                4: { cellWidth: 25, halign: 'center' },
                5: { cellWidth: 20, halign: 'right' },
            },
            didDrawPage: function (data) {
                // Agregar encabezado en cada página
                addHeader();

                // Número de página
                const pageCount = doc.internal.getCurrentPageInfo().pageNumber;
                doc.setFontSize(10);
                doc.text(`Página ${pageCount}`, 180, 10);
            },
        });

        // Guardar el PDF
        doc.save("Informe_Recaudaciones.pdf");
    };

    img.onerror = function () {
        console.error("No se pudo cargar la imagen del logo.");
    };
}

// Función para obtener los datos visibles de la tabla
function obtenerDatosTabla() {
    const table = $('#recaudacionesTable').DataTable();
    const datos = [];
    table.rows({ search: 'applied' }).every(function () {
        const data = this.data();
        datos.push([
            data[0], // ID
            data[1], // Sede
            data[2], // Tipo
            data[3], // Observaciones
            data[4], // Fecha
            data[5]  // Monto
        ]);
    });
    return datos;
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
            //alert(tipo_recaudacion);
            const select = document.getElementById('id_tipo_recaudacion');
            if (!select.querySelector(`option[value="${tipo_recaudacion}"]`)) {
                select.innerHTML += `<option value="${tipo_recaudacion}">${tipo_recaudacion}</option>`;
              }
            //document.getElementById('id_tipo_recaudacion').add = ("tipo_recaudacion");

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
