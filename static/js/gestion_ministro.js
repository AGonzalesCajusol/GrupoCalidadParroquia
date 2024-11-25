$(document).ready(function () {
    // Inicializar DataTable
    var table = $('#ministrosTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Insertar el botón "Agregar ministro"
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar ministro</button>');
        }
    });
});

function openModal(type, id = null, nombre = '', documento = '', nacimiento = '', ordenacion = '', actividades = '', tipo = '', sede = '', cargo = '', estado = '') {
    var modalTitle = '';
    var formAction = '';
    const guardarBtn = document.getElementById('saveChanges'); // Botón Guardar

    if (type === 'add') {
        modalTitle = 'Agregar ministro';
        formAction = '/insertar_ministro';
        limpiarModal();
        document.getElementById('passwordSection').style.display = 'block';
        document.getElementById('confirmPasswordSection').style.display = 'block';
        document.getElementById('password').required = true;
        document.getElementById('confirmPassword').required = true;
        document.getElementById('estado').disabled = false; // Activar el checkbox
        document.getElementById('estado').checked = true; // Estado por defecto: Activo
    } else if (type === 'edit') {
        modalTitle = 'Editar ministro';
        formAction = '/procesar_actualizar_ministro';
        document.getElementById('ministroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('documento').value = documento;
        document.getElementById('nacimiento').value = nacimiento;
        document.getElementById('ordenacion').value = ordenacion;
        document.getElementById('actividades').value = actividades;
        document.getElementById('id_tipoministro').value = tipo;
        document.getElementById('id_sede').value = sede;
        document.getElementById('id_cargo').value = cargo;
        document.getElementById('estado').disabled = false; // Activar el checkbox
        document.getElementById('estado').checked = (estado === 'Activo' || estado === '1' || estado === true); // Mostrar estado actual
        document.getElementById('passwordSection').style.display = 'none';
        document.getElementById('confirmPasswordSection').style.display = 'none';
        document.getElementById('password').required = false;
        document.getElementById('confirmPassword').required = false;
    } else if (type === 'view') {
        modalTitle = 'Ver ministro';
        formAction = '';
        document.getElementById('ministroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('documento').value = documento;
        document.getElementById('nacimiento').value = nacimiento;
        document.getElementById('ordenacion').value = ordenacion;
        document.getElementById('actividades').value = actividades;
        document.getElementById('id_tipoministro').value = tipo;
        document.getElementById('id_sede').value = sede;
        document.getElementById('id_cargo').value = cargo;

        // Mostrar estado como solo lectura
        document.getElementById('estado').disabled = true;
        document.getElementById('estado').checked = (estado == 'Activo'); // Marcar checkbox si está activo
        document.getElementById('passwordSection').style.display = 'none';
        document.getElementById('confirmPasswordSection').style.display = 'none';

        // Deshabilitar campos para solo lectura
        document.getElementById('nombre').readOnly = true;
        document.getElementById('documento').readOnly = true;
        document.getElementById('nacimiento').readOnly = true;
        document.getElementById('ordenacion').readOnly = true;
        document.getElementById('actividades').readOnly = true;
        document.getElementById('id_tipoministro').disabled = true;
        document.getElementById('id_sede').disabled = true;
        document.getElementById('id_cargo').disabled = true;

        guardarBtn.style.display = 'none'; // Ocultar botón Guardar en modo Ver

    }

    document.getElementById('ministroModalLabel').innerText = modalTitle;
    document.getElementById('ministroForm').action = formAction;

    var ministroModal = new bootstrap.Modal(document.getElementById('ministroModal'));
    ministroModal.show();
}


function eliminarMinistro(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este ministro?")) {
        fetch('/eliminar_ministro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje('success', data.message);
                location.reload();
            } else {
                mostrarMensaje('error', data.message); // Mostrar mensaje detallado
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function limpiarModal() {
    document.getElementById('ministroId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('documento').value = '';
    document.getElementById('nacimiento').value = '';
    document.getElementById('ordenacion').value = '';
    document.getElementById('actividades').value = '';
    document.getElementById('id_tipoministro').value = '';
    document.getElementById('id_sede').value = '';
    document.getElementById('id_cargo').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('estado').checked = true;
}

function mostrarMensaje(tipo, mensaje) {
    const colores = {
        success: "#28a745",
        error: "#dc3545"
    };

    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        backgroundColor: colores[tipo] || "#6c757d",
    }).showToast();
}

document.addEventListener('DOMContentLoaded', function () {
    const ministroForm = document.getElementById('ministroForm');

    if (ministroForm) {
        ministroForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevenir el envío hasta validar

            // Obtener valores de las fechas
            const nacimiento = new Date(document.getElementById('nacimiento').value);
            const ordenacion = new Date(document.getElementById('ordenacion').value);
            const finActividades = new Date(document.getElementById('actividades').value);

            // Validar fecha de nacimiento: debe ser hace más de 20 años
            const hoy = new Date();
            const diferenciaAnios = hoy.getFullYear() - nacimiento.getFullYear();
            if (diferenciaAnios < 20 || (diferenciaAnios === 20 && hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate()))) {
                mostrarMensaje('error', 'La fecha de nacimiento debe ser hace más de 20 años.');
                return;
            }

            // Validar que la ordenación sea posterior a la fecha de nacimiento
            if (ordenacion <= nacimiento) {
                mostrarMensaje('error', 'La fecha de ordenación debe ser posterior a la fecha de nacimiento.');
                return;
            }

            // Validar que fin de actividades sea posterior a la fecha de nacimiento
            if (finActividades <= nacimiento) {
                mostrarMensaje('error', 'La fecha de fin de actividades debe ser posterior a la fecha de nacimiento.');
                return;
            }

            // Validar que fin de actividades sea posterior a la fecha de ordenación
            if (finActividades <= ordenacion) {
                mostrarMensaje('error', 'La fecha de fin de actividades debe ser posterior a la fecha de ordenación.');
                return;
            }

            // Si todas las validaciones son correctas, envía el formulario
            const form = this;
            const url = form.action;
            const formData = new FormData(form);

            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarMensaje('success', 'Ministro actualizado exitosamente');
                    location.reload();
                } else {
                    mostrarMensaje('error', 'Error al registrar ministro: ' + data.message);
                }
            });
        });
    }
});

function darDeBajaMinistro(id) {
    if (confirm("¿Estás seguro de que deseas dar de baja este ministro?")) {
        fetch('/procesar_dar_baja_ministro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, estado: 0 }) // Enviamos estado como 0 (inactivo)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje('success', 'Ministro dado de baja exitosamente');
                location.reload();
            } else {
                mostrarMensaje('error', 'Error al dar de baja al ministro: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
