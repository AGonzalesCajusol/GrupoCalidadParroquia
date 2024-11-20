$(document).ready(function () {
    // Inicializar DataTable
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

    // Filtro de Acto Litúrgico
    $('#filtroActo').on('change', function () {
        const actoSeleccionado = $(this).val().toLowerCase();

        // Mostrar/ocultar filas según el filtro
        $('#celebracionesTable tbody tr').each(function () {
            const acto = $(this).find('.acto-liturgico').text().toLowerCase();
            if (actoSeleccionado === "" || acto.includes(actoSeleccionado)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
