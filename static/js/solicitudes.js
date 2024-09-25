$('#solicitudesactos , #requisitos').DataTable({
    "language": {
        "lengthMenu": "Mostrar _MENU_ registros por página",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando _END_ registros de _TOTAL_ ",
        "infoEmpty": "",
        "infoFiltered": "",
        "search": "Buscar:",
        "paginate": {
            "first": "Primero",
            "last": "Último",
            "next": "Siguiente",
            "previous": "Anterior"
        },
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "emptyTable": "No hay datos disponibles en la tabla",
        "aria": {
            "sortAscending": ": activar para ordenar la columna de manera ascendente",
            "sortDescending": ": activar para ordenar la columna de manera descendente"
        }
    },
    "lengthMenu": [[1, 4, -1], [1, 4, "Todos"]]  // [valores internos], [etiquetas mostradas]
});

function mostrar(id, boton) {
    var elemento = document.getElementById(id);
    if (elemento.style.display === "none") {
        elemento.style.display = "table-row"; // Mostrar el contenido
        boton.innerHTML = '<i class="bi bi-eye-slash me-2"></i> Ocultar'; // Cambiar el texto del botón
    } else {
        elemento.style.display = "none"; // Ocultar si ya está visible
        boton.innerHTML = '<i class="bi bi-eye me-2"></i> Ver'; // Restaurar el texto original
    }
}
