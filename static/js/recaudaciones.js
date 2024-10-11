$(document).ready(function () {
    $('#tabla_recaudaciones').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json"
        }
    });
    
});


function abrirModalEditar(id, sede, monto, descripcion, fecha, hora) {
    document.getElementById("editarId").value = id;
    document.getElementById("editarSede").value = sede;
    document.getElementById("editarMonto").value = monto;
    document.getElementById("editarDescripcion").value = descripcion;
    document.getElementById("editarFecha").value = fecha;
    document.getElementById("editarHora").value = hora;
    var editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
    editarModal.show();
}
