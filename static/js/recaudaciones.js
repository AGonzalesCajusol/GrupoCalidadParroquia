$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#recaudacionesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Botones para agregar y exportar recaudaciones
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" data-bs-toggle="modal" onclick="abrirModalRecaudacion(\'agregar\')"><i class="bi bi-person-plus"></i> Agregar Recaudación</button>');
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
function abrirModalRecaudacion(accion, id = '', fecha = '', hora = '', monto = '', observacion = '', estado = true, tipoRecaudacion = '') {
    const modalElement = document.getElementById('recaudacionModal');
    if (!modalElement) {
        console.error("No se encontró el modal con el ID 'recaudacionModal'");
        return;
    }

    const modal = new bootstrap.Modal(modalElement);

    // Restablecer el formulario y valores previos
    document.getElementById('recaudacionForm').reset();
    document.getElementById('recaudacionId').value = id || '';
    document.getElementById('monto').value = monto || '';
    document.getElementById('observacion').value = observacion || '';
    document.getElementById('estado').checked = estado === "1" || estado === true;

    // Obtener el nombre de la sede desde la cookie y mostrarlo en el campo de solo lectura
    const sedeNombre = getCookie('sede');  // Obtener el nombre de la sede desde la cookie
    document.getElementById('sede_nombre').value = sedeNombre || 'Sede no encontrada';
    
    // Obtener el ID de la sede y configurarlo en el campo oculto
    const sedeIdField = document.getElementById('sede_id');
    sedeIdField.value = id || ''; // Establece el ID en caso de edición; en agregar se deja vacío.

    // Configurar el tipo de recaudación en el combobox
    const tipoRecaudacionSelect = document.getElementById('id_tipo_recaudacion');

    // Configurar los campos de acuerdo a la acción
    if (accion === 'ver') {
        // Configuración para "Ver"
        document.getElementById('monto').setAttribute('readonly', true);    
        document.getElementById('observacion').setAttribute('readonly', true);
        document.getElementById('estado').setAttribute('disabled', true);
        tipoRecaudacionSelect.setAttribute('disabled', true);

        // Mostrar campos de fecha y hora en modo ver
        document.getElementById('fechaContainer').style.display = 'block';
        document.getElementById('horaContainer').style.display = 'block';
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;

        // Configurar el título y el botón del modal
        document.getElementById('recaudacionModalLabel').innerText = 'Ver Recaudación';
        document.getElementById('recaudacionForm').action = ''; // No necesita acción en modo ver
        document.querySelector('#recaudacionForm button[type="submit"]').style.display = 'none'; // Ocultar botón de guardar
    } else {
        // Configuración para "Agregar" y "Editar"
        document.getElementById('monto').removeAttribute('readonly');
        document.getElementById('observacion').removeAttribute('readonly');
        document.getElementById('estado').removeAttribute('disabled');
        tipoRecaudacionSelect.removeAttribute('disabled');


        // Ocultar los campos de fecha y hora en modo editar y agregar
        document.getElementById('fechaContainer').style.display = 'none';
        document.getElementById('horaContainer').style.display = 'none';

        // Configurar el título y el botón del modal
        if (accion === 'editar') {
            document.getElementById('recaudacionModalLabel').innerText = 'Editar Recaudación';
            document.getElementById('recaudacionForm').action = '/procesar_actualizar_recaudacion';
            document.querySelector('#recaudacionForm button[type="submit"]').style.display = 'block';
            document.querySelector('#recaudacionForm button[type="submit"]').innerText = 'Guardar cambios';
        } else if (accion === 'agregar') {
            document.getElementById('recaudacionModalLabel').innerText = 'Agregar Recaudación';
            document.getElementById('recaudacionForm').action = '/insertar_recaudacion';
            document.querySelector('#recaudacionForm button[type="submit"]').style.display = 'block';
            document.querySelector('#recaudacionForm button[type="submit"]').innerText = 'Guardar';
        }
    }

    // Mostrar el modal configurado
    modal.show();
}
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

document.getElementById('recaudacionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Convertir el valor de 'estado' a '1' o '0'
    const estadoCheckbox = document.getElementById('estado');
    formData.set('estado', estadoCheckbox.checked ? '1' : '0');

    const actionUrl = form.getAttribute('action');
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;

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
            // Actualizar la tabla con los datos devueltos
            actualizarTabla(data.recaudaciones);

            // Cerrar el modal automáticamente
            const modalElement = document.getElementById('recaudacionModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        } else {
            // Mostrar mensaje de error si no fue exitoso
            mostrarMensaje(data.message, "danger");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarMensaje("Ocurrió un error al intentar realizar la operación.", "danger");
    })
    .finally(() => {
        submitBtn.disabled = false;
    });
});
function mostrarMensaje(mensaje, tipo) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alertContainer.role = "alert";
    alertContainer.style.cssText = `
        bottom: 20px; 
        right: 20px; 
        min-width: 250px; 
        max-width: 300px; 
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        z-index: 1050;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    `;
    alertContainer.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertContainer);

    setTimeout(() => {
        alertContainer.classList.remove("show");
        alertContainer.style.opacity = "0";
        setTimeout(() => alertContainer.remove(), 500);
    }, 3000);
}
// Función para cargar el ID de la sede basado en el nombre de la cookie
function cargarIdSede(sedeNombre, callback) {
    fetch(`/obtener_id_sede_por_nombre/${sedeNombre}`)
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                callback(data.id); // Pasa el ID al callback
            } else {
                console.error("No se encontró el ID de la sede para el nombre:", sedeNombre);
                callback(null);
            }
        })
        .catch(error => {
            console.error("Error al obtener el ID de la sede:", error);
            callback(null);
        });
}
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
                actualizarTabla(data.recaudaciones); // Actualizar la tabla con los datos devueltos
                mostrarMensaje(data.message, "success"); // Mostrar mensaje de éxito
            } else {
                mostrarMensaje(data.message, "danger"); // Mostrar mensaje de error
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarMensaje("Ocurrió un error al intentar dar de baja la recaudación.", "danger");
        });
    }
}
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
                actualizarTabla(data.recaudaciones); // Actualizar la tabla con los datos devueltos
                mostrarMensaje(data.message, "success"); // Mostrar mensaje de éxito
            } else {
                mostrarMensaje(data.message, "danger"); // Mostrar mensaje de error
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarMensaje("Ocurrió un error al intentar eliminar la recaudación.", "danger");
        });
    }
}

fetch(urlInsertarRecaudacion, {
    method: 'POST',
    body: new URLSearchParams(new FormData(document.getElementById('recaudacionForm'))),
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        actualizarTablaRecaudaciones(data.recaudaciones); // Actualizar tabla con los nuevos datos
        mostrarMensaje(data.message, "success"); // Mostrar mensaje de éxito
        const modalRecaudacion = bootstrap.Modal.getInstance(document.getElementById('recaudacionModal'));
        modalRecaudacion.hide(); // Cerrar modal
    } else {
        mostrarMensaje(data.message, "danger"); // Mostrar mensaje de error
    }
})
.catch(error => console.error("Error:", error));

function actualizarTabla(recaudaciones) {
    const tbody = document.querySelector('#recaudacionesTable tbody');
    const table = $('#recaudacionesTable').DataTable();
    const currentPage = table.page();

    // Limpiar el contenido actual del tbody
    tbody.innerHTML = '';

    // Recorrer los datos de recaudaciones y crear las filas
    recaudaciones.forEach(recaudacion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center">${recaudacion.id}</td>
            <td>${recaudacion.sede}</td>
            <td>${recaudacion.tipo_recaudacion}</td>
            <td>${recaudacion.observacion}</td>
            <td>${recaudacion.estado}</td>
            <td>${recaudacion.monto}</td>
            <td class="text-center">
                <button class="btn btn-primary btn-sm" title="Ver"
                    onclick="abrirModalRecaudacion('ver', '${recaudacion.id}', '${recaudacion.estado}', '', '${recaudacion.monto}', '${recaudacion.observacion}', '${recaudacion.estado}', '${recaudacion.sede}', '${recaudacion.tipo_recaudacion}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Editar"
                    onclick="abrirModalRecaudacion('editar', '${recaudacion.id}', '${recaudacion.estado}', '', '${recaudacion.monto}', '${recaudacion.observacion}', '${recaudacion.estado}', '${recaudacion.sede}', '${recaudacion.tipo_recaudacion}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary btn-sm" title="Dar de baja"
                    onclick="darBajaRecaudacion('${recaudacion.id}')" ${recaudacion.estado === 'Inactivo' ? 'disabled' : ''}>
                    <i class="fas fa-ban"></i>
                </button>
                <button class="btn btn-danger btn-sm" title="Eliminar"
                    onclick="eliminarRecaudacion('${recaudacion.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Actualizar DataTable sin perder los eventos
    table.clear();
    table.rows.add($(tbody).find('tr'));
    table.draw(false);

    // Restaurar la página a la que el usuario estaba antes de la actualización
    table.page(currentPage).draw(false);
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('recaudacionId').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('observacion').value = '';
    document.getElementById('id_tipo_recaudacion').value = '';
    document.getElementById('tipo_recaudacion_text').value = ''; 
    document.getElementById('fecha').value = '';
    document.getElementById('hora').value = '';
}
