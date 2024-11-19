document.addEventListener("DOMContentLoaded", function () {
    const table = $('#feligresesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: { search: "Buscar:" },
        initComplete: function () {            
            $("div.button-section").html(`
                <button type="button" class="btn btn-success btn-lg custom-btn ml-3" onclick="openModal('add')">
                    <i class="bi bi-person-plus"></i> Agregar feligrés
                </button>
            `);
        }
    });
});

function openModal(type, dni = '', apellidos = '', nombres = '', fecha_nacimiento = '', estado_civil = '', sexo = '', id_sede = '', correo = '') {
    let modalTitle;
    let formAction;
    let isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Feligrés';
        formAction = urlInsertarFeligres;
        limpiarModal();
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Feligrés';
        formAction = urlActualizarFeligres;
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'view') {
        modalTitle = 'Ver Feligrés';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';
    }

    // Configuración de los valores en el formulario
    document.getElementById('dni').value = dni;
    document.getElementById('apellidos').value = apellidos;
    document.getElementById('nombres').value = nombres;
    document.getElementById('fecha_nacimiento').value = fecha_nacimiento;
    document.getElementById('email').value = correo;

    // Seleccionar el valor de Estado Civil, Sexo y Sede si existe
    const estadoCivilSelect = document.getElementById('estado_civil');
    const sexoSelect = document.getElementById('sexo');
    const sedeSelect = document.getElementById('id_sede');

    if (estadoCivilSelect.querySelector(`option[value="${estado_civil}"]`)) {
        estadoCivilSelect.value = estado_civil;
    } else {
        estadoCivilSelect.selectedIndex = 0; // O seleccionar una opción predeterminada si no coincide
    }

    if (sexoSelect.querySelector(`option[value="${sexo}"]`)) {
        sexoSelect.value = sexo;
    } else {
        sexoSelect.selectedIndex = 0;
    }

    if (sedeSelect.querySelector(`option[value="${id_sede}"]`)) {
        sedeSelect.value = id_sede;
    } else {
        sedeSelect.selectedIndex = 0;
    }

    // Configuración de campos como solo lectura si está en modo "ver"
    document.querySelectorAll('#feligresForm input, #feligresForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Configuración del modal
    document.getElementById('feligresModalLabel').innerText = modalTitle;
    document.getElementById('feligresForm').action = formAction;

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
    .then(response => {
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error('Error al procesar la solicitud.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(type === 'edit' ? 'Feligrés actualizado exitosamente' : 'Feligrés agregado exitosamente');
            location.reload();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error en la respuesta del servidor:', error);
        alert('Hubo un error al procesar la solicitud. Revisa la consola para más detalles.');
    });
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
        feligres.correo,
        `<button class="btn btn-primary btn-sm" title="Ver" onclick="openModal('view', '${feligres.dni}', '${feligres.apellidos}', '${feligres.nombres}', '${feligres.fecha_nacimiento}', '${feligres.estado_civil}', '${feligres.sexo}', '${feligres.sede}','${feligres.correo}')"><i class="fas fa-eye"></i></button>
         <button class="btn btn-warning btn-sm" title="Editar" onclick="openModal('edit', '${feligres.dni}', '${feligres.apellidos}', '${feligres.nombres}', '${feligres.fecha_nacimiento}', '${feligres.estado_civil}', '${feligres.sexo}', '${feligres.sede}', '${feligres.correo}')"><i class="fas fa-edit"></i></button>
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
    document.getElementById('email').value = '';
}
