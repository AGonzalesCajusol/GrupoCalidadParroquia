document.addEventListener('DOMContentLoaded', function () {
    // Inicializar DataTable
    $('#celebracionesTable').DataTable({
        pageLength: 10,
        language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No se encontraron registros",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtrado de _MAX_ registros en total)",
            paginate: {
                first: "Primera",
                last: "Última",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    cargarCelebraciones();

    // Evento para manejar el envío del formulario
    document.getElementById('celebracionForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const url = '/actualizar_celebracion';

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

// Función para cargar celebraciones desde el servidor
function cargarCelebraciones() {
    fetch('/obtener_celebraciones')
        .then(response => response.json())
        .then(data => {
            const celebracionesBody = document.getElementById('celebracionesBody');
            celebracionesBody.innerHTML = '';

            data.celebraciones.forEach(celebracion => {
                const row = `
                    <tr>
                        <td>${celebracion.id_celebracion}</td>
                        <td>${celebracion.fecha}</td>
                        <td>${celebracion.hora_inicio}</td>
                        <td>${celebracion.hora_fin}</td>
                        <td>${celebracion.estado}</td>
                        <td>${celebracion.id_sede}</td>
                        <td>${celebracion.id_actoliturgico}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="abrirModal(${celebracion.id_celebracion}, '${celebracion.estado}')">
                                Editar
                            </button>
                        </td>
                    </tr>`;
                celebracionesBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Error al cargar celebraciones:', error));
}

// Función para abrir el modal y cargar los datos
function abrirModal(id, estado) {
    document.getElementById('id_celebracion').value = id;
    document.getElementById('estado').value = estado;

    const celebracionModal = new bootstrap.Modal(document.getElementById('celebracionModal'));
    celebracionModal.show();
}
