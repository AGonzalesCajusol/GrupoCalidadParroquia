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
            // Insertar el botón "Agregar sede" dentro del div y alinearlo a la derecha
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" data-bs-target="#agregarModal" onclick="abir()"><i class="bi bi-building"></i> Agregar Sede </button>');
        }
    });
});


// Validación para Nombre de la Sede
document.getElementById('nombre_sede').addEventListener('input', function () {
    const nombreSede = this.value.trim();  // Elimina espacios en blanco al inicio y al final
    if (nombreSede === '') {
        this.setCustomValidity('El nombre de la sede no puede estar vacío ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});

// Validación para Dirección
document.getElementById('direccion').addEventListener('input', function () {
    const direccion = this.value.trim();  // Elimina espacios en blanco al inicio y al final
    if (direccion === '') {
        this.setCustomValidity('La dirección no puede estar vacía ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});

//validacion fecha
document.addEventListener('DOMContentLoaded', function () {
    const inputFecha = document.getElementById('creacion');

    // Establecer la fecha máxima (hoy) en el campo de fecha
    const today = new Date().toISOString().split('T')[0];  // Formato YYYY-MM-DD
    inputFecha.setAttribute('max', today);

    // Bloquear la entrada manual en el campo de fecha
    inputFecha.addEventListener('keydown', function (e) {
        e.preventDefault();  // Evita cualquier entrada manual
    });

    // Validar la fecha al seleccionarla
    inputFecha.addEventListener('input', function () {
        const selectedDate = new Date(this.value);
        const currentDate = new Date();

        // Si la fecha seleccionada es mayor a la fecha actual, mostrar un error
        if (selectedDate > currentDate) {
            this.setCustomValidity('La fecha no puede ser mayor a la fecha actual.');
        } else {
            this.setCustomValidity('');  // Limpia el error si la fecha es válida
        }
    });
});

// Validación para Teléfono
const inputTelefono = document.getElementById('telefono');

inputTelefono.addEventListener('input', function () {
    const telefono = this.value.trim();
    const regexTelefono = /^[1-9][0-9]{8}$/;  // Asegura que el primer dígito sea mayor a 0 y que sean 9 dígitos numéricos

    if (!regexTelefono.test(telefono)) {
        this.setCustomValidity('El teléfono debe tener 9 dígitos y no puede comenzar con 0.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});

// Evitar la escritura de letras y permitir solo números
inputTelefono.addEventListener('keydown', function (e) {
    // Permitir solo teclas numéricas, tecla de retroceso, suprimir, tabulador y flechas
    if (
        (e.key >= '0' && e.key <= '9') ||  // Permite números
        e.key === 'Backspace' ||           // Permite retroceso
        e.key === 'Delete' ||              // Permite suprimir
        e.key === 'Tab' ||                 // Permite tabulación
        e.key === 'ArrowLeft' ||           // Permite flecha izquierda
        e.key === 'ArrowRight'             // Permite flecha derecha
    ) {
        return;  // Si la tecla es válida, no hacer nada
    } else {
        e.preventDefault();  // Evita que se escriban otros caracteres
    }
});

// Validación para Congregación
document.getElementById('id_congregacion').addEventListener('change', function () {
    const congregacionSelect = this.value;
    if (congregacionSelect === '' || congregacionSelect === '0') { // Asumiendo que '0' es una opción por defecto o inválida
        this.setCustomValidity('Por favor selecciona una congregación válida.');
    } else {
        this.setCustomValidity(''); // Limpia el error si la selección es válida
    }
});

// Validación para Diócesis
document.getElementById('id_diosesis').addEventListener('change', function () {
    const diossSelect = this.value;
    if (diossSelect === '' || diossSelect === '0') { // Asumiendo que '0' es una opción por defecto o inválida
        this.setCustomValidity('Por favor selecciona una diócesis válida.');
    } else {
        this.setCustomValidity(''); // Limpia el error si la selección es válida
    }
});


// abrir los modales de agregar y editar
function abir() {
    var modalSede = new bootstrap.Modal(document.getElementById('modalSede'));

    const modalTitle = document.getElementById('modalSedeLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formSede = document.getElementById('formSede'); // Obtener el formulario

    modalTitle.textContent = 'Agregar Sede';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formSede.setAttribute('action', insertarSedeURL);

    // Limpiar campos del modal
    document.getElementById('sedeId').value = '';
    document.getElementById('nombre_sede').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('creacion').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('monto').value = '';

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = true;

    const actosCheckboxes = document.querySelectorAll('[id^="estado-"]');
    actosCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
    });

    document.getElementById('estado').setAttribute('disabled', true);
    document.getElementById('id_congregacion').value = '';
    document.getElementById('id_diosesis').value = '';
    document.getElementById('monto_traslado').value = '';

    modalSede.show();
}


function abrirModalEditar(id, nombre, direccion, creacion, telefono, correo, monto, estado, id_congregacion, id_diosesis, monto_traslado) {
    var modalSede = new bootstrap.Modal(document.getElementById('modalSede'));

    const modalTitle = document.getElementById('modalSedeLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formSede = document.getElementById('formSede'); // Obtener el formulario

    modalTitle.textContent = 'Editar Sede';
    submitBtn.textContent = 'Guardar cambios';

    // Cambia el evento de envío para usar AJAX
    formSede.onsubmit = function(event) {
        event.preventDefault(); // Previene el envío tradicional
        
        const formData = new FormData(formSede);

        fetch(actualizarSedeURL, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                actualizarTablaSede(data.sedes); // Actualiza solo la tabla con los datos nuevos
                modalSede.hide(); // Cierra el modal
            } else {
                console.error("Error al actualizar la sede:", data.message);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud de actualización:", error);
        });
    };

    // Llenar los campos con los datos existentes
    document.getElementById('sedeId').value = id;
    document.getElementById('nombre_sede').value = nombre;
    document.getElementById('direccion').value = direccion;
    document.getElementById('creacion').value = creacion;
    document.getElementById('telefono').value = telefono;
    document.getElementById('correo').value = correo;
    document.getElementById('monto').value = monto;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');


    let selectCongregacion = document.getElementById('id_congregacion');
    let selectDiosesis = document.getElementById('id_diosesis');

    // Asignar la congregación y la diócesis basándose en el nombre (texto) mostrado en las opciones
    if (selectCongregacion) {
        seleccionarOpcionPorTexto(selectCongregacion, id_congregacion);
    }

    if (selectDiosesis) {
        seleccionarOpcionPorTexto(selectDiosesis, id_diosesis);
    }

    document.getElementById('monto_traslado').value = monto_traslado;

    // Limpiar todos los checkboxes de los actos litúrgicos
    const actosCheckboxes = document.querySelectorAll('[id^="estado-"]');
    actosCheckboxes.forEach(checkbox => {
        checkbox.checked = false;  // Desmarcar todos inicialmente
        checkbox.disabled = false;  // Habilitar todos los checkboxes para edición
    });

    // Obtener los actos litúrgicos seleccionados desde el servidor mediante AJAX
    $.ajax({
        url: '/obtener_actos_por_sede',  // Usar la ruta para obtener los actos por sede
        type: 'GET',
        data: { id_sede: id },  // Enviar el ID de la sede para obtener los actos litúrgicos asignados
        success: function (response) {
            const actosSeleccionados = response.actos;  // Suponiendo que el servidor devuelve una lista de IDs de actos

            // Marcar los checkboxes correspondientes a los actos litúrgicos seleccionados
            actosSeleccionados.forEach(function (actoId) {
                const checkbox = document.getElementById('estado-' + actoId);
                if (checkbox) {
                    checkbox.checked = true;  // Marcar los checkboxes asociados a la sede
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener los actos litúrgicos: " + error);
        }
    });

    modalSede.show();
}


// Función auxiliar para seleccionar la opción correcta en los select
function seleccionarOpcionPorTexto(selectElement, texto) {
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text === texto) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}

function abrirModalVer(id, nombre, direccion, creacion, telefono, correo, monto, estado, id_congregacion, id_diosesis, monto_traslado) {
    var modalSede = new bootstrap.Modal(document.getElementById('modalSede'));

    const modalTitle = document.getElementById('modalSedeLabel');
    const submitBtn = document.getElementById('submitBtn'); // Botón de submit

    modalTitle.textContent = 'Ver Sede';
    submitBtn.style.display = 'none'; // Ocultar el botón de Guardar


    // Llenar los campos con los datos existentes
    document.getElementById('sedeId').value = id;
    document.getElementById('nombre_sede').value = nombre;
    document.getElementById('direccion').value = direccion;
    document.getElementById('creacion').value = creacion;
    document.getElementById('telefono').value = telefono;
    document.getElementById('correo').value = correo;
    document.getElementById('monto').value = monto;
    document.getElementById('monto_traslado').value = monto_traslado;

    const estadoCheckbox = document.getElementById('estado');
    estadoCheckbox.checked = (estado === true || estado === 'true' || estado === '1');

    let selectCongregacion = document.getElementById('id_congregacion');
    let selectDiosesis = document.getElementById('id_diosesis');


    // Asignar la congregación y la diócesis basándose en el nombre (texto) mostrado en las opciones
    if (selectCongregacion) {
        seleccionarOpcionPorTexto(selectCongregacion, id_congregacion);
    }

    if (selectDiosesis) {
        seleccionarOpcionPorTexto(selectDiosesis, id_diosesis);
    }

    // Limpiar todos los checkboxes de los actos litúrgicos y deshabilitarlos
    const actosCheckboxes = document.querySelectorAll('[id^="estado-"]');
    actosCheckboxes.forEach(checkbox => {
        checkbox.checked = false;  
        checkbox.disabled = true;  
    });

    // Obtener los actos litúrgicos seleccionados desde el servidor mediante AJAX (usando jQuery para simplicidad)
    $.ajax({
        url: '/obtener_actos_por_sede', // Define una nueva ruta en Flask para obtener los actos
        type: 'GET',
        data: { id_sede: id }, // Enviar el ID de la sede para obtener los actos
        success: function (response) {
            const actosSeleccionados = response.actos;  // Suponiendo que el servidor devuelve una lista de IDs de actos

            // Marcar los checkboxes correspondientes a los actos litúrgicos seleccionados
            actosSeleccionados.forEach(function (actoId) {
                const checkbox = document.getElementById('estado-' + actoId);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    });

    // Bloquear los campos para solo permitir ver los datos usando 'disabled'
    document.getElementById('nombre_sede').setAttribute('disabled', true);
    document.getElementById('direccion').setAttribute('disabled', true);
    document.getElementById('creacion').setAttribute('disabled', true);
    document.getElementById('telefono').setAttribute('disabled', true);
    document.getElementById('correo').setAttribute('disabled', true);
    document.getElementById('monto').setAttribute('disabled', true);
    document.getElementById('estado').setAttribute('disabled', true);
    selectCongregacion.setAttribute('disabled', true);
    selectDiosesis.setAttribute('disabled', true);
    document.getElementById('monto_traslado').setAttribute('disabled', true);

    document.getElementById('modalSede').addEventListener('hidden.bs.modal', function () {
        document.getElementById('nombre_sede').removeAttribute('disabled');
        document.getElementById('direccion').removeAttribute('disabled');
        document.getElementById('creacion').removeAttribute('disabled');
        document.getElementById('telefono').removeAttribute('disabled');
        document.getElementById('correo').removeAttribute('disabled');
        document.getElementById('monto').removeAttribute('disabled');
        document.getElementById('estado').removeAttribute('disabled');
        document.getElementById('monto_traslado').removeAttribute('disabled');
        selectCongregacion.removeAttribute('disabled');
        selectDiosesis.removeAttribute('disabled');


        actosCheckboxes.forEach(checkbox => {
            checkbox.removeAttribute('disabled');
        });

        submitBtn.style.display = 'block';
    });

    modalSede.show();
}


function darBajaSede(id, estado) {
    if (estado === '0' || estado === false || estado === 'false') {
        return; // Salir si la sede ya está dada de baja
    }

    if (confirm("¿Estás seguro de que deseas dar de baja esta sede?")) {
        const table = $('#sedeTable').DataTable();
        const currentPage = table.page();

        fetch(darBajaSedeURL, {
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
                actualizarTablaSede(data.sedes);  // Llamada para actualizar la tabla
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

function actualizarTablaSede(sedes) {
    const tbody = document.querySelector('#sedeTable tbody');
    const table = $('#sedeTable').DataTable();
    const currentPage = table.page();

    tbody.innerHTML = ''; // Limpiar la tabla

    // Crear filas con los datos actualizados
    sedes.forEach(sede => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center border">${sede.id}</td>
            <td>${sede.nombre_sede}</td>
            <td>${sede.direccion}</td>
            <td>${sede.telefono}</td>
            <td>${sede.correo}</td>
            <td>${sede.estado == '1' ? 'Activo' : 'Inactivo'}</td>
            <td class="text-center border">
                <button class="btn btn-primary btn-sm" title="Ver"
                    onclick="abrirModalVer('${sede.id}','${sede.nombre_sede}','${sede.direccion}','${sede.creacion}','${sede.telefono}','${sede.correo}','${sede.monto}','${sede.estado}','${sede.id_congregacion}','${sede.id_diosesis}','${sede.monto_traslado}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Editar"
                    onclick="abrirModalEditar('${sede.id}','${sede.nombre_sede}','${sede.direccion}','${sede.creacion}','${sede.telefono}','${sede.correo}','${sede.monto}','${sede.estado}','${sede.id_congregacion}','${sede.id_diosesis}','${sede.monto_traslado}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary btn-sm" title="Dar de baja"
                    onclick="darBajaSede('${sede.id}', '${sede.estado}')"
                    ${sede.estado == "0" ? 'disabled' : ''}>
                    <i class="fas fa-ban"></i>
                </button>
                <form style="display:inline-block;" onsubmit="eliminarSede(event, '${sede.id}')">
                    <button type="submit" class="btn btn-danger btn-sm"
                            onclick="return confirm('¿Estás seguro de que deseas eliminar esta sede?');">
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
