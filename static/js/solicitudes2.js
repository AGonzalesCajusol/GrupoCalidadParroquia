document.addEventListener('show.bs.tab', function (event){
    if(event.target.id == 'requisitos-tab'){
        listar_solicitudes();
    }
})




function verificar(){
    var acto_liturgico = document.getElementById('acto_seleccionado').value;

    if (acto_liturgico == ""){
        Toastify({
            text: "Selecciona un acto litúrgico",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    }else{

    }
}

function listar_solicitudes() {

    fetch('/listar_solicitudes')
        .then(response => response.json()) // Parseamos la respuesta como JSON
        .then(data => {
            const tbody = document.getElementById('solicitud');
            tbody.innerHTML = '';
            if ($.fn.dataTable.isDataTable('#soli_tab')) {
                const dataTable = $('#soli_tab').DataTable();
                dataTable.clear();
                if (data && data.data && data.data.length > 0) {
                    const rows = data.data.map(solicitud => [
                        solicitud.id_solicitud,
                        solicitud.fecha,
                        solicitud.nombre_sede,
                        solicitud.nombre_liturgia,
                        solicitud.nombres,
                        `
                        <button class="btn btn-primary btn-sm" onclick="rellenar_formulario(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                            <i class="bi bi-check2-circle"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="asistencias(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                            <i class="bi bi-calendar3"></i>
                        </button>
                        `
                    ]);
                    dataTable.rows.add(rows).draw();
                } else {
                    // Si no hay datos, mostramos un mensaje
                    dataTable.draw();
                }
            } else {
                // Inicializamos el DataTable si no está inicializado
                $('#soli_tab').DataTable({
                    data: data && data.data ? data.data.map(solicitud => [
                        solicitud.id_solicitud,
                        solicitud.fecha,
                        solicitud.nombre_sede,
                        solicitud.nombre_liturgia,
                        solicitud.nombres,
                        `
                        <button class="btn btn-primary btn-sm" onclick="rellenar_formulario(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                            <i class="bi bi-check2-circle"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="asistencias(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                            <i class="bi bi-calendar3"></i>
                        </button>
                        `
                    ]) : [],
                    pageLength: 10,
                    dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
                    language: {
                        search: "Buscar:",
                        searchPlaceholder: "Filtrar solicitudes...",
                        emptyTable: "No se encontraron solicitudes",
                    },
                    columnDefs: [
                        { targets: [0, 5], className: 'text-center' },
                        { orderable: false, targets: [5] }
                    ],
                    initComplete: function () {
                        $("div.button-section").html(``);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener solicitudes:', error);
        });
}
