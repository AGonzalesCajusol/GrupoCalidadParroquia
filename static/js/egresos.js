$(document).ready(function(){
    //Iniciar Datatable
    var table = $('#egresosTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Agregar botones para agregar y exportar egresos
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-egreso" data-bs-toggle="modal" onclick="abrirModalEgreso(\'add\')"><i class="bi bi-person-plus"></i> Agregar egreso</button>');
            $("div.button-section").append('<button type="button" onclick= "exportarTablaPDF()" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" data-bs-target="#exportModal"><i class="bi bi-file-earmark-arrow-down"></i> Exportar egreso</button>');

            let opciones = '<option value="">Todos</option>';
            fetch("/apiaños")
                .then(response => response.json())
                .then(response => { 
                    response.data.forEach(element => {
                        opciones += `<option value="${element.año}">${element.año}</option>`;
                    });

                    // Insertar el selector de año en el DOM
                    $("div.dataTables_filter").addClass("d-flex align-items-center");
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
});

$('#egresoModal').on('shown.bs.modal', function () {
    const nombreEgresoInput = document.getElementById('nombre_egreso');
    if (nombreEgresoInput) {
        nombreEgresoInput.addEventListener('input', function () {
            const nombreEgreso = this.value.trim();
            if (nombreEgreso === '') {
                this.setCustomValidity('El nombre del egreso no puede estar vacío ni contener solo espacios en blanco.');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
// filtro por año en el combo 
function filtrarPorAño() {
    const añoSeleccionado = $('#filtroAño').val();
    const tabla = $('#egresosTable').DataTable();

    if (añoSeleccionado) {
        // Filtrar la tabla para mostrar solo los registros del año seleccionado
        tabla.column(3).search(añoSeleccionado, true, false).draw();
    } else {
        tabla.column(3).search('').draw();  // Limpiar el filtro si "Todos" está seleccionado
    }
}


function exportarTablaPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del informe
    doc.setFontSize(18);
    doc.text("Informe de Egresos", 14, 20);

    // Obtener solo las filas visibles en la tabla (las filtradas)
    const table = $('#egresosTable').DataTable();
    const datos = [];
    table.rows({ search: 'applied' }).every(function () {
        const data = this.data();
        datos.push([
            data[0], // ID
            data[1], // Sede
            data[2], // Descripcion
            data[3], // Fecha
            data[4], // Hora
            data[5]  // Monto
        ]);
    });

    // Configuración de la tabla en el PDF
    doc.autoTable({
        head: [['ID', 'Sede', 'Descripción', 'Fecha','Hora', 'Monto']],
        body: datos,
        startY: 30,
        styles: {
            fontSize: 10,
            cellPadding: 3,
            valign: 'middle',
            halign: 'center', // Alinear el texto al centro
        },
        headStyles: {
            fillColor: [167, 192, 221], // Color de encabezado
            textColor: 255, // Texto en blanco
            fontSize: 11,
            fontStyle: 'bold',
        },
        bodyStyles: {
            textColor: [0, 0, 0],
        },
        alternateRowStyles: {
            fillColor: [240, 248, 255], // Alternar color de fondo de las filas
        },
        columnStyles: {
            0: { cellWidth: 15 },   // ID
            1: { cellWidth: 30 },   // Sede
            2: { cellWidth: 50 },   // Descripcion
            3: { cellWidth: 25 },   // Fecha
            4: { cellWidth: 25 },   // Hora
            5: { cellWidth: 20 },   // Monto
        },
        didDrawPage: function (data) {
            // Encabezado de página
            doc.setFontSize(10);
            doc.text("Página " + doc.internal.getCurrentPageInfo().pageNumber, 180, 10);
        }
    });

    // Guardar el PDF
    doc.save("Informe_Egresos.pdf");
}

//Para validar monto decimal
document.getElementById('monto').addEventListener('input', function () {
    const valoracionInput = this.value;

//Expresión regular que permite solo números positivos con hasta dos decimales
    const isValid = /^[0-9]*\.?[0-9]{0,2}$/.test(valoracionInput);
    
    if (!isValid) {
        this.value = valoracionInput.slice(0, -1);  // Elimina el último carácter ingresado si es inválido
    }
});

//Para validar texto
//document.getElementById('descripcion').addEventListener('input', function () {
//    const descripcionInput = this.value;

    // Expresión regular que permite solo letras y espacios
//    const isValid = /^[a-zA-Z\s]*$/.test(descripcionInput);
    
//    if (!isValid) {
//        this.value = descripcionInput.slice(0, -1);  // Elimina el último carácter ingresado si es inválido
//    }
//});

function abrirModalEgreso(type, id = null, sede_nombre = '', descripcion = '', fecha = '', hora = '', monto = '') {
    let modalTitle = '';
    let formAction = '';
    let isReadOnly = false;

    document.getElementById('fechaContainer').style.display = 'none';
    document.getElementById('horaContainer').style.display = 'none';

    if (type === 'add') {
        modalTitle = 'Agregar egreso';
        formAction = '/insertar_egreso';
        limpiarModal();
    } else if (type === 'edit' || type === 'view') {
        modalTitle = type === 'edit' ? 'Editar egreso' : 'Ver egreso';
        formAction = type === 'edit' ? '/procesar_actualizar_egreso' : '';
        isReadOnly = type === 'view';

        document.getElementById('egresoId').value = id;
        document.getElementById('monto').value = monto;
        document.getElementById('descripcion').value = descripcion;

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
       
    }

    document.getElementById('egresoModalLabel').innerText = modalTitle;
    document.getElementById('egresoForm').action = formAction;

    const sedeInput = document.getElementById('sede_nombre');
    sedeInput.value = getCookie('sede').replace(/^"|"$/g, '');
    sedeInput.readOnly = true;
    sedeInput.disabled = true;

    document.querySelectorAll('#egresoForm input, #egresoForm select').forEach(function (input) {
        if (input.id !== 'sede_nombre') {
            input.readOnly = isReadOnly;
            input.disabled = isReadOnly;
        }
    });

    document.getElementById('submitBtn').style.display = isReadOnly ? 'none' : 'block';

    const egresoModal = new bootstrap.Modal(document.getElementById('egresoModal'));
    egresoModal.show();
}

$('#egresoForm').on('submit', function(event) {
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
            actualizarTabla(data.egresos);
            $('#egresoModal').modal('hide');
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

// Función para mostrar el mensaje en la estructura de Bootstrap=?
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

function actualizarTabla(egresos) {
    const table = $('#egresosTable').DataTable();

    // Limpiar el contenido actual del DataTable
    table.clear();

    // Generar filas con el diseño HTML específico y añadirlas
    egresos.forEach(egreso => {
        // Asegúrate de que `fecha` esté definida en `egreso`
        const fechaFormatted = egreso.fecha 
            ? new Date(egreso.fecha).toLocaleDateString('es-ES') 
            : 'Fecha no disponible';

        const row = $(` 
            <tr class="text-center">
                <td style="vertical-align: middle; text-align: center;">${egreso.id}</td>
                <td>${egreso.sede}</td>
                <td>${egreso.descripcion}</td>
                <td>${fechaFormatted}</td>
                <td>${egreso.hora}</td>
                <td style="vertical-align: middle; text-align: center; width: 100px;">${egreso.monto}</td>
                <td class="text-center" style="vertical-align: middle; text-align: center; width: 100px;">
                    <button class="btn btn-primary btn-sm" title="Ver" onclick="abrirModalEgreso('view', '${egreso.id}', '${egreso.sede}','${egreso.descripcion}','${egreso.fecha}', '${egreso.hora}','${egreso.monto}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Editar" onclick="abrirModalEgreso('edit', '${egreso.id}', '${egreso.sede}','${egreso.descripcion}','${egreso.fecha}', '${egreso.hora}','${egreso.monto}')">
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
    const egresoId = document.getElementById('egresoId');
    const monto = document.getElementById('monto');
    const descripcion = document.getElementById('descripcion');
    const fechaContainer = document.getElementById('fechaContainer');
    const horaContainer = document.getElementById('horaContainer');

    if (egresoId) egresoId.value = '';
    if (monto) monto.value = '';
    if (descripcion) descripcion.value = '';
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
