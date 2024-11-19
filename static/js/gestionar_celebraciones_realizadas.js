$(document).ready(function () {
    // Inicializar DataTable sin el filtro de búsqueda
    $('#celebracionesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3">rt<"bottom"p>',
        language: {
            paginate: {
                previous: "Anterior",
                next: "Siguiente"
            },
            lengthMenu: "Mostrar _MENU_ entradas"
        }
    });
});

// Función para filtrar por acto litúrgico
function filtrarPorActo() {
    const actoSeleccionado = $('#filtroActo').val().toLowerCase();

    // Mostrar/ocultar filas según el filtro
    $('#celebracionesTable tbody tr').each(function () {
        const acto = $(this).find('.acto-liturgico').text().toLowerCase();
        if (actoSeleccionado === "" || acto.includes(actoSeleccionado)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}
