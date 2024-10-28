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
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="abrirModalAgregar()"><i class="bi bi-plus-circle"></i> Agregar Tipo de Recaudación </button>');
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

// Abrir el modal para agregar un nuevo tipo de recaudación
function abrirModalAgregar() {
    var modalRecaudacion = new bootstrap.Modal(document.getElementById('modalRecaudacion'));

    const modalTitle = document.getElementById('modalRecaudacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formRecaudacion = document.getElementById('formRecaudacion');

    modalTitle.textContent = 'Agregar Tipo de Recaudación';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formRecaudacion.setAttribute('action', insertarTipoRecaudacionURL);

    // Limpiar campos del modal
    document.getElementById('tipoRecaudacionId').value = '';
    document.getElementById('nombre_recaudacion').value = '';
    document.getElementById('tipo').value = '1';
    document.getElementById('estado').checked = true;

    document.getElementById('estado').setAttribute('disabled', true);

    modalRecaudacion.show();
}

// Abrir el modal para editar un tipo de recaudación
function abrirModalEditar(id, nombre, tipo, estado) {
    var modalRecaudacion = new bootstrap.Modal(document.getElementById('modalRecaudacion'));

    const modalTitle = document.getElementById('modalRecaudacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formRecaudacion = document.getElementById('formRecaudacion');

    modalTitle.textContent = 'Editar Tipo de Recaudación';
    submitBtn.textContent = 'Guardar cambios';

    // Cambiar el action del formulario para que apunte a la ruta de actualización
    formRecaudacion.setAttribute('action', actualizarTipoRecaudacionURL);

    // Llenar los campos con los datos existentes
    document.getElementById('tipoRecaudacionId').value = id;
    document.getElementById('nombre_recaudacion').value = nombre;
    document.getElementById('tipo').value = tipo;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    modalRecaudacion.show();
}

// Abrir el modal para ver los detalles de un tipo de recaudación
function abrirModalVer(id, nombre, tipo, estado) {
    var modalRecaudacion = new bootstrap.Modal(document.getElementById('modalRecaudacion'));

    const modalTitle = document.getElementById('modalRecaudacionLabel');
    const submitBtn = document.getElementById('submitBtn');

    modalTitle.textContent = 'Ver Tipo de Recaudación';
    submitBtn.style.display = 'none'; // Ocultar el botón de Guardar

    // Llenar los campos con los datos existentes
    document.getElementById('tipoRecaudacionId').value = id;
    document.getElementById('nombre_recaudacion').value = nombre;
    document.getElementById('tipo').value = tipo;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    // Deshabilitar los campos
    document.getElementById('nombre_recaudacion').setAttribute('disabled', true);
    document.getElementById('tipo').setAttribute('disabled', true);
    document.getElementById('estado').setAttribute('disabled', true);

    // Mostrar el modal
    modalRecaudacion.show();

    // Al cerrar el modal, restablecer los campos
    document.getElementById('modalRecaudacion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('nombre_recaudacion').removeAttribute('disabled');
        document.getElementById('tipo').removeAttribute('disabled');
        document.getElementById('estado').removeAttribute('disabled');

        // Mostrar el botón de Guardar si es necesario en otros contextos
        submitBtn.style.display = 'block';
    });
}

// Función para dar de baja un tipo de recaudación
function darBajaTipoRecaudacion(id, estado) {
    if (estado === false || estado === 'false' || estado === '0') {
        mostrarAlerta('El tipo de recaudación ya está dado de baja.', 'warning');
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
                mostrarAlerta(data.message, "success");
                table.page(currentPage).draw(false);
            } else {
                mostrarAlerta(data.message, "danger");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mostrarAlerta("Ocurrió un error al intentar dar de baja el tipo de recaudación.", "danger");
        });
    }
}
function eliminarTipoRecaudacion(event, id) {
    event.preventDefault();

    const button = event.target.querySelector('button[type="submit"]');
    if (button) {
        button.disabled = true; // Desactivar el botón para evitar múltiples clics
    }

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
            if (button) {
                button.disabled = false; // Rehabilitar el botón después de la respuesta
            }

            if (data.success) {
                actualizarTabla(data.tipos_recaudacion);
                mostrarAlerta(data.message, "success"); // Mostrar mensaje de éxito
            } else {
                mostrarAlerta(data.message, "danger"); // Mostrar mensaje de error
            }
        })
        .catch(error => {
            console.error("Error:", error);
            if (button) {
                button.disabled = false;
            }
            mostrarAlerta("Ocurrió un error al intentar eliminar el tipo de recaudación.", "danger");
        });
    } else {
        if (button) {
            button.disabled = false; // Rehabilitar el botón si se cancela la confirmación
        }
    }
}
// Función para actualizar la tabla con los nuevos datos, manteniendo el formato original y la paginación
function actualizarTabla(tiposRecaudacion) {
    // Obtener el tbody de la tabla
    const tbody = document.querySelector('#tipoRecaudacionTable tbody');

    // Obtener la tabla de DataTables y la página actual antes de actualizar
    const table = $('#tipoRecaudacionTable').DataTable();
    const currentPage = table.page();

    // Limpiar el contenido actual del tbody
    tbody.innerHTML = '';

    // Recorrer los datos de tipos de recaudación y crear las filas
    tiposRecaudacion.forEach(tipo => {
        const row = document.createElement('tr');

        // Crear las celdas con el mismo estilo de alineación y formato que el HTML original
        row.innerHTML = `
            <td class="text-center border">${tipo.id}</td>
            <td>${tipo.nombre}</td>
            <td>${tipo.tipo}</td>
            <td>${tipo.estado}</td>
            <td class="text-center border">
                <button class="btn btn-primary btn-sm" title="Ver"
                    onclick="abrirModalVer('${tipo.id}', '${tipo.nombre}', '${tipo.tipo}', '${tipo.estado}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Editar"
                    onclick="abrirModalEditar('${tipo.id}', '${tipo.nombre}', '${tipo.tipo}', '${tipo.estado}')">
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

    // Limpiar la tabla de DataTables y volver a agregar las filas
    table.clear();
    table.rows.add($(tbody).find('tr'));
    table.draw(false);

    // Restaurar la página a la que el usuario estaba antes de la actualización
    table.page(currentPage).draw(false);
}
document.addEventListener("DOMContentLoaded", function() {
    const alertElements = document.querySelectorAll('.alert-dismissible');
    
    alertElements.forEach(alert => {
        setTimeout(() => {
            alert.classList.remove("show"); // Iniciar la transición para ocultar la alerta
            alert.style.transition = "opacity 0.5s ease-out"; // Suavizar la transición
            alert.style.opacity = "0"; // Ajustar la opacidad a 0 para el desvanecimiento

            setTimeout(() => alert.remove(), 500);
        }, 3000);  // Esperar 3 segundos antes de iniciar el desvanecimiento
    });
});

function mostrarMensaje(mensaje, tipo) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `alert alert-${tipo} alert-dismissible fade show position-fixed bottom-0 start-0 m-3`;
    alertContainer.role = "alert";
    alertContainer.style.zIndex = "1050"; // Asegurar que el mensaje esté sobre otros elementos
    alertContainer.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Agregar la alerta al body para que se muestre en la esquina inferior izquierda
    document.body.appendChild(alertContainer);

    // Desaparecer la alerta después de 3 segundos
    setTimeout(() => {
        alertContainer.classList.remove("show");
        alertContainer.style.opacity = "0";
        setTimeout(() => alertContainer.remove(), 500);
    }, 3000);
}
