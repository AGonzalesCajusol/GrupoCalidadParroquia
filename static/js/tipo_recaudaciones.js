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
    // Obtener el modal y sus elementos
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
        
        // Asegurarse de que el ID esté vacío para que la base de datos lo genere
        document.getElementById('tipoRecaudacionId').value = '';
        formRecaudacion.reset(); // Limpiar otros campos del formulario
        document.getElementById('nombre_recaudacion').value = '';
        document.getElementById('tipo').value = '1'; // Valor predeterminado "Monetario" en agregar
        document.getElementById('estado').checked = true;

        // Configurar campos: habilitar para entrada
        document.getElementById('nombre_recaudacion').removeAttribute('disabled');
        document.getElementById('tipo').removeAttribute('disabled');
        document.getElementById('estado').setAttribute('disabled', true); // Estado fijo en activo

    } else if (accion === 'ver') {
        modalTitle.textContent = 'Ver Tipo de Recaudación';
        submitBtn.style.display = 'none'; // Ocultar botón de guardar

        // Cargar datos en los campos
        document.getElementById('tipoRecaudacionId').value = id;
        document.getElementById('nombre_recaudacion').value = nombre;
        document.getElementById('tipo').value = tipo === '1' ? '1' : '0'; // Verificar y asignar tipo correctamente
        document.getElementById('estado').checked = (estado === 'Activo' || estado === true || estado === '1');

        // Configurar campos: deshabilitar para vista solo lectura
        document.getElementById('nombre_recaudacion').setAttribute('disabled', true);
        document.getElementById('tipo').setAttribute('disabled', true);
        document.getElementById('estado').setAttribute('disabled', true);

    } else if (accion === 'editar') {
        modalTitle.textContent = 'Editar Tipo de Recaudación';
        submitBtn.textContent = 'Guardar cambios';
        submitBtn.style.display = 'block';
        formRecaudacion.setAttribute('action', actualizarTipoRecaudacionURL);

        // Cargar datos en los campos
        document.getElementById('tipoRecaudacionId').value = id;
        document.getElementById('nombre_recaudacion').value = nombre;
        
        // Aquí nos aseguramos de que el tipo esté correctamente seleccionado
        document.getElementById('tipo').value = tipo === '1' ? '1' : '0';
        
        // Asignar el estado (activo/inactivo)
        document.getElementById('estado').checked = (estado === 'Activo' || estado === true || estado === '1');

        // Configurar campos: habilitar para edición
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
            actualizarTabla(data.tipos_recaudacion);
            mostrarMensaje(data.message, "success");

            const modalRecaudacion = bootstrap.Modal.getInstance(document.getElementById('modalRecaudacion'));
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
// Función para actualizar la tabla con los nuevos datos, manteniendo el formato original y la paginación
function actualizarTabla(tiposRecaudacion) {
    const tbody = document.querySelector('#tipoRecaudacionTable tbody');
    const table = $('#tipoRecaudacionTable').DataTable();
    const currentPage = table.page();

    // Limpiar el contenido actual del tbody
    tbody.innerHTML = '';

    // Recorrer los datos de tipos de recaudación y crear las filas
    tiposRecaudacion.forEach(tipo => {
        const row = document.createElement('tr');

        // Crear las celdas y botones con eventos
        row.innerHTML = `
            <td class="text-center border">${tipo.id}</td>
            <td>${tipo.nombre}</td>
            <td>${tipo.tipo}</td>
            <td>${tipo.estado}</td>
            <td class="text-center border">
                <button class="btn btn-primary btn-sm" title="Ver"
                    onclick="abrirModalTipoRecaudacion('ver', '${tipo.id}', '${tipo.nombre}', '${tipo.tipo}', '${tipo.estado}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Editar"
                    onclick="abrirModalTipoRecaudacion('editar', '${tipo.id}', '${tipo.nombre}', '${tipo.tipo}', '${tipo.estado}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary btn-sm" title="Dar de baja"
                    onclick="darBajaTipoRecaudacion('${tipo.id}', '${tipo.estado === "Activo" ? 1 : 0}')"
                    ${tipo.estado === "Inactivo" ? 'disabled' : ''}>
                    <i class="fas fa-ban"></i>
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
document.getElementById('formRecaudacion').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío tradicional del formulario

    const form = event.target;
    const formData = new FormData(form);

    // Ajustar el valor de 'estado' para que sea un número (1 o 0)
    const estadoCheckbox = document.getElementById('estado');
    formData.set('estado', estadoCheckbox.checked ? '1' : '0');

    const actionUrl = form.getAttribute('action'); // Obtenemos la URL de acción del formulario
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.disabled = true; // Deshabilitar el botón para evitar múltiples envíos

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
            actualizarTabla(data.tipos_recaudacion); // Actualizar la tabla con los datos devueltos
            mostrarAlerta(data.message, "success"); // Mostrar mensaje de éxito
        } else {
            mostrarAlerta(data.message, "danger"); // Mostrar mensaje de error
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarAlerta("Ocurrió un error al intentar realizar la operación.", "danger");
    })
    .finally(() => {
        submitBtn.disabled = false; // Rehabilitar el botón después de la respuesta

        // Cerrar el modal después de cualquier resultado (éxito o error)
        const modalElement = document.getElementById('modalRecaudacion');
        if (modalElement) {
            const modalRecaudacion = bootstrap.Modal.getOrCreateInstance(modalElement);
            modalRecaudacion.hide();
        }
    });
});

function mostrarMensaje(mensaje, tipo) {
    // Crear contenedor de alerta
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
function darBajaTipoRecaudacion(id, estado) {
    if (estado === false || estado === 'false' || estado === '0') {
        mostrarMensaje('El tipo de recaudación ya está dado de baja.', 'warning');
        return;
    }

    if (confirm("¿Estás seguro de que deseas dar de baja este tipo de recaudación?")) {
        const table = $('#tipoRecaudacionTable').DataTable();
        const currentPage = table.page();

        fetch("/dar_baja_tipo_recaudacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id=${encodeURIComponent(id)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTabla(data.tipos_recaudacion);
                mostrarMensaje(data.message, "success"); // Mensaje de éxito
                table.page(currentPage).draw(false);
            } else {
                mostrarMensaje(data.message, "danger"); // Mensaje de error
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarMensaje("Ocurrió un error al intentar dar de baja el tipo de recaudación.", "danger");
        });
    }
}

