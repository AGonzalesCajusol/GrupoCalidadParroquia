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
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-recaudacion" onclick="abrirModalRecaudacion(\'agregar\')"><i class="bi bi-plus-circle"></i> Agregar Recaudación </button>');
        }
    });
});

// Función para abrir el modal de recaudaciones
function abrirModalRecaudacion(accion, id = '', fecha = '', hora = '', monto = '', observacion = '', estado = true, sede = '', tipo = '') {
    const modalRecaudacion = new bootstrap.Modal(document.getElementById('recaudacionModal'));
    const modalTitle = document.getElementById('recaudacionModalLabel');
    const submitBtn = document.getElementById('saveChanges');
    const formRecaudacion = document.getElementById('recaudacionForm');

    if (accion === 'agregar') {
        modalTitle.textContent = 'Agregar Recaudación';
        submitBtn.textContent = 'Guardar';
        formRecaudacion.setAttribute('action', urlInsertarRecaudacion);
        formRecaudacion.reset();
        document.getElementById('recaudacionId').value = '';
        document.getElementById('monto').value = '';
        document.getElementById('observacion').value = '';
        document.getElementById('estado').checked = true;

    } else if (accion === 'ver') {
        modalTitle.textContent = 'Ver Recaudación';
        submitBtn.style.display = 'none';
        document.getElementById('recaudacionId').value = id;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('estado').checked = estado;
        document.getElementById('monto').setAttribute('disabled', true);
        document.getElementById('observacion').setAttribute('disabled', true);
        document.getElementById('estado').setAttribute('disabled', true);
    } else if (accion === 'editar') {
        modalTitle.textContent = 'Editar Recaudación';
        submitBtn.textContent = 'Guardar cambios';
        formRecaudacion.setAttribute('action', urlActualizarRecaudacion);
        document.getElementById('recaudacionId').value = id;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora').value = hora;
        document.getElementById('monto').value = monto;
        document.getElementById('observacion').value = observacion;
        document.getElementById('estado').checked = estado;
        document.getElementById('monto').removeAttribute('disabled');
        document.getElementById('observacion').removeAttribute('disabled');
        document.getElementById('estado').removeAttribute('disabled');
    }

    modalRecaudacion.show();
}

// Evento para enviar el formulario de recaudación
document.getElementById('recaudacionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const estadoCheckbox = document.getElementById('estado');
    formData.set('estado', estadoCheckbox.checked ? '1' : '0');
    const actionUrl = form.getAttribute('action');
    const submitBtn = document.getElementById('saveChanges');
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
            actualizarTabla(data.recaudaciones);
            mostrarMensaje(data.message, "success");
            const modalRecaudacion = bootstrap.Modal.getInstance(document.getElementById('recaudacionModal'));
            if (modalRecaudacion) {
                modalRecaudacion.hide();
            }
        } else {
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

// Función para actualizar la tabla con los nuevos datos
function actualizarTabla(recaudaciones) {
    const tbody = document.querySelector('#recaudacionesTable tbody');
    const table = $('#recaudacionesTable').DataTable();
    const currentPage = table.page();
    tbody.innerHTML = '';

    recaudaciones.forEach(rec => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center border">${rec.id}</td>
            <td>${rec.sede}</td>
            <td>${rec.tipo_recaudacion}</td>
            <td>${rec.observacion}</td>
            <td>${rec.fecha}</td>
            <td>${rec.monto}</td>
            <td class="text-center border">
                <button class="btn btn-primary btn-sm" title="Ver"
                    onclick="abrirModalRecaudacion('ver', '${rec.id}', '${rec.fecha}', '${rec.hora}', '${rec.monto}', '${rec.observacion}', '${rec.estado}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Editar"
                    onclick="abrirModalRecaudacion('editar', '${rec.id}', '${rec.fecha}', '${rec.hora}', '${rec.monto}', '${rec.observacion}', '${rec.estado}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary btn-sm" title="Dar de baja"
                    onclick="darBajaRecaudacion('${rec.id}')">
                    <i class="fas fa-ban"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm" title="Eliminar"
                    onclick="eliminarRecaudacion('${rec.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.clear();
    table.rows.add($(tbody).find('tr'));
    table.draw(false);
    table.page(currentPage).draw(false);
}

// Función para mostrar mensajes de alerta
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

// Función para dar de baja una recaudación
function darBajaRecaudacion(id) {
    if (confirm("¿Estás seguro de que deseas dar de baja esta recaudación?")) {
        const table = $('#recaudacionesTable').DataTable();
        const currentPage = table.page();

        fetch("/dar_baja_recaudacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id=${encodeURIComponent(id)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTabla(data.recaudaciones);
                mostrarMensaje(data.message, "success");
                table.page(currentPage).draw(false);
            } else {
                mostrarMensaje(data.message, "danger");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarMensaje("Ocurrió un error al intentar dar de baja la recaudación.", "danger");
        });
    }
}
