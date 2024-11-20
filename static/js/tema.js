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
                    tema.nombre_actoliturgico,
                    tema.descripcion,                    
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
        columnDefs: [
            { targets: [0,3,4,5], className: 'text-center' }
        ],
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

    const modal = document.getElementById('temaModal');
    const inputs = modal ? modal.querySelectorAll('.form-control') : [];
    const selects = modal ? modal.querySelectorAll('select') : [];

    // Resetear campos
    inputs.forEach(input => {
        input.disabled = false; // Habilitar todos los campos por defecto
    });

    selects.forEach(select => {
        select.disabled = false; // Habilitar todos los select por defecto
    });

    saveButton.style.display = 'inline-block'; // Mostrar botón de guardar por defecto

    if (type === 'view') {
        modalTitle.textContent = 'Ver Tema';
        saveButton.style.display = 'none'; // Ocultar botón de guardar

        
        inputs.forEach(input => {
            input.disabled = true;
        });

        selects.forEach(select => {
            select.disabled = true;
        });

        cargarTema(id_tema); // Cargar datos para ver
    }else if (type === 'edit') {
        modalTitle.textContent = 'Editar Tema';
        saveButton.textContent = 'Actualizar';
        saveButton.onclick = actualizarTema; 
        temaIdInput.value = id_tema;  
        cargarTema(id_tema);  
    } else if (type === 'add') {
        modalTitle.textContent = 'Agregar Tema';
        saveButton.textContent = 'Guardar';
        saveButton.onclick = insertarTema;  
        limpiarModal(); 
    }

    let modalElement = new bootstrap.Modal(document.getElementById('temaModal'));
    modalElement.show();
}

function cargarTema(id_tema) {
    fetch(`/api/obtener_tema/${id_tema}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tema = data.tema;
                const duracionFormateada = formatearDuracion(tema.duracion);

                document.getElementById('temaId').value = tema.id_tema;
                document.getElementById('id_actoliturgico').value = tema.id_actoliturgico;
                document.getElementById('descripcion').value = tema.descripcion;                                                
                document.getElementById('duracion').value = duracionFormateada;
                document.getElementById('orden').value = tema.orden;
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al obtener el tema:', error));
}

function formatearDuracion(duracion) {
    if (!duracion) return ''; // Validar si la duración es nula o no está definida
    const [horas, minutos] = duracion.split(':'); // Dividir la duración en partes
    return `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`; // Formatear con dos dígitos
}


// Función para actualizar un tema
function actualizarTema() {
    const id_tema = document.getElementById('temaId').value;
    const id_actoliturgico = document.getElementById('id_actoliturgico').value;
    const descripcion = document.getElementById('descripcion').value;
    const duracion = document.getElementById('duracion').value;
    const orden = document.getElementById('orden').value;

    const formData = new FormData();
    formData.append('id_tema', id_tema);
    formData.append('id_actoliturgico', id_actoliturgico);
    formData.append('descripcion', descripcion);    
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
            listarTemas();  
            let modalElement = bootstrap.Modal.getInstance(document.getElementById('temaModal'));
            modalElement.hide();  
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al actualizar el tema:', error));
}

// Función para limpiar los campos del modal
function limpiarModal() {
    document.getElementById('id_actoliturgico').value = '';
    document.getElementById('descripcion').value = '';    
    document.getElementById('duracion').value = '';
    document.getElementById('orden').value = '';
}

// Función para insertar un nuevo tema
function insertarTema() {
    // Recoger los datos del formulario
    const id_actoliturgico = parseInt(document.getElementById('id_actoliturgico').value, 10);
    const descripcion = document.getElementById('descripcion').value;
    const duracion = document.getElementById('duracion').value;
    const orden = document.getElementById('orden').value;
    console.log(document.getElementById('id_actoliturgico').value);
    // Crear el objeto FormData
    const formData = new FormData();
    formData.append('id_actoliturgico', id_actoliturgico);
    formData.append('descripcion', descripcion);    
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
            listarTemas(); 
            let modalElement = bootstrap.Modal.getInstance(document.getElementById('temaModal'));
            modalElement.hide();
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
