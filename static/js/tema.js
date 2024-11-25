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
    listarTemas(); 
});

function openModal(type, id_tema) {
    const modalTitle = document.getElementById('temaModalLabel');
    const saveButton = document.getElementById('saveChanges');
    const temaIdInput = document.getElementById('temaId');

    const modal = document.getElementById('temaModal');
    const inputs = modal ? modal.querySelectorAll('.form-control') : [];
    const selects = modal ? modal.querySelectorAll('select') : [];

    inputs.forEach(input => {
        input.disabled = false; 
    });

    selects.forEach(select => {
        select.disabled = false;
    });

    saveButton.style.display = 'inline-block'; 

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
    if (!duracion) return '';
    const [horas, minutos] = duracion.split(':'); 
    return `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`; 
}

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
            // Notificación de éxito
            Toastify({
                text: "¡El tema fue actualizado exitosamente!",
                duration: 2000,
                close: true,
                backgroundColor: "--bs-primary",
                gravity: "bottom",
                position: "right",
            }).showToast();

            listarTemas();  
            let modalElement = bootstrap.Modal.getInstance(document.getElementById('temaModal'));
            modalElement.hide();  
        } else {
            // Notificación de error
            Toastify({
                text: "No se pudo actualizar el tema: " + data.message,
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    })
    .catch(error => {
        console.error('Error al actualizar el tema:', error);
        // Notificación de error en solicitud
        Toastify({
            text: "No se pudo extraer los datos de la solicitud!!",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    });
}


function limpiarModal() {
    document.getElementById('id_actoliturgico').value = '';
    document.getElementById('descripcion').value = '';    
    document.getElementById('duracion').value = '';
    document.getElementById('orden').value = '';
}

function insertarTema() {
    const id_actoliturgico = parseInt(document.getElementById('id_actoliturgico').value, 10);
    const descripcion = document.getElementById('descripcion').value;
    const duracion = document.getElementById('duracion').value;
    const orden = document.getElementById('orden').value;

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
            // Notificación de éxito
            Toastify({
                text: "¡El tema fue agregado exitosamente!",
                duration: 2000,
                close: true,
                backgroundColor: "--bs-primary",
                gravity: "bottom",
                position: "right",
            }).showToast();

            listarTemas(); 
            let modalElement = bootstrap.Modal.getInstance(document.getElementById('temaModal'));
            modalElement.hide();
        } else {
            // Notificación de error
            Toastify({
                text: "No se pudo agregar el tema: " + data.message,
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de insertarTema:', error);
        // Notificación de error en solicitud
        Toastify({
            text: "No se pudo extraer los datos de la solicitud!!",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    });
}

function eliminarTema(id_tema) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este tema?");
    if (!confirmar) return; // Si el usuario cancela, no se ejecuta nada.

    const formData = new FormData();
    formData.append('id_tema', id_tema);

    // Realizar la solicitud al servidor
    fetch('/eliminar_tema', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Notificación de éxito
            Toastify({
                text: data.message || "Tema eliminado correctamente",
                duration: 2000,
                close: true,
                backgroundColor: "--bs-primary",
                gravity: "bottom",
                position: "right",
            }).showToast();

            listarTemas(); // Actualizar la lista de temas
        } else {
            // Notificación de error controlado
            Toastify({
                text: data.message || "No se pudo eliminar el tema",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de eliminarTema:', error);
        // Notificación de error inesperado
        Toastify({
            text: "No se pudo extraer los datos de la solicitud!!",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    });
}

function validarHora(campoId) {
    const horaInput = document.getElementById(campoId);
    const horaSeleccionada = horaInput.value;
    
    const horaMinima = "01:00";
    const horaMaxima = "03:00";

    if (horaSeleccionada < horaMinima || horaSeleccionada > horaMaxima) {        
        Toastify({
            text: "La duracion debe estar entre 1:00 y 3:00 H",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
        horaInput.value = "";
    }
}
