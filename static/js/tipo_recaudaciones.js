$(document).ready(function () {
    $('#tabla_tipo_recaudaciones').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json"
        }
    });
    
});
function abrirModalEditar(id_tipo, nombre_tipo, tipo) {
    document.getElementById("editarIdTipo").value = id_tipo;
    document.getElementById("editarNombreTipo").value = nombre_tipo;
    document.getElementById("editarMonetario").checked = tipo == 1;
    document.getElementById("editarNoMonetario").checked = tipo == 0;
    var editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
    editarModal.show();
}