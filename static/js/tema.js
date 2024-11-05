const diasSemana = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo'
};


function listarTemas() {
    const tbody = document.getElementById('temasTableBody');

    fetch('/api/obtener_temas')
        .then(response => response.json())
        .then(data => {            
            if (data.success) {            
                let dataTable = $('#temasTable').DataTable();
                dataTable.clear();

                const temas = data.temas.map(tema => [
                    tema.id_tema,
                    tema.descripcion,
                    tema.nombre_actoliturgico,
                    diasSemana[tema.dias_semana] || 'Desconocido', 
                    tema.hora_inicio,
                    tema.duracion,
                    tema.orden,
                    `<button class="btn btn-primary btn-sm" title="Ver" onclick="openModal('view', ${tema.id_tema})">
                        <i class="fas fa-eye"></i>
                     </button>
                     <button class="btn btn-warning btn-sm" title="Editar" onclick="openModal('edit', ${tema.id_tema})">
                        <i class="fas fa-edit"></i>
                     </button>
                     <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminarTema(${tema.id_tema})">
                        <i class="fas fa-trash-alt"></i>
                     </button>`
                ]);
                dataTable.rows.add(temas).draw();
            } else {
                alert("Error al obtener los temas: " + data.message);
            }
        })
        .catch(error => console.error('Error al obtener los temas:', error));
}

document.addEventListener("DOMContentLoaded", function() {
    $('#temasTable').DataTable({
        pageLength: 8,
        autoWidth: false,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar tema</button>');
        }
    });
    listarTemas(); // Llamar a listarTemas después de la inicialización
});

function openModal(type, id_tema) {
    const modalTitle = document.getElementById('temaModalLabel');
    const saveButton = document.getElementById('saveChanges');
    const temaIdInput = document.getElementById('temaId');

    if (type === 'edit') {
        modalTitle.textContent = 'Editar Tema';
        saveButton.textContent = 'Actualizar';
        saveButton.onclick = actualizarTema;  // Asignar la función de actualización
        temaIdInput.value = id_tema;  // Asignar el ID del tema a editar
        cargarTema(id_tema);  // Cargar los datos del tema en el modal
    } else if (type === 'add') {
        modalTitle.textContent = 'Agregar Tema';
        saveButton.textContent = 'Guardar';
        saveButton.onclick = insertarTema;  // Asignar la función de inserción
        limpiarModal();  // Limpiar los campos del formulario
    }

    let modalElement = new bootstrap.Modal(document.getElementById('temaModal'));
    modalElement.show();
}

// Función para cargar los datos de un tema en el modal
function cargarTema(id_tema) {
    fetch(`/api/obtener_tema/${id_tema}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tema = data.tema;
                document.getElementById('temaId').value = tema.id_tema;
                document.getElementById('descripcion').value = tema.descripcion;
                document.getElementById('id_actoliturgico').value = tema.id_actoliturgico;
                document.getElementById('dias_semana').value = tema.dias_semana;
                document.getElementById('hora_inicio').value = tema.hora_inicio && tema.hora_inicio !== 'None' ? tema.hora_inicio : '';
                document.getElementById('duracion').value = tema.duracion && tema.duracion !== 'None' ? tema.duracion : '';
                document.getElementById('orden').value = tema.orden;
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al obtener el tema:', error));
}

// Función para actualizar un tema
function actualizarTema() {
    const id_tema = document.getElementById('temaId').value;
    const descripcion = document.getElementById('descripcion').value;
    const id_actoliturgico = document.getElementById('id_actoliturgico').value;
    const dias_semana = document.getElementById('dias_semana').value;
    const hora_inicio = document.getElementById('hora_inicio').value;
    const duracion = document.getElementById('duracion').value;
    const orden = document.getElementById('orden').value;

    const formData = new FormData();
    formData.append('id_tema', id_tema);
    formData.append('descripcion', descripcion);
    formData.append('id_actoliturgico', id_actoliturgico);
    formData.append('dias_semana', dias_semana);
    formData.append('hora_inicio', hora_inicio);
    formData.append('duracion', duracion);
    formData.append('orden', orden);

    fetch('/actualizar_tema', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tema actualizado exitosamente');
            listarTemas();  // Actualizar la tabla con el tema editado
            let modalElement = bootstrap.Modal.getInstance(document.getElementById('temaModal'));
            modalElement.hide();  // Cerrar el modal
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al actualizar el tema:', error));
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('descripcion').value = '';
    document.getElementById('id_actoliturgico').value = '';
    document.getElementById('dias_semana').value = '1';
    document.getElementById('hora_inicio').value = '';
    document.getElementById('duracion').value = '';
    document.getElementById('orden').value = '';
}

// Función para insertar un nuevo tema
function insertarTema() {
    // Recoger los datos del formulario
    const descripcion = document.getElementById('descripcion').value;
    const id_actoliturgico = parseInt(document.getElementById('id_actoliturgico').value, 10);
    const dias_semana = document.getElementById('dias_semana').value;
    const hora_inicio = document.getElementById('hora_inicio').value;
    const duracion = document.getElementById('duracion').value;
    const orden = document.getElementById('orden').value;
    console.log(document.getElementById('id_actoliturgico').value);
    // Crear el objeto FormData
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('id_actoliturgico', id_actoliturgico);
    formData.append('dias_semana', dias_semana);
    formData.append('hora_inicio', hora_inicio);
    formData.append('duracion', duracion);
    formData.append('orden', orden);

    // Enviar los datos al backend con fetch
    fetch('/insertar_tema', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tema agregado exitosamente');
            listarTemas(); // Actualizar la tabla con el nuevo tema
            let modalElement = bootstrap.Modal.getInstance(document.getElementById('temaModal'));
            modalElement.hide(); // Cerrar el modal
        } else {
            alert('Error al agregar el tema: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de insertarTema:', error);
        alert('Ocurrió un error al intentar agregar el tema');
    });
    
}

function eliminarTema(id_tema) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este tema?");
    if (!confirmar) return; 

    const formData = new FormData();
    formData.append('id_tema', id_tema);

    fetch('/eliminar_tema', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {            
            listarTemas(); 
        } else {
            alert(data.message); 
        }
    })
    .catch(error => console.error('Error en la solicitud de eliminarTema:', error));
}
