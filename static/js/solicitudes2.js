document.addEventListener('show.bs.tab', function (event) {
    if (event.target.id === 'requisitos-tab') {
        listar_solicitudes();
    }
});

function verificar() {
    const acto_liturgico = document.getElementById('acto_seleccionado').value;

    if (acto_liturgico === "") {
        Toastify({
            text: "Selecciona un acto litúrgico",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    }
}

function listar_solicitudes() {
    fetch('/listar_solicitudes')
        .then(response => response.json())
        .then(data => {
            if ($.fn.DataTable.isDataTable('#soli_tab')) {
                $('#soli_tab').DataTable().clear().destroy();
            }

            $('#soli_tab').DataTable({
                data: data && data.data ? data.data.map(solicitud => [
                    solicitud.id_solicitud,       // Columna 0
                    solicitud.fecha,             // Columna 1
                    solicitud.nombre_sede,       // Columna 2
                    solicitud.nombre_liturgia,   // Columna 3
                    solicitud.nombres,           // Columna 4
                    solicitud.estado,            // Columna 5
                    `
                    <button class="btn btn-primary btn-sm" onclick="rellenar_formulario(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                        <i class="bi bi-check2-circle"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="asistencias(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                        <i class="bi bi-calendar3"></i>
                    </button>
                    `
                ]) : [],
                pageLength: 8,
                dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex button-section">>rt<"bottom"p>',
                columnDefs: [
                    { targets: [6], orderable: false, className: 'text-center' } // Opciones no ordenables
                ],
                language: {
                    search: "",
                    emptyTable: "No se encontraron solicitudes",
                },
                initComplete: function () {
                    $('#filtroLiturgia').on('change', function () {
                        const liturgia = this.value.trim();
                        const table = $('#soli_tab').DataTable();
                        table.column(3).search(liturgia, false, false).draw(); // Filtro por Acto
                    });

                    $('#filtroEstado').on('change', function () {
                        const estado = this.value.trim();
                        const table = $('#soli_tab').DataTable();
                        table.column(5).search(estado, false, false).draw(); // Filtro por Estado
                    });

                    $('#buscar').on('keyup', function () {
                        const value = this.value.trim();
                        const table = $('#soli_tab').DataTable();
                        table.search(value).draw(); // Filtro general
                    });
                }
            });
        })
        .catch(error => console.error('Error al obtener solicitudes:', error));
}
