$(document).ready(function() {
    // Inicializar la tabla de egresos con DataTables
    var table = $('#egresosTable').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/Spanish.json"
        },
        "dom": "t", // Oculta el cuadro de búsqueda predeterminado de DataTables
        "paging": false, // Desactiva la paginación (opcional, dependiendo de tus necesidades)
        "info": false // Desactiva la información de la tabla (opcional)
    });

    // Función para establecer la fecha y la hora actual en los campos del formulario de agregar
    document.getElementById('agregarModal').addEventListener('show.bs.modal', function (event) {
        var now = new Date();
        
        // Formatear fecha como YYYY-MM-DD
        var today = now.toISOString().split('T')[0];
        document.getElementById('fecha').value = today;
        
        // Formatear hora como HH:MM (hora actual)
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('hora').value = `${hours}:${minutes}`;
    });
    
    // Filtrar la tabla cuando se escriba en el campo de búsqueda
    $('#recaudacionesTable_filter input[type="search"]').on('keyup', function() {
        table.column(3).search(this.value).draw(); // Busca en la columna de descripción (índice 3)
    });
    });


    function abrirModalVer(id, nombreSede, monto, descripcion, fecha, hora) {
        document.getElementById("verId").value = id;
        document.getElementById("verSede").value = nombreSede; // Aquí se asigna el nombre de la sede
        document.getElementById("verMonto").value = monto;
        document.getElementById("verDescripcion").value = descripcion;
        document.getElementById("verFecha").value = fecha;
        document.getElementById("verHora").value = hora;
        var verModal = new bootstrap.Modal(document.getElementById('verModal'));
        verModal.show();
    }



    function abrirModalEditar(id, nombreSede, monto, descripcion, fecha, hora) {
    document.getElementById("editarId").value = id;
    var select = document.getElementById("editarSede");
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === nombreSede) {
            select.selectedIndex = i;
            break;
        }
    }
    document.getElementById("editarMonto").value = monto;
    document.getElementById("editarDescripcion").value = descripcion;
    document.getElementById("editarFecha").value = fecha;
    document.getElementById("editarHora").value = hora;
    var editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
    editarModal.show();
    }

    function exportarTablaPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Título del informe
        doc.setFontSize(18);
        doc.text("Informe de Egresos", 14, 20);
    
        // Obtener solo las filas visibles en la tabla (las filtradas)
        const table = $('#egresosTable').DataTable();
        const datos = [];
        table.rows({ search: 'applied' }).every(function () {
            const data = this.data();
            datos.push([
                data[0], // ID Egreso
                data[1], // Nombre Sede
                data[2], // Descripción
                data[3], // Fecha
                data[4], // Hora
                data[5]  // Monto
            ]);
        });
    
        // Configuración de la tabla en el PDF
        doc.autoTable({
            head: [['ID', 'Sede', 'Descripción', 'Fecha', 'Hora', 'Monto']],
            body: datos,
            startY: 30,
            styles: {
                fontSize: 10,
                cellPadding: 3,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [167, 192, 221],
                textColor: 255,
                fontSize: 11,
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: [0, 0, 0],
            },
            alternateRowStyles: {
                fillColor: [240, 248, 255],
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },   // ID Egreso
                1: { cellWidth: 30, halign: 'center' },   // Nombre Sede
                2: { cellWidth: 40, halign: 'left' },     // Descripción
                3: { cellWidth: 25, halign: 'center' },   // Fecha
                4: { cellWidth: 20, halign: 'center' },   // Hora
                5: { cellWidth: 20, halign: 'right' }     // Monto
            },
            didDrawPage: function (data) {
                doc.setFontSize(10);
                doc.text("Página " + doc.internal.getCurrentPageInfo().pageNumber, 180, 10);
            }
        });
    
        // Guardar el PDF
        doc.save("Informe_Egresos.pdf");
    }
    

    /* 
    function abrirModalEliminar(id) {
    document.getElementById("eliminarId").value = id;
    var eliminarModal = new bootstrap.Modal(document.getElementById('confirmarEliminarModal'));
    eliminarModal.show();
    }


    function mostrarAlertaBaja() {
        alert("No se puede dar de baja porque es un egreso");
    }
        ... */