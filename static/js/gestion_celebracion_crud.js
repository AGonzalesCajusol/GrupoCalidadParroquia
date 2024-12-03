$(document).ready(function () {
    
    $('#celebracionTable').DataTable({
        pageLength: 8,
        ajax: {
            url: '/listar_celebraciones_crud', 
            dataSrc: '' 
        },
        columns: [
            { data: 'id_celebracion', title: 'ID' },
            { data: 'nombre_actoliturgico', title: 'Acto Litúrgico', "className": "text-center" },
            { data: 'nombre_sede', title: 'Sede', "className": "text-center"  },
            { data: 'fecha', title: 'Fecha' },
            { data: 'hora_inicio', title: 'Hora Inicio' },
            { data: 'hora_fin', title: 'Hora Fin' },
            {
                data: 'estado',
                title: 'Estado',
                render: function (data) {
                    switch (data) {
                        case 'A':
                            return 'Agendado';
                        case 'C':
                            return 'Celebrado';
                        case 'P':
                            return 'Programado';
                        case 'I':
                            return 'Inactivo';
                        case 'R':
                                return 'Realizado';    
                        default:
                            return 'Desconocido';  
                    }
                }
                
            },
            {
                data: null,
                title: 'Acciones',
                render: function (data) {
                    const botonDarDeBaja = data.estado === 'I' // Compara el estado
                        ? `<button class="btn btn-secondary btn-sm" title="Dar de Baja" disabled>
                               <i class="fas fa-ban"></i>
                           </button>`
                        : `<button class="btn btn-secondary btn-sm" title="Dar de Baja" 
                               onclick="darDeBajaCelebracion(${data.id_celebracion})">
                               <i class="fas fa-ban"></i>
                           </button>`;
            
                    return `
                        <button class="btn btn-primary btn-sm" title="Ver" 
                            onclick="openModal('view', ${data.id_celebracion}, '${data.fecha}', '${data.hora_inicio}', '${data.hora_fin}', '${data.estado}', '${data.id_sede}', '${data.id_actoliturgico}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" title="Editar" 
                            onclick="openModal('edit', ${data.id_celebracion}, '${data.fecha}', '${data.hora_inicio}', '${data.hora_fin}', '${data.estado}', '${data.id_sede}', '${data.id_actoliturgico}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${botonDarDeBaja}
                        <button class="btn btn-danger btn-sm" title="Eliminar" 
                            onclick="eliminarCelebracion(${data.id_celebracion})">
                            <i class="fas fa-trash-alt"></i>
                        </button>`;
                }
            }
            
        ],
        columnDefs: [
            { targets: [0, 1, 2, 3, 4], className: 'text-center' },  // Alineación centrada
            { targets: [5, 6], className: 'text-start' }
        ],
        language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ entradas",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            emptyTable: "No hay datos disponibles en la tabla",

        },
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        initComplete: function () {
            // Insertar el botón "Agregar Celebración"
            $("div.button-section").html(`
                <button type="button" class="btn btn-success btn-lg custom-btn ml-3" onclick="openModal('add')">
                    <i class="bi bi-plus-circle"></i> Agregar celebración
                </button>
            `);
        }
    });
});

document.getElementById('celebracionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const isEditing = !!formData.get('id_celebracion'); // Verificar si el formulario incluye un ID para saber si es edición

    const url = isEditing ? '/editar_celebracion_crud' : '/insertar_celebracion_crud'; // Cambiar la URL según la operación

    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Toastify({
                    text: isEditing 
                        ? "¡Se actualizó la celebración correctamente!" 
                        : "¡Se guardó la celebración correctamente!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#28a745", // Verde para éxito
                    gravity: "bottom",
                    position: "right",
                }).showToast();

                $('#celebracionTable').DataTable().ajax.reload(); // Recargar la tabla
                const modal = bootstrap.Modal.getInstance(document.getElementById('celebracionModal'));
                modal.hide(); // Cerrar el modal
            } else {
                Toastify({
                    text: isEditing 
                        ? "No se pudo actualizar la celebración. Inténtelo de nuevo." 
                        : "No se pudo guardar la celebración. Inténtelo de nuevo.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545", // Rojo para error
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        })
        .catch(error => {
            Toastify({
                text: "Hubo un error al procesar la solicitud.",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
            console.error('Error:', error);
        });
});


function openModal(type, id = null, fecha = '', hora_inicio = '', hora_fin = '', estado = 'A', id_sede = '', id_actoliturgico = '') {
    const modal = new bootstrap.Modal(document.getElementById('celebracionModal'));
    const modalTitle = document.getElementById('celebracionModalLabel');
    const form = document.getElementById('celebracionForm');

    form.reset();
    Array.from(form.elements).forEach(el => {
        el.readOnly = false;
        el.disabled = false;
    });
    form.action = '';

    if (type === 'add') {
        modalTitle.innerText = 'Agregar Celebración';
        form.action = '/insertar_celebracion_crud';
        document.getElementById('estado').value = 'A';
        document.getElementById('saveChanges').style.display = 'inline-block';
        configurarFechaMinima();

    } else if (type === 'edit') {
        modalTitle.innerText = 'Editar Celebración';
        form.action = '/editar_celebracion_crud';

        document.getElementById('id_celebracion').value = id;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora_inicio').value = formatearHora(hora_inicio);
        document.getElementById('hora_fin').value = formatearHora(hora_fin);
        document.getElementById('estado').value = estado;

        // Configura el valor del select de sede
        const selectSede = document.getElementById('id_sede');
        if (selectSede.querySelector(`option[value="${id_sede}"]`)) {
            selectSede.value = id_sede;
        } else {
            console.error('ID de sede no encontrado en el select:', id_sede);
        }

        // Configura el valor del select de acto litúrgico
        const selectActo = document.getElementById('id_actoliturgico');
        if (selectActo.querySelector(`option[value="${id_actoliturgico}"]`)) {
            selectActo.value = id_actoliturgico;
        } else {
            console.error('ID de acto litúrgico no encontrado en el select:', id_actoliturgico);
        }

        document.getElementById('saveChanges').style.display = 'inline-block';

        configurarFechaMinima();

    } else if (type === 'view') {
        modalTitle.innerText = 'Ver Celebración';
        document.getElementById('id_celebracion').value = id;
        document.getElementById('fecha').value = fecha;
        document.getElementById('hora_inicio').value = formatearHora(hora_inicio);
        document.getElementById('hora_fin').value = formatearHora(hora_fin);
        document.getElementById('estado').value = estado;

        // Configura los selects como solo lectura
        const selectSede = document.getElementById('id_sede');
        if (selectSede.querySelector(`option[value="${id_sede}"]`)) {
            selectSede.value = id_sede;
        } else {
            console.error('ID de sede no encontrado en el select:', id_sede);
        }
        selectSede.disabled = true;

        const selectActo = document.getElementById('id_actoliturgico');
        if (selectActo.querySelector(`option[value="${id_actoliturgico}"]`)) {
            selectActo.value = id_actoliturgico;
        } else {
            console.error('ID de acto litúrgico no encontrado en el select:', id_actoliturgico);
        }
        selectActo.disabled = true;

        Array.from(form.elements).forEach(el => {
            if (el.tagName !== 'BUTTON') {
                el.readOnly = true;
                el.disabled = true;
            }
        });

        document.getElementById('saveChanges').style.display = 'none';
    }

    modal.show();
}


function eliminarCelebracion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta celebración?')) {
        fetch('/eliminar_celebracion_crud', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            Toastify({
                text: data.message,
                duration: 2000,
                close: true,
                backgroundColor: data.success ? "--bs-primary": "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();

            if (data.success) {
                $('#celebracionTable').DataTable().ajax.reload(); // Recargar la tabla
            }
        })
        .catch(error => {
            Toastify({
                text: "Hubo un error al procesar la solicitud.",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
            console.error('Error:', error);
        });
    }
}


function formatearHora(hora) {
    if (!hora) return '00:00';
    const partes = hora.split(':');
    const horas = partes[0].padStart(2, '0');
    const minutos = partes[1];
    return `${horas}:${minutos}`;
}


function darDeBajaCelebracion(id) {
    if (confirm('¿Estás seguro de que deseas dar de baja esta celebración?')) {
        fetch('/dar_de_baja_celebracion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }) 
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Toastify({
                    text: "¡La celebración se dio de baja correctamente!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();

                $('#celebracionTable').DataTable().ajax.reload(); 
            } else {
                Toastify({
                    text: "No se pudo dar de baja la celebración.",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        })
        .catch(error => {
            Toastify({
                text: "Hubo un error al procesar la solicitud.",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
            console.error('Error:', error);
        });
    }
}



function configurarFechaMinima() {
    const fechaInput = document.getElementById("fecha");
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const anio = hoy.getFullYear();

    fechaInput.min = `${anio}-${mes}-${dia}`; // Establecer el mínimo al día de hoy
}

function validarHora(campoId) {
    const horaInput = document.getElementById(campoId);
    const horaSeleccionada = horaInput.value;
    
    const horaMinima = "07:00";
    const horaMaxima = "20:00";

    if (horaSeleccionada < horaMinima || horaSeleccionada > horaMaxima) {        
        Toastify({
            text: "La hora debe estar entre 7:00 AM y 8:00 PM.",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
        horaInput.value = "";
    }
}
