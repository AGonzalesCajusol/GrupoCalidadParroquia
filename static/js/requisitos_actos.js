window.onload = function(){
    filtrar();
}

function filtrar() {
    var acto = document.getElementById('actos').value;
    const tbody = document.getElementById('tabla_actosbody');
    const tbody2 = document.getElementById('dato2');

    // Limpiar el contenido de las tablas
    tbody.innerHTML = "";
    tbody2.innerHTML = "";

    // Fetch para obtener los datos
    fetch(`/filtrorequisitosxacto/${acto}`)
        .then(response => response.json())
        .then(elemento => {
            elemento = elemento.data;
            elemento.forEach(data => {
                // Crear fila para la primera tabla
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="text-center">${data.id === null ? '-' : data.id}</td>
                    <td>${data.nombre_acto}</td>
                    <td>${data.requisitos === null ? '-' : data.requisitos}</td>
                    <td class="text-center">${data.id === null ? '-' : data.nivel == 'R' ? 'Requerido' : 'Obligatorio' }</td>
                    <td>${data.tipo === null ? '-' : data.tipo}</td>
                `;
                tbody.appendChild(row); // Agrega la fila al tbody

                // Crear fila para la segunda tabla
                const row2 = document.createElement('tr');
                row2.innerHTML = `
                    <td class="text-center">${data.id === null ? '-' : data.id}</td>
                    <td>${data.nombre_acto}</td>
                    <td>${data.requisitos === null ? '-' : data.requisitos}</td>
                    <td class="text-center">${data.id === null ? '-' : data.nivel == 'R' ? 'Requerido' : 'Obligatorio' }</td>
                    <td>${data.tipo === null ? '-' : data.tipo}</td>
                `;
                tbody2.appendChild(row2); // Agrega la fila al tbody2
            });
        });
}


function enviar() {
    const texto = document.getElementById('con').innerHTML;
    const destinatario = document.getElementById('correo').value;
    
    const datos = {
        text: texto,
        dest: destinatario
    };
    fetch('/enviar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    })
    .then( elemento => elemento.json())
    .then(elemento => {
        if (elemento.estado == "Correcto"){
            document.getElementById('correo').value = ""
            alert("Se enviaron correctamente tus requisitos");
            location.reload()
        }else{
            alert("No se pudo enviar tus requisitos");
        }
    }

    )
}