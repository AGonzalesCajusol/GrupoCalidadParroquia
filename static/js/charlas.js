$(document).ready(function () {
    var table = $('#temasTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        }
    });
});

var modal = new bootstrap.Modal(document.getElementById('myModal11'));

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idActo = urlParams.get('id_actoliturgico');
    const fechaInicio = urlParams.get('fecha_inicio');
    const idCharla = urlParams.get('id_charla'); // Capturar el nuevo parámetro id_charla
    idActoGlobal = urlParams.get('id_actoliturgico');
    idCharlaGlobal = urlParams.get('id_charla');

    console.log('ID del acto litúrgico recibido:', idActo);
    console.log('Fecha de inicio recibida:', fechaInicio);
    console.log('ID de charla recibido:', idCharla); // Imprimir para verificar

    if (idActo && fechaInicio && idCharla) {
        mostrarTemas(idActo, idCharla); // Pasar idCharla a mostrarTemash
    } else {
        console.error('ID de acto, charla o fecha de inicio no encontrada en la URL.');
    }

    console.log('ID del acto litúrgico recibido:', idActoGlobal);
    console.log('ID de charla recibido:', idCharlaGlobal);

    if (idActoGlobal && idCharlaGlobal) {
        mostrarTemas(idActoGlobal, idCharlaGlobal);
    } else {
        console.error('ID de acto o charla no encontrada en la URL.');
    }
});

function mostrarTemas(idActo, idCharla) {
    const formulario = document.getElementById('formulario_temas_sacramento');
    formulario.innerHTML = '';

    if (idActo && idCharla) {
        console.log('ID de acto que se envía:', idActo);
        console.log('ID de charla que se envía:', idCharla);

        fetch(`/obtener_programacion_por_acto?acto=${idActo}&charla=${idCharla}`)
            .then(response => response.json())
            .then(programaciones => {
                console.log('Programaciones recibidas:', programaciones);
                if (Array.isArray(programaciones) && programaciones.length > 0) {
                    let tableHTML = '<table class="table table-striped table-bordered"><thead><tr><th>Tema</th><th>Fecha</th><th>Hora Inicio</th><th>Hora Fin</th><th>Estado</th><th>Ministro</th><th>Sede</th></tr></thead><tbody>';

                    programaciones.forEach((programacion, index) => {
                        if (programacion && programacion.length >= 8) {  // Asegura que tenga al menos 8 elementos
                            const temaIndex = index + 1;
                            const estadoTexto = programacion[5] === 'R' ? 'Realizado' : 'Pendiente';
                            const nombreMinistro = programacion[6] || 'Sin asignar';
                            
                            tableHTML += `
                                <tr data-id_programacion="${programacion[0]}">
                                    <td><label>${programacion[1]}</label></td>
                                    <td><input type="date" class="form-control" name="fecha${temaIndex}" value="${programacion[2] || ''}" required></td>
                                    <td><input type="time" class="form-control" id="hora_inicio${temaIndex}" name="hora_inicio${temaIndex}" value="${programacion[3] || ''}" onchange="hora_fin('hora_inicio${temaIndex}', 'hora_fin${temaIndex}')" required></td>
                                    <td><input type="time" class="form-control" id="hora_fin${temaIndex}" name="hora_fin${temaIndex}" value="${programacion[4] || ''}" required></td>
                                    <td><input type="checkbox" name="estado${temaIndex}" ${programacion[5] === 'R' ? 'checked' : ''}>&nbsp; (${estadoTexto})</td>
                                    <td>
                                        <div class="d-inline-flex">
                                            <input type="number" id="idministro${temaIndex}" hidden>
                                            <input type="text" class="form-control" id="ministro${temaIndex}" name="ministro${temaIndex}" value="${nombreMinistro}" placeholder="Ministro">
                                            <button class="btn btn-primary" onclick="abrir_modal('ministro${temaIndex}', 'idministro${temaIndex}')">
                                                <i class="bi bi-plus-circle-fill"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td><input type="text" class="form-control" name="sede${temaIndex}" value="${programacion[7] || ''}" placeholder="Ingresar sede"></td>
                                </tr>`;
                        } else {
                            console.error('Error: `programacion` no tiene la estructura esperada:', programacion);
                        }
                    });
                    

                    tableHTML += '</tbody></table>';
                    formulario.innerHTML = tableHTML;
                } else {
                    console.log("Ejecutando generarFilasRegistro porque no hay programaciones");
                    generarFilasRegistro(idActo);
                }
            })
            .catch(error => {
                console.error('Error al obtener las programaciones:', error);
                formulario.innerHTML = '<p>Error al cargar las programaciones.</p>';
            });
    } else {
        formulario.innerHTML = '<p>Seleccione un acto litúrgico para ver las programaciones.</p>';
    }
}

function abrir_modal(ministro_f, id_ministro_f) {
    var cuerpo_tabla = document.getElementById('cuerpo_ministros');
    $('#table_mini').DataTable().destroy(); // Destruir la tabla existente
    cuerpo_tabla.innerHTML = '';

    fetch('ministros_registro')
        .then(response => response.json())
        .then(ministros => {
            ministros.forEach(ministro => {
                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                var tdButton = document.createElement('td'); // Celda para el botón
                var bt1 = document.createElement('button');

                tdButton.addEventListener('click', function () {
                    asignar(ministro.numero_doc, ministro.nombre_ministro, id_ministro_f, ministro_f);
                });

                // Configura el contenido de las celdas
                td1.textContent = ministro.numero_doc;
                td2.textContent = ministro.nombre_ministro;
                td3.textContent = ministro.sede;

                bt1.classList.add('btn', 'btn-primary', 'btn-sm');
                bt1.innerHTML = '<i class="bi bi-check2-circle"></i>'; // Añade el ícono como HTML
                tdButton.appendChild(bt1);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(tdButton);
                cuerpo_tabla.appendChild(tr);
            });

            var table = $('#table_mini').DataTable({
                paging: false,
                ordering: false,
                info: false
            });

            $('#searchInput').keyup(function () {
                table.search(this.value).draw();
            });

        })
        .catch(error => {
            console.error('Error al cargar los ministros:', error);
        });

    modal.show();
}

function asignar(numero_doc, nombre_ministro, id_ministro_f, ministro_f) {
    document.getElementById(id_ministro_f).value = numero_doc;
    document.getElementById(ministro_f).value = nombre_ministro;
    modal.hide();
}



function asignar(numero_doc, nombre_ministro, id_ministro_f, ministro_f) {
    document.getElementById(id_ministro_f).value = numero_doc;
    document.getElementById(ministro_f).value = nombre_ministro;
    modal.hide();
}

function hora_fin(hora_inicio, hora_fin) {
    var h_inicio = document.getElementById(hora_inicio).value;
    var [horas, minutos] = h_inicio.split(':').map(Number);

    var fecha = new Date();
    fecha.setHours(horas);
    fecha.setMinutes(minutos);

    fecha.setHours(fecha.getHours() + 2);

    var nueva_hora = String(fecha.getHours()).padStart(2, '0');
    var nuevos_minutos = String(fecha.getMinutes()).padStart(2, '0');

    document.getElementById(hora_fin).value = `${nueva_hora}:${nuevos_minutos}`;
}

function registrarProgramacion() {

    console.log('ya se registro')

}

function generarFilasRegistro(idActo) {
    fetch(`/obtener_temas_por_acto?acto=${idActo}`)
        .then(response => response.json())
        .then(data => {
            console.log("Temas recibidos en generarFilasRegistro:", data.temas);
            const temas = data.temas;

            if (Array.isArray(temas) && temas.length > 0) {
                let tableHTML = `
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Tema</th>
                                <th>Fecha</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Estado</th>
                                <th>Ministro</th>
                                <th>Sede</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                temas.forEach((tema, index) => {
                    const temaIndex = index + 1;
                    const estadoTexto = tema[5] === 'R' ? 'Realizado' : 'Pendiente';
                    const nombreMinistro = tema[6] || ' ';
                    const nombreSede = tema.sede || ''; // Asegura que 'nombreSede' sea un string vacío si no está definido

                    tableHTML += `
                        <tr>
                            <td>${tema.descripcion}</td>
                            <td><input type="date" class="form-control" name="fecha${temaIndex}" required></td>
                            <td><input type="time" class="form-control" name="hora_inicio${temaIndex}" required></td>
                            <td><input type="time" class="form-control" name="hora_fin${temaIndex}" required></td>
                            <td>
                                <input type="checkbox" name="estado${temaIndex}" ${tema[5] === 'R' ? 'checked' : ''}>
                                &nbsp; (${estadoTexto})
                            </td>
                            <td>
                                <div class="d-inline-flex">
                                    <input type="number" id="idministro${temaIndex}" hidden>
                                    <input type="text" class="form-control" id="ministro${temaIndex}" name="ministro${temaIndex}" value="${nombreMinistro}" placeholder="Ministro">
                                    <button class="btn btn-primary" onclick="abrir_modal('ministro${temaIndex}', 'idministro${temaIndex}')">
                                        <i class="bi bi-plus-circle-fill"></i>
                                    </button>
                                </div>
                            </td>
                            <td><input type="text" class="form-control" name="sede${temaIndex}" value="${nombreSede}" placeholder="Ingresar sede"></td>
                        </tr>
                    `;
                });
                
                tableHTML += '</tbody></table>';
                document.getElementById('formulario_temas_sacramento').innerHTML = tableHTML;
            } else {
                document.getElementById('formulario_temas_sacramento').innerHTML = '<p>No hay temas disponibles para este acto litúrgico.</p>';
            }
        })
        .catch(error => {
            console.error('Error al obtener los temas:', error);
            document.getElementById('formulario_temas_sacramento').innerHTML = '<p>Error al cargar los temas.</p>';
        });
}


function registrarProgramacionEnBloque() {
    const temasFilas = document.querySelectorAll('#formulario_temas_sacramento tbody tr');
    let programaciones = [];

    // Validación de cada fila
    for (let i = 0; i < temasFilas.length; i++) {
        const fila = temasFilas[i];
        const fecha = fila.querySelector(`input[name="fecha${i + 1}"]`).value;
        const horaInicio = fila.querySelector(`input[name="hora_inicio${i + 1}"]`).value;
        const horaFin = fila.querySelector(`input[name="hora_fin${i + 1}"]`).value;
        const ministro = fila.querySelector(`input[name="ministro${i + 1}"]`).value;
        const sede = fila.querySelector(`input[name="sede${i + 1}"]`).value;

        // Validar que todos los campos estén completos
        if (!fecha || !horaInicio || !horaFin || !ministro || !sede) {
            alert(`Por favor, complete todos los campos para el tema ${i + 1}`);
            return;
        }

        // Agregar la programación al arreglo si todos los campos están completos
        programaciones.push({
            tema: fila.querySelector('label').innerText,  // Obtener el nombre del tema
            fecha: fecha,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            estado: 'Pendiente',
            ministro: ministro,
            sede: sede
        });
    }

    // Enviar los datos en bloque al servidor si la validación es exitosa
    fetch('/registrar_programacion_en_bloque', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_charla: idCharlaGlobal,  // Usa las variables globales
            id_actoliturgico: idActoGlobal,
            programaciones: programaciones
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Programación registrada con éxito');
                mostrarTemas(idActoGlobal, idCharlaGlobal);  // Recargar los temas para mostrar los datos registrados
            } else {
                alert('Error al registrar la programación');
            }
        })
        .catch(error => {
            console.error('Error al registrar la programación en bloque:', error);
            alert('Hubo un error al intentar registrar la programación');
        });
}
