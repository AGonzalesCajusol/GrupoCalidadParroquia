$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#sedeTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',  // Utilizar "justify-content-end" para alinear a la derecha
        language: {
            search: "Buscar:"  // Cambiar el texto de "Search" a "Buscar"
        },
        //dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"l<"d-flex justify-content-between align-items-center"f<"ml-3 button-section">>>rt<"bottom"p>',
        initComplete: function () {
            // Insertar el botón "Agregar ministro" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="abirC()"><i class="bi bi-person-plus"></i> Agregar congregación </button>');
        }
    });
});


document.getElementById('nombre_congregacion').addEventListener('input', function () {
    const nombrecongregacion = this.value.trim();  // Elimina espacios en blanco al inicio y al final
    if (nombrecongregacion === '') {
        this.setCustomValidity('El nombre de la congregación no puede estar vacío ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});


function abirC() {
    var modalCongreg = new bootstrap.Modal(document.getElementById('modalCongregacion'));

    const modalTitle = document.getElementById('ModalCongregacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formCongregacion = document.getElementById('formCongregacion'); // Obtener el formulario

    modalTitle.textContent = 'Agregar congregación';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formCongregacion.setAttribute('action', insertarCongreURL);

    // Limpiar campos del modal
    document.getElementById('congregacionId').value = '';
    document.getElementById('nombre_congregacion').value = '';

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = true;

    document.getElementById('estado').setAttribute('disabled', true);

    formCongregacion.onsubmit = function (event) {
        Toastify({
            text: "Congregación agregada correctamente.",
            duration: 2000,
            close: true,
            backgroundColor: "--bs-primary",
            gravity: "bottom",
            position: "right",
        }).showToast();
    };
    modalCongreg.show();
}


function abrirModalEditarC(id, nombre, estado) {
    var modalCongreg = new bootstrap.Modal(document.getElementById('modalCongregacion'));

    const modalTitle = document.getElementById('ModalCongregacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formCongregacion = document.getElementById('formCongregacion');

    modalTitle.textContent = 'Editar congregación';
    submitBtn.textContent = 'Guardar cambios';

    // Cambia el evento de envío para usar AJAX en lugar del envío tradicional
    formCongregacion.onsubmit = function(event) {
        event.preventDefault();  // Previene el envío tradicional

        const formData = new FormData(formCongregacion);

        fetch(actualizarCongreURL, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTablaCongregacion(data.congregacion); // Actualiza la tabla con los nuevos datos
                Toastify({
                    text: "Se modificó la congregación correctamente.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                modalCongreg.hide(); // Cierra el modal
            } else {
                Toastify({
                    text: data.message || "Error al intentar modificar la congregación.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                //console.error("Error al actualizar la congregación:", data.message);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud de actualización:", error);
            Toastify({
                text: "Ocurrió un error al modificar la congregación.",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        });
    };

    // Llenar los campos con los datos existentes
    document.getElementById('congregacionId').value = id;
    document.getElementById('nombre_congregacion').value = nombre;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    modalCongreg.show();
}


function abrirModalVerC(id, nombre, estado) {
    var modalCongreg = new bootstrap.Modal(document.getElementById('modalCongregacion'));

    const modalTitle = document.getElementById('ModalCongregacionLabel');
    const submitBtn = document.getElementById('submitBtn');

    modalTitle.textContent = 'Ver congregación';
    submitBtn.style.display = 'none'; // Ocultar el botón de Guardar

    document.getElementById('congregacionId').value = id;
    document.getElementById('nombre_congregacion').value = nombre;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    // Bloquear los campos para solo permitir ver los datos usando 'disabled' para el estilo gris
    document.getElementById('nombre_congregacion').setAttribute('disabled', true);
    document.getElementById('estado').setAttribute('disabled', true);


    // Al cerrar el modal, restablecer los campos
    document.getElementById('modalCongregacion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('nombre_congregacion').removeAttribute('disabled');
        document.getElementById('estado').removeAttribute('disabled');

        submitBtn.style.display = 'block';
    });

    modalCongreg.show();
}


function cambiarEstadoCongregacion(id, estadoActual) {
    // Determinar el nuevo estado y la acción correspondiente
    const nuevoEstado = estadoActual === '1' ? 0 : 1;
    const accion = nuevoEstado === 1 ? 'Activar' : 'Dar de baja';

    // Confirmar la acción con el usuario
    if (confirm(`¿Estás seguro de que deseas ${accion} esta congregación?`)) {
        // Realizar la solicitud al backend
        fetch("/cambiar_estado_congregacion", { // Nueva ruta
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id=${encodeURIComponent(id)}&estado=${nuevoEstado}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Actualizar la tabla con los datos devueltos
                actualizarTablaCongregacion(data.congregacion);

                // Mostrar mensaje de éxito con Toastify
                Toastify({
                    text: `Congregación ${accion.toLowerCase()} correctamente.`,
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            } else {
                // Mostrar mensaje de error devuelto por el backend
                Toastify({
                    text: data.message || "Error al intentar actualizar el estado.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545", // Rojo para errores
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        })
        .catch(error => {
            console.error("Error:", error);

            // Mostrar mensaje de error general
            Toastify({
                text: "Ocurrió un error al intentar cambiar el estado.",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545", // Rojo para errores
                gravity: "bottom",
                position: "right",
            }).showToast();
        });
    }
}


function actualizarTablaCongregacion(congregacion) {
    const tbody = document.querySelector('#sedeTable tbody');
    const table = $('#sedeTable').DataTable();
    const currentPage = table.page();

    tbody.innerHTML = ''; // Limpiar la tabla

    // Crear filas con los datos actualizados
    congregacion.forEach(Congre => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center border">${Congre.id}</td>
            <td>${Congre.nombre_congregacion}</td>
            <td class="text-center">${Congre.estado == '1' ? 'Activo' : 'Inactivo'}</td>
            <td class="text-center border">
                <button class="btn btn-primary btn-sm" title="Ver"
                    onclick="abrirModalVerC('${Congre.id}','${Congre.nombre_congregacion}','${Congre.estado}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Editar"
                    onclick="abrirModalEditarC('${Congre.id}','${Congre.nombre_congregacion}','${Congre.estado}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary btn-sm" title="Dar de baja"
                    onclick="darBajaCongre('${Congre.id}', '${Congre.estado}')"
                    ${Congre.estado == "0" ? 'disabled' : ''}>
                    <i class="fas fa-ban"></i>
                </button>
                <form style="display:inline-block;" onsubmit="eliminarCongre(event, '${Congre.id}')">
                    <button type="submit" class="btn btn-danger btn-sm"
                            onclick="return confirm('¿Estás seguro de que deseas eliminar esta congregación?');">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </form>
            </td>
        `;

        tbody.appendChild(row);
    });

    table.clear();
    table.rows.add($(tbody).find('tr'));
    table.draw(false);
    table.page(currentPage).draw(false);
}

function eliminarCongre(event, id) {
    event.preventDefault();

    if (confirm("¿Estás seguro de que deseas eliminar esta congregación?")) {
        fetch("/eliminar_congregacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `id=${encodeURIComponent(id)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //mostrarAlerta("success", data.message);
                Toastify({
                    text: "Congregación eliminada correctamente.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                actualizarTablaCongregacion();
            } else {
                Toastify({
                    text: data.message || "Error al intentar eliminar la congregación.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                //mostrarAlerta("danger", data.message);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud de eliminación:", error);
            Toastify({
                text: "Ocurrió un error al intentar eliminar la congregación.",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
            //mostrarAlerta("danger", "Hubo un error al intentar eliminar la congregación.");
        });
    }
}

// Función para mostrar notificaciones
function mostrarAlerta(tipo, mensaje) {
    const alertaDiv = document.getElementById('alerta');
    alertaDiv.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertaDiv.style.display = "block";
    //alertaDiv.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
        alertaDiv.style.display = "none";
    }, 5000);
}

function actualizarTablaCongregacion() {
    const table = $('#sedeTable').DataTable();
    const currentPage = table.page(); // Guardar la página actual

    fetch("/gestionar_congregacion")
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const nuevaTabla = doc.querySelector("#sedeTable tbody");

            // Actualizar el cuerpo de la tabla
            const tbody = document.querySelector("#sedeTable tbody");
            tbody.innerHTML = nuevaTabla.innerHTML;

            // Volver a inicializar DataTables y mantener la página actual
            table.clear().rows.add($(tbody).find('tr')).draw(false);
            table.page(currentPage).draw(false);
        })
        .catch(error => {
            console.error("Error al actualizar la tabla:", error);
        });
}
