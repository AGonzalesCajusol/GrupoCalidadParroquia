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
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar ministro';
        formAction = '/insertar_ministro';
        limpiarModal();
        document.getElementById('passwordSection').style.display = 'block';
        document.getElementById('confirmPasswordSection').style.display = 'block';
        document.getElementById('password').required = true;
        document.getElementById('confirmPassword').required = true;
        document.getElementById('estado').checked = true;
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
        document.getElementById('estado').checked = (estado === 'Activo');
        document.getElementById('passwordSection').style.display = 'none';
        document.getElementById('confirmPasswordSection').style.display = 'none';
        document.getElementById('password').required = false;
        document.getElementById('confirmPassword').required = false;
    } else if (type === 'view') {
        modalTitle = 'Ver ministro';
        formAction = '';
        isReadOnly = true;
        document.getElementById('ministroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('documento').value = documento;
        document.getElementById('nacimiento').value = nacimiento;
        document.getElementById('ordenacion').value = ordenacion;
        document.getElementById('actividades').value = actividades;
        document.getElementById('id_tipoministro').value = tipo;
        document.getElementById('id_sede').value = sede;
        document.getElementById('id_cargo').value = cargo;
        document.getElementById('estado').checked = (estado === 'Activo');
        document.getElementById('passwordSection').style.display = 'none';
        document.getElementById('confirmPasswordSection').style.display = 'none';
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
                mostrarMensaje('success', 'Ministro eliminado exitosamente');
                location.reload();
            } else {
                mostrarMensaje('error', 'Error al eliminar el ministro: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function darDeBajaMinistro(id) {
    if (confirm("¿Estás seguro de que deseas dar de baja este ministro?")) {
        fetch('/procesar_dar_baja_ministro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, estado: 0 })
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
            event.preventDefault();

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
