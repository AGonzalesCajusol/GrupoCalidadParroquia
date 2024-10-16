$(document).ready(function () {
    var table = $('#diocesisTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar diocesis</button>');
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
        let formData = new FormData(this);

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(type === 'edit' ? 'Diócesis actualizada exitosamente' : 'Diócesis agregada exitosamente');
                    if (type === 'add') {
                        agregarDiocesisATabla(data.diocesis);
                        limpiarModal();
                    } else {
                        location.reload();
                    }
                } else {
                    alert('Error al procesar la diócesis');
                }
            })
            .catch(error => console.error('Error:', error));
    };
}

function limpiarModal() {
    document.getElementById('diocesisId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('id_departamento').value = '';
    document.getElementById('id_provincia').value = '';
}
