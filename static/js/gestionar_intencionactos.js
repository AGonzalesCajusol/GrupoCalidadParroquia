document.addEventListener('DOMContentLoaded', function () {
    var table = $('#intencionTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-intencion" onclick="abrirModalIntencion(\'agregar\')"><i class="bi bi-plus-circle"></i> Agregar Intención </button>');
        }
    });
});

// Función para cargar los actos litúrgicos en el combo box
function cargarActosLiturgicos(selectElement, idActo = '') {
    fetch('/api/actos_liturgicos')
        .then(response => response.json())
        .then(data => {
            // Limpiar el combo box antes de llenarlo
            selectElement.innerHTML = '';

            // Agregar una opción por defecto
            selectElement.innerHTML = '<option value="">Seleccione un Acto Litúrgico</option>';

            // Agregar las opciones de los actos litúrgicos
            data.forEach(acto => {
                const option = document.createElement('option');
                option.value = acto.id;
                option.textContent = acto.nombre; // Mostrar el nombre del acto litúrgico
                if (acto.id == idActo) { // Selecciona el acto correcto
                    option.selected = true;
                }
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar los actos litúrgicos:", error);
            selectElement.innerHTML = '<option value="">Error al cargar</option>';
        });
}


function abrirModalIntencion(accion, id = '', nombre = '', descripcion = '', idActo = '') {
    const modalIntencion = new bootstrap.Modal(document.getElementById('modalIntencion'));
    const modalTitle = document.getElementById('modalIntencionLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formIntencion = document.getElementById('formIntencion');
    const selectActoLiturgico = document.getElementById('id_actoliturgico');

    // Cargar los actos litúrgicos en el combo box y seleccionar el valor correspondiente
    cargarActosLiturgicos(selectActoLiturgico, idActo);

    // Configurar el modal en función de la acción
    if (accion === 'agregar') {
        modalTitle.textContent = 'Agregar Intención';
        submitBtn.textContent = 'Guardar';
        submitBtn.style.display = 'block';
        formIntencion.setAttribute('action', insertarIntencionURL);

        document.getElementById('intencionId').value = '';
        document.getElementById('nombre_intencion').value = '';
        document.getElementById('descripcion').value = '';
        selectActoLiturgico.value = '';

        document.getElementById('nombre_intencion').removeAttribute('disabled');
        document.getElementById('descripcion').removeAttribute('disabled');
        selectActoLiturgico.removeAttribute('disabled');

    } else if (accion === 'ver') {
        modalTitle.textContent = 'Ver Intención';
        submitBtn.style.display = 'none';
        formIntencion.setAttribute('action', '');

        document.getElementById('intencionId').value = id;
        document.getElementById('nombre_intencion').value = nombre;
        document.getElementById('descripcion').value = descripcion;
        selectActoLiturgico.value = idActo;

        document.getElementById('nombre_intencion').setAttribute('disabled', true);
        document.getElementById('descripcion').setAttribute('disabled', true);
        selectActoLiturgico.setAttribute('disabled', true);

    } else if (accion === 'editar') {
        modalTitle.textContent = 'Editar Intención';
        submitBtn.textContent = 'Guardar cambios';
        submitBtn.style.display = 'block';
        formIntencion.setAttribute('action', actualizarIntencionURL);

        document.getElementById('intencionId').value = id;
        document.getElementById('nombre_intencion').value = nombre;
        document.getElementById('descripcion').value = descripcion;
        selectActoLiturgico.value = idActo;

        document.getElementById('nombre_intencion').removeAttribute('disabled');
        document.getElementById('descripcion').removeAttribute('disabled');
        selectActoLiturgico.removeAttribute('disabled');
    }

    modalIntencion.show();
}

document.getElementById('formIntencion').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
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
            actualizarTabla(data.intenciones);
            mostrarMensaje(data.message, "success");
            const modalIntencion = bootstrap.Modal.getInstance(document.getElementById('modalIntencion'));
            if (modalIntencion) modalIntencion.hide();
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
