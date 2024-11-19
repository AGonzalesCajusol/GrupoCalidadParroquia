$(document).ready(function () {
    var table = $('#diocesisTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar diócesis</button>');
        }
    });
});

function openModal(type, id = null, nombre = '', departamento = '', provincia = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Diócesis';
        formAction = urlInsertarDiocesis;
        isReadOnly = false;
        limpiarModal();
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Diócesis';
        formAction = urlActualizarDiocesis;
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';
        document.getElementById('diocesisId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('id_departamento').value = departamento;
        document.getElementById('id_provincia').value = provincia;
    } else if (type === 'view') {
        modalTitle = 'Ver Diócesis';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';
        document.getElementById('diocesisId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('id_departamento').value = departamento;
        document.getElementById('id_provincia').value = provincia;
    }

    document.getElementById('diocesisModalLabel').innerText = modalTitle;
    document.getElementById('diocesisForm').action = formAction;
    document.querySelectorAll('#diocesisForm input, #diocesisForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    var diocesisModal = new bootstrap.Modal(document.getElementById('diocesisModal'));
    diocesisModal.show();

    document.getElementById('diocesisForm').onsubmit = function (event) {
        event.preventDefault();
    
        const saveButton = document.getElementById('saveChanges');
        saveButton.disabled = true; // Deshabilita el botón después del primer clic
    
        let formData = new FormData(this);
    
        fetch(formAction, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cerrar el modal sin mostrar alerta
                const diocesisModal = bootstrap.Modal.getInstance(document.getElementById('diocesisModal'));
                diocesisModal.hide();
    
                // Actualizar la tabla con la nueva lista de diócesis
                actualizarTablaDiocesis(data.diocesis);
    
                // Reactivar el botón para futuras acciones
                saveButton.disabled = false;
            } else {
                // Mostrar el mensaje de error en caso de fallo y reactivar el botón
                console.error('Error al procesar la diócesis: ' + data.message);
                saveButton.disabled = false; // Reactivar el botón si hay un error en la respuesta
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al procesar la solicitud.');
            saveButton.disabled = false; // Reactivar el botón en caso de error
        });
    };
    
    function actualizarTablaDiocesis(diocesis) {
        // Obtener el cuerpo de la tabla
        const tableBody = document.querySelector('#diocesisTable tbody');
        tableBody.innerHTML = ''; // Limpiar el contenido actual de la tabla
    
        // Recorrer las diócesis y agregarlas a la tabla
        diocesis.forEach(dio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${dio.id}</td>
                <td>${dio.nombre}</td>
                <td>${dio.departamento}</td>
                <td>${dio.provincia}</td>
                <td class="text-center">
                    <button class="btn btn-primary btn-sm" title="Ver"
                        onclick="openModal('view', '${dio.id}', '${dio.nombre}', '${dio.departamento}', '${dio.provincia}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Editar"
                        onclick="openModal('edit', '${dio.id}', '${dio.nombre}', '${dio.departamento}', '${dio.provincia}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <form action="${urlEliminarDiocesis}" method="POST" style="display:inline-block;">
                        <input type="hidden" name="id" value="${dio.id}">
                        <button type="submit" class="btn btn-danger btn-sm" title="Eliminar"
                            onclick="return confirm('¿Estás seguro de que deseas eliminar esta diócesis?');">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </form>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}     

function limpiarModal() {
    document.getElementById('diocesisId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('id_departamento').value = '';
    document.getElementById('id_provincia').value = '';
}
