document.getElementById('previsualizarBtn').addEventListener('click', function () {
    var año = document.getElementById("año").value;
    if (!año) {
        alert("Por favor selecciona un año");
        return;
    }

    // Realizar la solicitud para obtener las recaudaciones del año seleccionado
    fetch('/obtener_recaudaciones_por_anio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({año: año})
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar la tabla
        document.getElementById('tablaPrevisualizacion').style.display = 'block';

        // Limpiar la tabla anterior
        var tbody = document.getElementById('contenidoTabla');
        tbody.innerHTML = '';

        // Cargar los datos en la tabla
        if (data.recaudaciones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No se encontraron recaudaciones para el año seleccionado</td></tr>';
        } else {
            data.recaudaciones.forEach(rec => {
                var row = `<tr>
                    <td>${rec.id}</td>
                    <td>${rec.fecha}</td>
                    <td>${rec.monto}</td>
                    <td>${rec.observacion}</td>
                    <td>${rec.sede}</td>
                    <td>${rec.tipo_recaudacion}</td>
                    <td>${rec.tipo}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }

        // Preparar los formularios de exportación
        document.getElementById('exportarCSVAnio').value = año;
        document.getElementById('exportarPDFAnio').value = año;
    })
    .catch(error => console.error('Error al obtener las recaudaciones:', error));
});
