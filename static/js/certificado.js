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
            const acto = $(this).find('.nombre_liturgia').text().toLowerCase();
            if (actoSeleccionado === "" || acto.includes(actoSeleccionado)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});


function generarCertificadoPost(idSolicitud) {
    fetch('/certificado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_solicitud: idSolicitud }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al generar el certificado');
        }
        return response.blob(); // Convertir la respuesta en un archivo Blob
    })
    .then(blob => {
        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificado_${idSolicitud}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al generar el certificado.');
    });
};