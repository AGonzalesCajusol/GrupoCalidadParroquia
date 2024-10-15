$(document).ready(function () {
    var table = $('#feligresesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-feligres" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar feligrés</button>');
        }
    });
});

function openModal(type, id = null, dni = '', apellidos = '', nombres = '', fecha_nacimiento = '', estado_civil = '', sexo = '', sede = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Feligrés';
        formAction = urlInsertarFeligres;
        isReadOnly = false;
        limpiarModal();
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Feligrés';
        formAction = urlActualizarFeligres;
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';

        document.getElementById('feligresId').value = id;
        document.getElementById('dni').value = dni;
        document.getElementById('apellidos').value = apellidos;
        document.getElementById('nombres').value = nombres;
        document.getElementById('fecha_nacimiento').value = fecha_nacimiento;
        document.getElementById('estado_civil').value = estado_civil;
        document.getElementById('sexo').value = sexo;
        document.getElementById('id_sede').value = sede;

    } else if (type === 'view') {
        modalTitle = 'Ver Feligrés';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';

        document.getElementById('feligresId').value = id;
        document.getElementById('dni').value = dni;
        document.getElementById('apellidos').value = apellidos;
        document.getElementById('nombres').value = nombres;
        document.getElementById('fecha_nacimiento').value = fecha_nacimiento;
        document.getElementById('estado_civil').value = estado_civil;
        document.getElementById('sexo').value = sexo;
        document.getElementById('id_sede').value = sede;
    }

    document.getElementById('feligresModalLabel').innerText = modalTitle;
    document.getElementById('feligresForm').action = formAction;
    document.querySelectorAll('#feligresForm input, #feligresForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    var feligresModal = new bootstrap.Modal(document.getElementById('feligresModal'));
    feligresModal.show();

    document.getElementById('feligresForm').onsubmit = function (event) {
        event.preventDefault();
        let formData = new FormData(this);

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(type === 'edit' ? 'Feligrés actualizado exitosamente' : 'Feligrés agregado exitosamente');
                    if (type === 'add') {
                        agregarFeligresATabla(data.feligres);
                        limpiarModal();
                    } else {
                        location.reload();
                    }
                } else {
                    alert('Error al procesar el feligrés');
                }
            })
            .catch(error => console.error('Error:', error));
    };
}

function limpiarModal() {
    document.getElementById('feligresId').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('fecha_nacimiento').value = '';
    document.getElementById('estado_civil').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('id_sede').value = '';
}
