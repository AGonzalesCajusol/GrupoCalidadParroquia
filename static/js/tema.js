$(document).ready(function () {
    var table = $('#temasTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-tema" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-plus-square"></i> Agregar Tema</button>');
        }
    });
});

function openModal(type, id = null, descripcion = '', actoLiturgico = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Tema';
        formAction = urlInsertarTema;
        isReadOnly = false;
        limpiarModal();
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Tema';
        formAction = urlActualizarTema;
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';

        document.getElementById('temaId').value = id;
        document.getElementById('descripcion').value = descripcion;
        document.getElementById('id_actoliturgico').value = actoLiturgico;

    } else if (type === 'view') {
        modalTitle = 'Ver Tema';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';

        document.getElementById('temaId').value = id;
        document.getElementById('descripcion').value = descripcion;
        document.getElementById('id_actoliturgico').value = actoLiturgico;
    }

    document.getElementById('temaModalLabel').innerText = modalTitle;
    document.getElementById('temaForm').action = formAction;
    document.querySelectorAll('#temaForm input, #temaForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    var temaModal = new bootstrap.Modal(document.getElementById('temaModal'));
    temaModal.show();

    document.getElementById('temaForm').onsubmit = function (event) {
        event.preventDefault();
        let formData = new FormData(this);

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(type === 'edit' ? 'Tema actualizado exitosamente' : 'Tema agregado exitosamente');
                    if (type === 'add') {
                        agregarTemaATabla(data.tema);
                        limpiarModal();
                    } else {
                        location.reload();
                    }
                } else {
                    alert('Error al procesar el tema');
                }
            })
            .catch(error => console.error('Error:', error));
    };
}

function limpiarModal() {
    document.getElementById('temaId').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('id_actoliturgico').value = '';
}
