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

        fetch(formAction, {  // `formAction` ya se define dinámicamente para insertar o actualizar
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Mostrar mensaje de éxito para editar
                    if (formAction === urlActualizarDiocesis) {
                        Toastify({
                            text: "Diócesis actualizada exitosamente",
                            duration: 2000,
                            close: true,
                            backgroundColor: "--bs-primary", // Color verde (Bootstrap success)
                            gravity: "bottom",
                            position: "right",
                        }).showToast();
                    } else {
                        // Mostrar mensaje para insertar
                        Toastify({
                            text: "Diócesis insertada exitosamente",
                            duration: 2000,
                            close: true,
                            backgroundColor: "--bs-primary",
                            gravity: "bottom",
                            position: "right",
                        }).showToast();
                    }
                    
                    const diocesisModal = bootstrap.Modal.getInstance(document.getElementById('diocesisModal'));
                    diocesisModal.hide();

                    
                    actualizarTablaDiocesis(data.diocesis);
                } else {
                    // Mostrar mensaje de error
                    Toastify({
                        text: data.message || "No se pudo actualizar la diócesis",
                        duration: 2000,
                        close: true,
                        backgroundColor: "#dc3545", // Color rojo (Bootstrap danger)
                        gravity: "bottom",
                        position: "right",
                    }).showToast();

                    console.error('Error al procesar la diócesis: ' + data.message);
                }
                saveButton.disabled = false; // Reactivar el botón después del proceso
            })
            .catch(error => {
                console.error('Error:', error);

                Toastify({
                    text: "Hubo un problema al procesar la solicitud",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545", // Color rojo
                    gravity: "bottom",
                    position: "right",
                }).showToast();

                saveButton.disabled = false; // Reactivar el botón en caso de error
            });
    };

    document.getElementById('id_departamento').addEventListener('change', function () {
        const departamentoSeleccionado = this.value; 
        const provinciasSelect = document.getElementById('id_provincia'); 
    
        provinciasSelect.innerHTML = '<option value="">Cargando...</option>';
    
    
        fetch(`/obtener_provincias_por_departamento?departamento=${encodeURIComponent(departamentoSeleccionado)}`)
            .then(response => response.json())
            .then(data => {
    
                provinciasSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
    
    
                data.provincias.forEach(provincia => {
                    const option = document.createElement('option');
                    option.value = provincia.nombre;
                    option.textContent = provincia.nombre;
                    provinciasSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar las provincias:', error);
                provinciasSelect.innerHTML = '<option value="">Error al cargar provincias</option>';
            });
    });
    
    function actualizarTablaDiocesis(diocesis) {
        const tableBody = document.querySelector('#diocesisTable tbody');
        tableBody.innerHTML = '';

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
                    <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminarDiocesis('${dio.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
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

function eliminarDiocesis(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta diócesis?')) {
        return false; 
    }

    fetch(urlEliminarDiocesis, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id: id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mostrar mensaje de éxito
                Toastify({
                    text: "Diócesis eliminada exitosamente",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();


                const fila = document.querySelector(`tr[data-id="${id}"]`);
                if (fila) fila.remove();
                setTimeout(() => {
                    location.reload(); 
                }, 2000);
            } else {
                // Mostrar mensaje de error
                Toastify({
                    text: data.message || "No se pudo eliminar la diócesis",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545", // Rojo
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Toastify({
                text: "Error al procesar la solicitud",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        });

    return false; 
}
