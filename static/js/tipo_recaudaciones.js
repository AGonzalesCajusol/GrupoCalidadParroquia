$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#tipoRecaudacionTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar tipo de recaudación" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" onclick="abrirModalTipoRecaudacion(\'agregar\')"><i class="bi bi-plus-circle"></i> Agregar tipo de recaudación </button>');
        }
    });
});

// Validación para Nombre de Recaudación
document.getElementById('nombre_recaudacion').addEventListener('input', function () {
    const nombreRecaudacion = this.value.trim();
    if (nombreRecaudacion === '') {
        this.setCustomValidity('El nombre de la recaudación no puede estar vacío ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');
    }
});

function abrirModalTipoRecaudacion(accion, id = '', nombre = '', tipo = '1', estado = true) {
    const modalRecaudacion = new bootstrap.Modal(document.getElementById('modalRecaudacion'));
    const modalTitle = document.getElementById('modalRecaudacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formRecaudacion = document.getElementById('formRecaudacion');

    // Limpiar y configurar el modal según la acción
    if (accion === 'agregar') {
        modalTitle.textContent = 'Agregar Tipo de Recaudación';
        submitBtn.textContent = 'Guardar';
        submitBtn.style.display = 'block';
        formRecaudacion.setAttribute('action', insertarTipoRecaudacionURL);
        
        // Limpiar los campos del formulario
        document.getElementById('tipoRecaudacionId').value = '';
        document.getElementById('nombre_recaudacion').value = '';
        document.getElementById('tipo').value = '1'; // Valor predeterminado: "Monetario"
        document.getElementById('estado').checked = true; // Por defecto, estado activo

        // Configurar los campos para que estén habilitados en el modo de agregar
        document.getElementById('nombre_recaudacion').removeAttribute('disabled');
        document.getElementById('tipo').removeAttribute('disabled');
        document.getElementById('estado').setAttribute('disabled', true); // Estado fijo en activo al agregar

    } else if (accion === 'ver') {
        modalTitle.textContent = 'Ver Tipo de Recaudación';
        submitBtn.style.display = 'none'; // Ocultar botón de guardar en el modo de visualización
        formRecaudacion.setAttribute('action', '');

        // Cargar los datos en los campos
        document.getElementById('tipoRecaudacionId').value = id;
        document.getElementById('nombre_recaudacion').value = nombre;
        document.getElementById('tipo').value = tipo === '1' || tipo.toLowerCase() === 'monetario' ? '1' : '0';
        document.getElementById('estado').checked = estado === true || estado === '1' || estado.toLowerCase() === 'activo';

        // Configurar campos en modo de solo lectura
        document.getElementById('nombre_recaudacion').setAttribute('disabled', true);
        document.getElementById('tipo').setAttribute('disabled', true);
        document.getElementById('estado').setAttribute('disabled', true);

    } else if (accion === 'editar') {
        modalTitle.textContent = 'Editar Tipo de Recaudación';
        submitBtn.textContent = 'Guardar cambios';
        submitBtn.style.display = 'block';
        formRecaudacion.setAttribute('action', actualizarTipoRecaudacionURL);

        // Cargar los datos en los campos para edición
        document.getElementById('tipoRecaudacionId').value = id;
        document.getElementById('nombre_recaudacion').value = nombre;
        document.getElementById('tipo').value = tipo === '1' || tipo.toLowerCase() === 'monetario' ? '1' : '0';
        document.getElementById('estado').checked = estado === true || estado === '1' || estado.toLowerCase() === 'activo';

        // Configurar campos habilitados para edición
        document.getElementById('nombre_recaudacion').removeAttribute('disabled');
        document.getElementById('tipo').removeAttribute('disabled');
        document.getElementById('estado').removeAttribute('disabled');
    }

    // Mostrar el modal configurado
    modalRecaudacion.show();
}

document.getElementById('formRecaudacion').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;
    const nombre = document.getElementById('nombre_recaudacion').value.trim();
    const formData = new FormData(form);
    const estadoCheckbox = document.getElementById('estado');
    formData.set('estado', estadoCheckbox.checked ? '1' : '0');

    const actionUrl = form.getAttribute('action');
    const submitBtn = document.getElementById('submitBtn');
    
    // Evitar múltiples envíos si ya está en progreso
    if (submitBtn.disabled) return;
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
        // Mostrar mensajes según el éxito o error recibido del servidor
        if (data.success) {
            actualizarTabla(data.tipos_recaudacion);
            mostrarMensaje(data.message, "success");

            // Cerrar el modal si la operación fue exitosa
            const modalRecaudacion = bootstrap.Modal.getInstance(document.getElementById('modalRecaudacion'));
            if (modalRecaudacion) {
                modalRecaudacion.hide();
            }
        } else {
            mostrarMensaje(data.message, "danger"); // Mostrar el mensaje de error del backend
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

function actualizarTabla(tiposRecaudacion) {
    const tbody = document.querySelector('#tipoRecaudacionTable tbody');
    const table = $('#tipoRecaudacionTable').DataTable();
    const currentPage = table.page();

    // Limpiar el contenido actual del tbody
    tbody.innerHTML = '';

    // Recorrer los datos de tipos de recaudación y crear las filas
    tiposRecaudacion.forEach(tipo => {
        const row = document.createElement('tr');
        
        // Determinar el estado y el ícono para el botón de estado
        const estadoTexto = tipo.estado === "Activo" ? "Dar de baja" : "Activar";
        const estadoClase = tipo.estado === "Activo" ? "btn-secondary" : "btn-success";
        const estadoIcono = tipo.estado === "Activo" ? "fas fa-ban" : "fas fa-check";

        // Crear las celdas y botones con eventos
        row.innerHTML = `
            <td class="text-center border">${tipo.id}</td>
            <td>${tipo.nombre}</td>
            <td>${tipo.tipo}</td>
            <td style="vertical-align: middle; text-align: center">${tipo.estado}</td>
            <td class="text-center border">
                <button class="btn btn-primary btn-sm" title="Ver"
                    onclick="abrirModalTipoRecaudacion('ver', '${tipo.id}', '${tipo.nombre}', '${tipo.tipo}', '${tipo.estado}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Editar"
                    onclick="abrirModalTipoRecaudacion('editar', '${tipo.id}', '${tipo.nombre}', '${tipo.tipo}', '${tipo.estado}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn ${estadoClase} btn-sm estado-btn" title="${estadoTexto}" 
                    onclick="cambiarEstadoTipoRecaudacion(this)" data-id="${tipo.id}" data-estado="${tipo.estado === 'Activo' ? 1 : 0}">
                    <i class="${estadoIcono}"></i>
                </button>
                <form style="display:inline-block;" onsubmit="eliminarTipoRecaudacion(event, '${tipo.id}')">
                    <button type="submit" class="btn btn-danger btn-sm"
                            onclick="return confirm('¿Estás seguro de que deseas eliminar este tipo de recaudación?');">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </form>
            </td>
        `;

        // Añadir la fila al tbody
        tbody.appendChild(row);
    });

    // Actualizar DataTable sin perder los eventos
    table.clear();
    table.rows.add($(tbody).find('tr'));
    table.draw(false);

    // Restaurar la página a la que el usuario estaba antes de la actualización
    table.page(currentPage).draw(false);
}
function eliminarTipoRecaudacion(event, id) {
    event.preventDefault(); // Prevenir el envío tradicional del formulario

    // Confirmar eliminación
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de recaudación?")) {
        fetch("/eliminar_tipo_recaudacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id=${encodeURIComponent(id)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTabla(data.tipos_recaudacion); // Actualizar la tabla con los datos devueltos
                mostrarMensaje(data.message, "success"); // Mostrar mensaje de éxito
            } else {
                mostrarMensaje(data.message, "danger"); // Mostrar mensaje de error
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarMensaje("Ocurrió un error al intentar eliminar el tipo de recaudación.", "danger");
        });
    }
}
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

    // Agregar la alerta al body para que se muestre en la esquina inferior derecha
    document.body.appendChild(alertContainer);

    // Desaparecer la alerta después de 3 segundos
    setTimeout(() => {
        alertContainer.classList.remove("show");
        alertContainer.style.opacity = "0";
        setTimeout(() => alertContainer.remove(), 500);
    }, 3000);
}

function cambiarEstadoTipoRecaudacion(button) {
    const id = button.getAttribute("data-id");
    const estadoActual = button.getAttribute("data-estado") === "1";

    // Confirma la acción con el usuario
    const confirmacion = estadoActual 
        ? "¿Estás seguro de que deseas dar de baja este tipo de recaudación?" 
        : "¿Estás seguro de que deseas activar este tipo de recaudación?";
    if (!confirm(confirmacion)) return;

    // Define la nueva ruta y el nuevo estado a enviar
    const nuevoEstado = estadoActual ? 0 : 1;

    // Enviar la solicitud de actualización de estado al backend
    fetch("/dar_baja_tipo_recaudacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${encodeURIComponent(id)}&estado=${nuevoEstado}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Actualizar el botón de estado y el ícono dinámicamente
            button.setAttribute("data-estado", nuevoEstado);
            button.setAttribute("title", nuevoEstado ? "Dar de baja" : "Activar");
            button.innerHTML = `<i class="${nuevoEstado ? 'fas fa-ban' : 'fas fa-check'}"></i>`;
            mostrarMensaje(data.message, "success");
            actualizarTabla(data.tipos_recaudacion);
        } else {
            mostrarMensaje(data.message, "danger");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarMensaje("Ocurrió un error al cambiar el estado del tipo de recaudación.", "danger");
    });
}

