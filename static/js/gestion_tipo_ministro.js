$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#tipoMinistroTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tipo" onclick="abrirModalTipoMinistro(\'add\')"><i class="bi bi-plus-circle"></i> Agregar tipo ministro</button>');
        }
    });
});

// Abrir modal
function abrirModalTipoMinistro(accion, id = '', nombre = '', estado = true) {
    const modal = new bootstrap.Modal(document.getElementById('tipoMinistroModal'));
    const modalTitle = document.getElementById('tipoMinistroModalLabel');
    const form = document.getElementById('tipoMinistroForm');
    const submitBtn = document.getElementById('saveChanges');
    const tipoInput = document.getElementById('tipo');
    const estadoCheckbox = document.getElementById('estado');

    if (accion === 'add') {
        modalTitle.textContent = 'Agregar tipo de ministro';
        form.setAttribute('action', '/procesar_insertar_tipo_ministro');
        limpiarModal();
        submitBtn.style.display = 'block';
        submitBtn.textContent = 'Guardar';
        tipoInput.disabled = false;
        estadoCheckbox.disabled = true; // Fijo al agregar
    } else if (accion === 'edit') {
        modalTitle.textContent = 'Editar tipo de ministro';
        form.setAttribute('action', '/procesar_actualizar_tipo_ministro');
        submitBtn.style.display = 'block';
        submitBtn.textContent = 'Guardar Cambios';
        document.getElementById('tipoMinistroId').value = id;
        tipoInput.value = nombre;
        estadoCheckbox.checked = estado == 1;
        tipoInput.disabled = false;
        estadoCheckbox.disabled = false;
    } else if (accion === 'view') {
        modalTitle.textContent = 'Ver tipo de ministro';
        form.setAttribute('action', '');
        submitBtn.style.display = 'none';
        document.getElementById('tipoMinistroId').value = id;
        tipoInput.value = nombre;
        estadoCheckbox.checked = estado == 1;
        tipoInput.disabled = true;
        estadoCheckbox.disabled = true;
    }
    modal.show();
}

// Enviar el formulario
document.getElementById('tipoMinistroForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    formData.set('estado', document.getElementById('estado').checked ? '1' : '0');

    const actionUrl = form.getAttribute('action');
    const submitBtn = document.getElementById('saveChanges');

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
            if (data.success) {
                actualizarTabla(data.tipos_ministro);
                mostrarNotificacion(data.message, "#28a745");
                bootstrap.Modal.getInstance(document.getElementById('tipoMinistroModal')).hide();
            } else {
                mostrarNotificacion(data.message, "#dc3545");
            }
        })
        .catch(error => console.error("Error:", error))
        .finally(() => {
            submitBtn.disabled = false;
        });
});

// Actualizar la tabla
function actualizarTabla(tiposMinistro) {
    const table = $('#tipoMinistroTable').DataTable();
    table.clear();
    tiposMinistro.forEach(tipo => {
        const estadoTexto = tipo.estado === "Activo" ? "Dar de baja" : "Activar";
        const estadoClase = tipo.estado === "Activo" ? "btn-secondary" : "btn-success";
        const estadoIcono = tipo.estado === "Activo" ? "fas fa-ban" : "fas fa-check";
        const row = `
            <tr>
                <td class="text-center">${tipo.id}</td>
                <td>${tipo.nombre}</td>
                <td class="text-center">${tipo.estado}</td>
                <td class="text-center">
                    <button class="btn btn-primary btn-sm" title="Ver"
                        onclick="abrirModalTipoMinistro('view', '${tipo.id}', '${tipo.nombre}', '${tipo.estado === 'Activo' ? 1 : 0}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Editar"
                        onclick="abrirModalTipoMinistro('edit', '${tipo.id}', '${tipo.nombre}', '${tipo.estado === 'Activo' ? 1 : 0}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn ${estadoClase} btn-sm estado-btn" title="${estadoTexto}" 
                        onclick="confirmarCambioEstado('${tipo.id}', '${tipo.estado}')">
                        <i class="${estadoIcono}"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" title="Eliminar"
                        onclick="eliminarTipoMinistro('${tipo.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>`;
        table.row.add($(row));
    });
    table.draw();
}

// Confirmar cambio de estado
function confirmarCambioEstado(id, estadoActual) {
    const nuevoEstado = estadoActual === "Activo" ? 0 : 1;
    const mensaje = estadoActual === "Activo"
        ? "¿Estás seguro de que deseas dar de baja este tipo de ministro?"
        : "¿Estás seguro de que deseas activar este tipo de ministro?";

    if (!confirm(mensaje)) return;

    cambiarEstadoTipoMinistro(id, nuevoEstado);
}

// Cambiar estado
function cambiarEstadoTipoMinistro(id, nuevoEstado) {
    fetch('/actualizar_estado_tipo_ministro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}&estado=${nuevoEstado}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTabla(data.tipos_ministro);
                mostrarNotificacion(data.message, nuevoEstado ? "#ffc107" : "#28a745");
            } else {
                mostrarNotificacion("Error al cambiar el estado.", "#dc3545");
            }
        })
        .catch(error => console.error(error));
}

// Eliminar tipo de ministro
function eliminarTipoMinistro(id) {
    if (!confirm("¿Estás seguro de eliminar este tipo de ministro?")) return;

    fetch('/eliminar_tipo_ministro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTabla(data.tipos_ministro);
                mostrarNotificacion("Tipo de Ministro eliminado con éxito", "#dc3545");
            } else {
                mostrarNotificacion("Error al eliminar el tipo de ministro.", "#dc3545");
            }
        })
        .catch(error => console.error(error));
}

// Mostrar notificación
function mostrarNotificacion(mensaje, color) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        backgroundColor: color,
        gravity: "bottom",
        position: "right"
    }).showToast();
}

// Limpiar modal
function limpiarModal() {
    document.getElementById('tipoMinistroId').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('estado').checked = true;
}
