$(document).ready(function () {
    // Inicializar DataTable
    $('#celebracionTable').DataTable({
        pageLength: 8,
        ajax: {
            url: '/listar_celebraciones_crud', // Ruta del backend
            dataSrc: '' // La respuesta es un array de objetos
        },
        columns: [
            { data: 'id_celebracion', title: 'ID' },
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
            { data: 'id_sede', title: 'ID Sede' },
            { data: 'id_actoliturgico', title: 'ID Acto Litúrgico' },
            {
                data: null,
                title: 'Acciones',
                render: function (data) {

                    return `
                        <button class="btn btn-primary btn-sm" title="Ver" onclick="openModal('view', ${data.id_celebracion}, \`${data.fecha}\`, \`${data.hora_inicio}\`, \`${data.hora_fin}\`, \`${data.estado}\`, \`${data.id_sede}\`, \`${data.id_actoliturgico}\`)">
                            <i class="fas fa-eye"></i>
                        </button>                       
                        <button class="btn btn-warning btn-sm" title="Editar" onclick="openModal('edit', ${data.id_celebracion}, \`${data.fecha}\`, \`${data.hora_inicio}\`, \`${data.hora_fin}\`, \`${data.estado}\`, \`${data.id_sede}\`, \`${data.id_actoliturgico}\`)">
                            <i class="fas fa-edit"></i>
                        </button>
                         <button class="btn btn-secondary btn-sm" title="Dar de Baja" onclick="darDeBajaCelebracion(${data.id_celebracion})">
                            <i class="fas fa-ban"></i>                            
                        </button>
                        <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminarCelebracion(${data.id_celebracion})">
                            <i class="fas fa-trash-alt"></i>
                        </button>`;
                }
            }
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
                    <i class="bi bi-plus-circle"></i> Agregar Celebración
                </button>
            `);
        }
    });
});

document.getElementById('celebracionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    fetch('/insertar_celebracion_crud', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                $('#celebracionTable').DataTable().ajax.reload(); // Recargar la tabla
                const modal = bootstrap.Modal.getInstance(document.getElementById('celebracionModal'));
                modal.hide(); // Cerrar el modal
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));

    fetch('/editar_celebracion_crud', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#celebracionTable').DataTable().ajax.reload(); // Recargar la tabla
                const modal = bootstrap.Modal.getInstance(document.getElementById('celebracionModal'));
                modal.hide();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
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
    } else if (type === 'edit') {
        modalTitle.innerText = 'Editar Celebración';
        form.action = '/editar_celebracion_crud';

        document.getElementById('id_celebracion').value = id;
        document.getElementById('fecha').value = fecha;
        const horaInicioFormateada = formatearHora(hora_inicio);
        const horaFinFormateada = formatearHora(hora_fin);

        console.log('Hora Inicio Formateada:', horaInicioFormateada);
        console.log('Hora Fin Formateada:', horaFinFormateada);

        document.getElementById('hora_inicio').value = horaInicioFormateada;
        document.getElementById('hora_fin').value = horaFinFormateada;
        document.getElementById('estado').value = estado;




        document.getElementById('saveChanges').style.display = 'inline-block';
    } else if (type === 'view') {
        modalTitle.innerText = 'Ver Celebración';
        document.getElementById('id_celebracion').value = id;
        document.getElementById('fecha').value = fecha;

        const horaInicioFormateada = formatearHora(hora_inicio);
        const horaFinFormateada = formatearHora(hora_fin);

        console.log('Hora Inicio Formateada:', horaInicioFormateada);
        console.log('Hora Fin Formateada:', horaFinFormateada);
        document.getElementById('hora_inicio').value = horaInicioFormateada;
        document.getElementById('hora_fin').value = horaFinFormateada;
        document.getElementById('estado').value = estado;

        Array.from(form.elements).forEach(el => {
            if (el.tagName !== 'BUTTON') { // Excluir botones
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }) // Enviar el ID como JSON
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Celebración eliminada exitosamente.');
                    $('#celebracionTable').DataTable().ajax.reload(); // Recargar la tabla
                } else {
                    alert('Error al eliminar la celebración: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
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
            body: JSON.stringify({ id: id }) // Enviar el ID como JSON
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('La celebración ha sido dada de baja correctamente.');
                $('#celebracionTable').DataTable().ajax.reload(); // Recargar la tabla
            } else {
                alert('Error al dar de baja la celebración: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
