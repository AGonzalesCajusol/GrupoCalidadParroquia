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
        alert('El tipo de recaudación ya está dado de baja.');
        return;
    }

    const formRecaudacion = document.getElementById('formRecaudacion');

    formRecaudacion.setAttribute('action', darBajaTipoRecaudacionURL);

    document.getElementById('tipoRecaudacionId').value = id;
    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = true; // Cambiamos a inactivo

    alert('El estado del tipo de recaudación ha sido cambiado exitosamente a Inactivo');

    formRecaudacion.submit();
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

// Función para mostrar el mensaje en la interfaz
function mostrarAlerta(mensaje, tipo) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertContainer.role = "alert";
    alertContainer.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insertar la alerta en la parte superior de la sección de mensajes
    const mensajesContainer = document.querySelector(".container.mt-3");
    if (mensajesContainer) {
        mensajesContainer.appendChild(alertContainer);
    } else {
        // Si no hay un contenedor específico, agregar la alerta al body
        document.body.appendChild(alertContainer);
    }

    // Hacer que desaparezca automáticamente después de 3 segundos
    setTimeout(() => {
        alertContainer.classList.remove("show");
        alertContainer.style.transition = "opacity 0.5s ease-out";
        alertContainer.style.opacity = "0";
        setTimeout(() => alertContainer.remove(), 500);
    }, 3000);
}
function actualizarTabla(tiposRecaudacion) {
    // Obtener la página actual antes de destruir la tabla
    const table = $('#tipoRecaudacionTable').DataTable();
    const currentPage = table.page();
    const currentSearch = table.search();

    // Destruir la instancia existente de DataTable
    table.clear().destroy();

    // Obtener el cuerpo de la tabla y limpiar su contenido
    const tableBody = document.querySelector('#tipoRecaudacionTable tbody');
    tableBody.innerHTML = '';

    // Agregar las nuevas filas a la tabla
    tiposRecaudacion.forEach(tipo => {
        const row = `
            <tr>
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
                    <form style="display:inline-block;" 
                          onsubmit="eliminarTipoRecaudacion(event, '${tipo.id}')">
                        <button type="submit" class="btn btn-danger btn-sm"
                                onclick="return confirm('¿Estás seguro de que deseas eliminar este tipo de recaudación?');">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </form>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Reaplicar DataTable y restaurar la página y búsqueda
    const newTable = $('#tipoRecaudacionTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="abrirModalAgregar()"><i class="bi bi-plus-circle"></i> Agregar Tipo de Recaudación </button>');
        }
    });

    // Restaurar la página y la búsqueda
    newTable.page(currentPage).draw(false); // Mantener la página actual
    newTable.search(currentSearch).draw(false); // Mantener el término de búsqueda actual
}

document.addEventListener("DOMContentLoaded", function() {
    // Seleccionar todos los elementos de alerta que tengan la clase 'alert-dismissible'
    const alertElements = document.querySelectorAll('.alert-dismissible');
    
    // Iterar sobre cada alerta y configurar un temporizador para que desaparezcan
    alertElements.forEach(alert => {
        setTimeout(() => {
            alert.classList.remove("show"); // Iniciar la transición para ocultar la alerta
            alert.style.transition = "opacity 0.5s ease-out"; // Suavizar la transición
            alert.style.opacity = "0"; // Ajustar la opacidad a 0 para el desvanecimiento

            // Remover el elemento después de la animación
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
