document.addEventListener("DOMContentLoaded", function () {
    const table = $('#feligresesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: { search: "Buscar:" },
        initComplete: function () {            
            $("div.button-section").html(`
                <button type="button" class="btn btn-success btn-lg custom-btn ml-3" onclick="openModal('add')">
                    <i class="bi bi-person-plus"></i> Agregar Feligrés
                </button>
            `);
        }
    });
});

function openModal(type, dni = '', apellidos = '', nombres = '', fecha_nacimiento = '', estado_civil = '', sexo = '', id_sede = '') {
    let modalTitle;
    let formAction;
    let isReadOnly = false;

    // Configuración del modal según el tipo de acción
    if (type === 'add') {
        modalTitle = 'Agregar Feligrés';
        formAction = urlInsertarFeligres;
        limpiarModal();
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Feligrés';
        formAction = urlActualizarFeligres;
        document.getElementById('dni').value = dni;
        document.getElementById('apellidos').value = apellidos;
        document.getElementById('nombres').value = nombres;
        document.getElementById('fecha_nacimiento').value = fecha_nacimiento;
        document.getElementById('estado_civil').value = estado_civil;
        document.getElementById('sexo').value = sexo;
        document.getElementById('id_sede').value = id_sede;
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'view') {
        modalTitle = 'Ver Feligrés';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';
        document.getElementById('dni').value = dni;
        document.getElementById('apellidos').value = apellidos;
        document.getElementById('nombres').value = nombres;
        document.getElementById('fecha_nacimiento').value = fecha_nacimiento;
        document.getElementById('estado_civil').value = estado_civil;
        document.getElementById('sexo').value = sexo;
        document.getElementById('id_sede').value = id_sede;
    }

    // Configuración del modal
    document.getElementById('feligresModalLabel').innerText = modalTitle;
    document.getElementById('feligresForm').action = formAction;
    document.querySelectorAll('#feligresForm input, #feligresForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Mostrar el modal
    const feligresModal = new bootstrap.Modal(document.getElementById('feligresModal'));
    feligresModal.show();

    // Configuración del envío del formulario
    document.getElementById('feligresForm').onsubmit = function (event) {
        event.preventDefault();
        enviarFormulario(formAction, type);
    };
}

function enviarFormulario(url, type) {
    const formData = new FormData(document.getElementById('feligresForm'));

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(type === 'edit' ? 'Feligrés actualizado exitosamente' : 'Feligrés agregado exitosamente');
            if (type === 'add') {
                agregarFeligresATabla(data.feligres); // Solo llama a agregarFeligresATabla si data.feligres está definido
                limpiarModal();
            } else {
                location.reload();
            }
        } else {
            alert(data.message); // Mostrar el mensaje de error si el DNI ya existe
        }
    })
    .catch(error => console.error('Error:', error));
}

function agregarFeligresATabla(feligres) {
    if (!feligres || !feligres.dni) {
        console.error("El objeto feligres no está definido correctamente:", feligres);
        return;
    }

    const table = $('#feligresesTable').DataTable();
    table.row.add([
        feligres.dni,
        feligres.apellidos,
        feligres.nombres,
        feligres.fecha_nacimiento,
        feligres.estado_civil,
        feligres.sexo,
        feligres.sede,
        `<button class="btn btn-primary btn-sm" title="Ver" onclick="openModal('view', '${feligres.dni}', '${feligres.apellidos}', '${feligres.nombres}', '${feligres.fecha_nacimiento}', '${feligres.estado_civil}', '${feligres.sexo}', '${feligres.sede}')"><i class="fas fa-eye"></i></button>
         <button class="btn btn-warning btn-sm" title="Editar" onclick="openModal('edit', '${feligres.dni}', '${feligres.apellidos}', '${feligres.nombres}', '${feligres.fecha_nacimiento}', '${feligres.estado_civil}', '${feligres.sexo}', '${feligres.sede}')"><i class="fas fa-edit"></i></button>
         <form action="${urlEliminarFeligres}" method="POST" style="display:inline-block;">
            <input type="hidden" name="dni" value="${feligres.dni}">
            <button type="submit" class="btn btn-danger btn-sm" title="Eliminar" onclick="return confirm('¿Estás seguro de que deseas eliminar este feligrés?');"><i class="fas fa-trash-alt"></i></button>
         </form>`
    ]).draw();
}


function limpiarModal() {
    document.getElementById('dni').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('fecha_nacimiento').value = '';
    document.getElementById('estado_civil').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('id_sede').value = '';
}
