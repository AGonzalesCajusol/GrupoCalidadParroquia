$('#ministrosTable').DataTable({
    pageLength: 8,
    dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
    language: {
        search: "Buscar:"
    },
    initComplete: function() {
        $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar ministro</button>');
    }
});



// Función para abrir el modal para agregar, ver o editar un ministro
function openModal(type, id = null, nombre = '', nacimiento = '', ordenacion = '', actividades = '', tipo = '', sede = '', cargo = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Ministro';
        formAction = urlInsertarMinistro;  // URL global para insertar ministro
        isReadOnly = false;
        limpiarModal();  // Limpiar campos al abrir el modal para agregar
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Ministro';
        formAction = urlActualizarMinistro;  // URL global para actualizar ministro
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';

        // Asignar valores al modal
        document.getElementById('ministroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('nacimiento').value = nacimiento;
        document.getElementById('ordenacion').value = ordenacion;
        document.getElementById('actividades').value = actividades;
        document.getElementById('id_tipoministro').value = tipo;
        document.getElementById('id_sede').value = sede;
        document.getElementById('id_cargo').value = cargo;

        
    
    } else if (type === 'view') {
        modalTitle = 'Ver Ministro';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';  // Oculta el botón "Guardar" en el modo de visualización

        // Asignar valores al modal
        document.getElementById('ministroId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('nacimiento').value = nacimiento;
        document.getElementById('ordenacion').value = ordenacion;
        document.getElementById('actividades').value = actividades;
        document.getElementById('id_tipoministro').value = tipo;
        document.getElementById('id_sede').value = sede;
        document.getElementById('id_cargo').value = cargo;
    }

    // Configuración del modal
    document.getElementById('ministroModalLabel').innerText = modalTitle;
    document.getElementById('ministroForm').action = formAction;

    // Hacer los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#ministroForm input, #ministroForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Inicializar y mostrar el modal
    var ministroModal = new bootstrap.Modal(document.getElementById('ministroModal'));
    ministroModal.show();

    // Manejo del envío del formulario
    document.getElementById('ministroForm').onsubmit = function(event) {
        event.preventDefault();  // Prevenir el envío del formulario tradicional

        let formData = new FormData(this);  // Recoger los datos del formulario

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(type === 'edit' ? 'Ministro actualizado exitosamente' : 'Ministro agregado exitosamente');
                if (type === 'add') {
                    // Agregar el nuevo ministro a la tabla
                    agregarMinistroATabla(data.ministro);  // Se asume que el servidor devuelve el nuevo ministro agregado
                    limpiarModal();  // Limpiar los campos del modal para una nueva inserción
                } else {
                    location.reload();  // Recargar la página para reflejar los cambios si se está editando
                }
            } else {
                alert('Error al procesar el ministro');
            }
        })
        .catch(error => console.error('Error:', error));
    };
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('ministroId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('nacimiento').value = '';
    document.getElementById('ordenacion').value = '';
    document.getElementById('actividades').value = '';
    document.getElementById('id_tipoministro').value = '';
    document.getElementById('id_sede').value = '';
    document.getElementById('id_cargo').value = '';
}
