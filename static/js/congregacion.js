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
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="abirC()"><i class="bi bi-person-plus"></i> Agregar Congregación </button>');
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

    modalTitle.textContent = 'Agregar Congregación';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formCongregacion.setAttribute('action', insertarCongreURL);

    // Limpiar campos del modal
    document.getElementById('congregacionId').value = '';
    document.getElementById('nombre_congregacion').value = '';

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = true;

    document.getElementById('estado').setAttribute('disabled', true);

    modalCongreg.show();
}


function abrirModalEditarC(id, nombre, estado) {
    var modalCongreg = new bootstrap.Modal(document.getElementById('modalCongregacion'));

    const modalTitle = document.getElementById('ModalCongregacionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formCongregacion = document.getElementById('formCongregacion');

    modalTitle.textContent = 'Editar Congregación';
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
                modalCongreg.hide(); // Cierra el modal
            } else {
                console.error("Error al actualizar la congregación:", data.message);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud de actualización:", error);
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

    modalTitle.textContent = 'Ver Congregación';
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


function darBajaCongre(id, estado) {
    if (estado === '0' || estado === false || estado === 'false') {
        return;
    }

    if (confirm("¿Estás seguro de que deseas dar de baja esta congregación?")) {
        const table = $('#sedeTable').DataTable();
        const currentPage = table.page();

        fetch(darBajaCongreURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id=${encodeURIComponent(id)}`
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data recibida del servidor:", data); // Verificar datos recibidos
            if (data.success) {
                actualizarTablaCongregacion(data.congregacion);  // Llamada para actualizar la tabla
                table.page(currentPage).draw(false); // Mantener la misma página de paginación
            } else {
                console.error("Error:", data.message); // Mensaje de error en consola
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
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
            <td>${Congre.estado == '1' ? 'Activo' : 'Inactivo'}</td>
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
