$(document).ready(function () {
    $('#temasTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: { search: "Buscar:" }
    });
});

function mostrarTemas(idCharla) {
    console.log("Cargando temas para la charla:", idCharla);
    fetch(`/obtener_programacion_por_charla?id_charla=${idCharla}`)
        .then(response => response.json())
        .then(data => {
            const formulario = document.getElementById("formulario_temas_sacramento");

            if (!formulario) {
                console.error("No se encontró el elemento con id 'formulario_temas_sacramento'");
                return;
            }

            if (data && data.success) {
                console.log("Datos de programación recibidos:", data.programacion);
                const programacion = data.programacion;

                if (programacion.length === 0) {
                    formulario.innerHTML = "<p>No hay temas programados para esta charla.</p>";
                    return;
                }

                let tableHTML = `<table class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Tema</th>
                                                <th>Fecha</th>
                                                <th>Hora Inicio</th>
                                                <th>Hora Fin</th>
                                                <th>Estado</th>
                                                <th>Ministro</th>
                                                <th>Sede</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;


                programacion.forEach(prog => {
                    const formatHora = (hora) => {
                        const [h, m] = hora.split(":");
                        return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
                    };

                    const horaInicio = prog.hora_inicio ? formatHora(prog.hora_inicio) : "";
                    const horaFin = prog.hora_fin ? formatHora(prog.hora_fin) : "";

                    tableHTML += `<tr data-id_programacion="${prog.id_programacion}">
                                        <td>${prog.tema}</td>
                                        <td><input type="date" class="form-control" value="${prog.fecha}" readonly></td>
                                        <td><input type="time" class="form-control" value="${horaInicio}" readonly></td>
                                        <td><input type="time" class="form-control" value="${horaFin}" readonly></td>
                                        <td>${prog.estado}</td>
                                        <td>${prog.ministro}</td>
                                        <td>${prog.sede}</td> 
                                        <td>   
                                            <button class="btn btn-primary btn-sm" title="Ver"
                                                onclick="abrirModalVer('${prog.id_programacion}', '${prog.tema}', '${prog.fecha}', '${horaInicio}', '${horaFin}', '${prog.estado}', '${prog.ministro}', '${prog.sede}')">
                                                <i class="fas fa-eye"></i>
                                            </button>

                                            <button class="btn btn-warning btn-sm" title="Editar"
                                                onclick="abrirModalEditar('${prog.id_programacion}', '${prog.tema}', '${prog.fecha}', '${horaInicio}', '${horaFin}', '${prog.estado}', '${prog.ministro}', '${prog.sede}')">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-secondary btn-sm" title="Dar de Baja"
                                                onclick="darDeBajaProgramacion('${prog.id_programacion}')">
                                                <i class="fas fa-ban"></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm" title="Eliminar"
                                                onclick="eliminarProgramacion('${prog.id_programacion}')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </td> 
                                    </tr>`;
                });

                tableHTML += `</tbody></table>`;
                formulario.innerHTML = tableHTML;
            } else {
                console.error("Error al obtener la programación:", data ? data.error : "Respuesta no válida");
                formulario.innerHTML = "<p>Error al cargar la programación.</p>";
            }
        })
        .catch(error => {
            console.error("Error en la solicitud de programación:", error);
            const formulario = document.getElementById("formulario_temas_sacramento");
            if (formulario) {
                formulario.innerHTML = "<p>Error al cargar la programación.</p>";
            }
        });
}

window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idActo = urlParams.get("id_actoliturgico");
    const fechaInicio = urlParams.get("fecha_inicio");
    const idCharla = urlParams.get("id_charla");

    if (idActo && fechaInicio && idCharla) {
        enviarDNIAlBackend(idActo, fechaInicio, idCharla);
    } else {
        console.error("Faltan parámetros necesarios en la URL.");
    }
});

function generarProgramacionAutomatica(idActo, fechaInicio, idCharla, idMinistro, idSede) {
    console.log("Enviando:", { id_actoliturgico: idActo, fecha_inicio: fechaInicio, id_charla: idCharla, id_ministro: idMinistro, id_sede: idSede });

    fetch("/generar_programacion_automatica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_actoliturgico: idActo,
            fecha_inicio: fechaInicio,
            id_charla: idCharla,
            id_ministro: idMinistro,
            id_sede: idSede
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarTemas(idCharla);
            } else {
                console.error("Error al generar la programación:", data.error);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud de generación automática:", error);
        });
}

function registrarProgramacionEnBloque() {
    const idCharla = new URLSearchParams(window.location.search).get("id_charla");
    const filas = document.querySelectorAll("#formulario_temas_sacramento tbody tr");
    const programaciones = [];

    filas.forEach(fila => {
        const idProgramacion = fila.getAttribute("data-id_programacion");
        const fecha = fila.querySelector("input[type='date']").value;
        const horaInicio = fila.querySelector("input[name^='hora_inicio']").value;
        const horaFin = fila.querySelector("input[name^='hora_fin']").value;
        const estado = fila.querySelector("select[name^='estado']").value;
        const ministro = fila.querySelector("input[name^='ministro']").value;
        const sede = fila.querySelector("input[name^='sede']").value;

        programaciones.push({
            id_programacion: idProgramacion,
            fecha: fecha,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            estado: estado,
            ministro: ministro,
            sede: sede
        });
    });

    fetch("/registrar_programacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_charla: idCharla, programaciones: programaciones }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Programación registrada con éxito");
                location.reload(); // Recargar la página para ver los cambios
            } else {
                alert("Error al registrar la programación: " + data.error);
            }
        })
        .catch(error => console.error("Error al registrar la programación:", error));
}

function obtenerDNI() {
    const nombreCookie = "dni";
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [nombre, valor] = cookie.split("=");
        if (nombre === nombreCookie) {
            return valor;
        }
    }
    return null;
}

const dni = obtenerDNI();
console.log("dni obtenido:", dni);

function enviarDNIAlBackend(idActo, fechaInicio, idCharla) {
    const dni = obtenerDNI();
    if (!dni) {
        console.error("No se encontró el DNI en las cookies.");
        return;
    }

    fetch("/obtener_ids_por_dni", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ dni: dni })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const idMinistro = data.id_ministro;
                const idSede = data.id_sede;
                console.log("ID del Ministro:", idMinistro);
                console.log("ID de la Sede:", idSede);
                // Llamar a generarProgramacionAutomatica con los ID obtenidos
                generarProgramacionAutomatica(idActo, fechaInicio, idCharla, idMinistro, idSede);
            } else {
                console.error("Error al obtener los IDs:", data.error);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud al backend:", error);
        });
}

function abrirModalVer(idProgramacion, tema, fecha, horaInicio, horaFin, estado, ministro, sede) {    
    const modalTitle = 'Ver Detalles de la Programación';

    document.getElementById('modalTitle').innerText = modalTitle;
    document.getElementById('modalTema').value = tema;
    document.getElementById('modalFecha').value = fecha;
    document.getElementById('modalHoraInicio').value = horaInicio;
    document.getElementById('modalHoraFin').value = horaFin;    
    document.getElementById('modalMinistro').value = ministro;
    document.getElementById('modalSede').value = sede;
    const estadoSelect = document.getElementById('modalEstado');

    // Convertir el valor completo a su abreviación correspondiente
    let estadoAbreviado;
    if (estado === 'Pendiente') estadoAbreviado = 'P';
    else if (estado === 'Realizado') estadoAbreviado = 'R';
    else if (estado === 'Inactivo') estadoAbreviado = 'I';

    console.log("Valor de estado abreviado:", estadoAbreviado);

    estadoSelect.value = estadoAbreviado;

    document.querySelectorAll('#modalVerForm input, #modalVerForm select').forEach(input => input.disabled = true);
    document.getElementById('btnGuardarCambios').style.display = 'none';
    document.getElementById('btnSeleccionMinistro').disabled = true;
    document.getElementById('btnSeleccionSede').disabled = true;
    const modalVer = new bootstrap.Modal(document.getElementById('modalVer'));
    modalVer.show();
}

function abrirModalEditar(idProgramacion, tema, fecha, horaInicio, horaFin, estado, ministro, sede) {
    const modalTitle = 'Editar Programación';
    document.getElementById('modalTitle').innerText = modalTitle;
    document.getElementById('modalTema').value = tema;
    document.getElementById('modalFecha').value = fecha;
    document.getElementById('modalHoraInicio').value = horaInicio;
    document.getElementById('modalHoraFin').value = horaFin;    
    document.getElementById('modalMinistro').value = ministro;
    document.getElementById('modalSede').value = sede;
    
    const estadoSelect = document.getElementById('modalEstado');

    // Convertir el valor completo a su abreviación correspondiente
    let estadoAbreviado;
    if (estado === 'Pendiente') estadoAbreviado = 'P';
    else if (estado === 'Realizado') estadoAbreviado = 'R';
    else if (estado === 'Inactivo') estadoAbreviado = 'I';

    console.log("Valor de estado abreviado:", estadoAbreviado);

    // Asigna el valor abreviado al select
    estadoSelect.value = estadoAbreviado;
    document.getElementById('btnSeleccionMinistro').disabled = false;
    document.getElementById('btnSeleccionSede').disabled = false;
    document.querySelectorAll('#modalVerForm input').forEach(input => {
        input.disabled = false;
    });

    document.getElementById('modalVerForm').setAttribute('data-id_programacion', idProgramacion);
    document.getElementById('btnGuardarCambios').style.display = 'block';
    const modalEditar = new bootstrap.Modal(document.getElementById('modalVer'));
    modalEditar.show();
}

function guardarCambiosEdicion() {
    const idProgramacion = document.getElementById('modalVerForm').getAttribute('data-id_programacion');
    const tema = document.getElementById('modalTema').value;
    const fecha = document.getElementById('modalFecha').value;
    const horaInicio = document.getElementById('modalHoraInicio').value;
    const horaFin = document.getElementById('modalHoraFin').value;
    const estado = document.getElementById('modalEstado').value;
    const ministro = document.getElementById('modalMinistro').value;
    const sede = document.getElementById('modalSede').value;

    fetch("/actualizar_programacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_programacion: idProgramacion,
            tema: tema,
            fecha: fecha,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            estado: estado,
            ministro: ministro,
            sede: sede
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Programación actualizada con éxito");
            location.reload(); // Recargar para reflejar los cambios
        } else {
            alert("Error al actualizar la programación: " + data.error);
        }
    })
    .catch(error => console.error("Error al guardar la edición:", error));
}

let paginaActualMinistro = 1;
const resultadosPorPagina = 10;

let paginaActualSede = 1;
const resultadosPorPaginaSede = 10;


function abrirModalSeleccionMinistro() {
    const modalMinistro = new bootstrap.Modal(document.getElementById('modalSeleccionMinistro'));
    modalMinistro.show();
    
    cargarListaMinistros();
}

function abrirModalSeleccionSede() {
    const modalSede = new bootstrap.Modal(document.getElementById('modalSeleccionSede'));
    modalSede.show();

    cargarListaSedes();
}

function seleccionarMinistro(nombreMinistro) {
    document.getElementById('modalMinistro').value = nombreMinistro;
    const modalMinistro = bootstrap.Modal.getInstance(document.getElementById('modalSeleccionMinistro'));
    modalMinistro.hide();
}

function seleccionarSede(nombreSede) {
    document.getElementById('modalSede').value = nombreSede;
    const modalSede = bootstrap.Modal.getInstance(document.getElementById('modalSeleccionSede'));
    modalSede.hide();
}

function cargarListaMinistros() {
    const terminoBusqueda = document.getElementById('buscarMinistro').value;
    
    fetch(`/obtener_ministros?busqueda=${terminoBusqueda}&pagina=${paginaActualMinistro}&limite=${resultadosPorPagina}`)
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('listaMinistros');
            lista.innerHTML = '';
            data.ministros.forEach(ministro => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ministro.id_ministro}</td>
                    <td>${ministro.nombre}</td>
                    <td>${ministro.sede}</td>
                `;
                row.onclick = () => seleccionarMinistro(ministro.nombre);
                lista.appendChild(row);
            });

            // Actualizar el número de página en la interfaz
            document.getElementById('paginaActualMinistro').textContent = data.pagina;
        });
}

function paginaAnterior(tipo) {
    if (paginaActualMinistro > 1) {
        paginaActualMinistro--;
        cargarListaMinistros();
    }
}

function paginaSiguiente(tipo) {
    paginaActualMinistro++;
    cargarListaMinistros();
}

function cargarListaSedes() {
    const terminoBusqueda = document.getElementById('buscarSede').value;

    fetch(`/obtener_sedes?busqueda=${terminoBusqueda}&pagina=${paginaActualSede}&limite=${resultadosPorPaginaSede}`)
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('listaSedes');
            lista.innerHTML = '';
            data.sedes.forEach(sede => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sede.id_sede}</td>
                    <td>${sede.nombre}</td>
                    <td>${sede.direccion}</td>
                `;
                row.onclick = () => seleccionarSede(sede.nombre);
                lista.appendChild(row);
            });

            // Actualizar el número de página en la interfaz
            document.getElementById('paginaActualSede').textContent = data.pagina;
        });
}

function paginaAnterior(tipo) {
    if (tipo === 'sede' && paginaActualSede > 1) {
        paginaActualSede--;
        cargarListaSedes();
    } else if (tipo === 'ministro' && paginaActualMinistro > 1) {
        paginaActualMinistro--;
        cargarListaMinistros();
    }
}

function paginaSiguiente(tipo) {
    if (tipo === 'sede') {
        paginaActualSede++;
        cargarListaSedes();
    } else if (tipo === 'ministro') {
        paginaActualMinistro++;
        cargarListaMinistros();
    }
}

function darDeBajaProgramacion(idProgramacion) {
    if (confirm("¿Estás seguro de que deseas dar de baja esta programación?")) {
        fetch("/dar_de_baja_programacion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_programacion: idProgramacion })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("La programación ha sido dada de baja con éxito.");
                
                // Actualizar el estado en la tabla a "Inactivo"
                actualizarEstadoEnTabla(idProgramacion, "Inactivo");
            } else {
                alert("Error al dar de baja la programación: " + data.error);
            }
        })
        .catch(error => console.error("Error al dar de baja la programación:", error));
    }
}

function actualizarEstadoEnTabla(idProgramacion, nuevoEstado) {
    // Buscar la fila de la tabla que tiene el atributo `data-id_programacion` igual a `idProgramacion`
    const fila = document.querySelector(`tr[data-id_programacion="${idProgramacion}"]`);

    if (fila) {
        // Selecciona la celda de estado (ajusta el índice de acuerdo con la posición en tu tabla)
        const celdaEstado = fila.querySelector("td:nth-child(5)"); // Suponiendo que el estado está en la columna 5
        if (celdaEstado) {
            celdaEstado.textContent = nuevoEstado;
        }
    }
}



const eliminarProgramacion = (idProgramacion) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta programación? Esta acción no se puede deshacer.")) {
        fetch("/eliminar_programacion", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_programacion: idProgramacion })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("La programación ha sido eliminada con éxito.");
                
                // Eliminar la fila de la tabla
                eliminarFilaDeTabla(idProgramacion);
            } else {
                alert("Error al eliminar la programación: " + data.error);
            }
        })
        .catch(error => console.error("Error al eliminar la programación:", error));
    }
};

const eliminarFilaDeTabla = (idProgramacion) => {
    // Buscar la fila de la tabla que tiene el atributo `data-id_programacion` igual a `idProgramacion`
    const fila = document.querySelector(`tr[data-id_programacion="${idProgramacion}"]`);

    // Eliminar la fila si existe
    if (fila) {
        fila.remove();
    }
};
