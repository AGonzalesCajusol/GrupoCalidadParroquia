document.addEventListener("DOMContentLoaded", async function () {
    // Inicializar DataTables para la tabla de programación
    $('#tablaProgramacion').DataTable({
        pageLength: 8,
        lengthChange: false,
        searching: false,
        paging: true,
        info: false,
        autoWidth: false,
        destroy: true,
        language: {
            paginate: {
                previous: "Anterior",
                next: "Siguiente"
            }
        }
    });    
    await obtenerDatosMinistroSede();
    verificarProgramacionActo();    
    cargarActosLiturgicos();
 
});

function cargarActosLiturgicos() {
    console.log("Cargando actos litúrgicos...");
    fetch('/obtener_actos_liturgicos')
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos:", data);
            const selectActo = document.getElementById('selectActoLiturgico');
            if (!selectActo) {
                console.error("No se encontró el elemento selectActoLiturgico");
                return;
            }
            selectActo.innerHTML = '<option value="">Seleccione un acto</option>';

            if (data.success && data.actos.length > 0) {
                data.actos.forEach(acto => {
                    console.log(`Agregando acto: ${acto.descripcion}`);
                    const option = document.createElement('option');
                    option.value = acto.id_actoliturgico;
                    option.text = acto.descripcion;
                    selectActo.appendChild(option);
                });
            } else {
                console.warn("No se encontraron actos litúrgicos.");
            }
        })
        .catch(error => {
            console.error("Error al cargar actos litúrgicos:", error);
        });
}

window.addEventListener('load', cargarActosLiturgicos);

async function cargarTemasPorActo() {
    const actoId = document.getElementById('selectActoLiturgico').value;
    if (!actoId) return;

    try {
        const response = await fetch(`/obtener_temas_por_acto?acto=${actoId}`);
        const data = await response.json();

        console.log("Datos recibidos del backend:", data);

        const temasTable = $('#tablaProgramacion').DataTable();
        temasTable.clear();

        const idMinistro = document.getElementById('hiddenIdMinistro').value;
        const idSede = document.getElementById('hiddenIdSede').value;




        // Llenar la tabla con los temas disponibles
        data.temas.forEach(tema => {
            // Si los campos ministro y sede están vacíos, usar los datos de la cookie
            const ministro = tema.ministro || idMinistro ? `Ministro ${idMinistro}` : "N/A";
            const sede = tema.sede || idSede ? `Sede ${idSede}` : "N/A";

            const row = `
                <tr data-id-programacion="${tema.id_programacion || ''}" data-id-tema="${tema.id_tema}">
                    <td>${tema.descripcion || 'Sin descripción'}</td>
                    <td><input type="time" class="form-control" value="${tema.hora_inicio || '00:00'}"></td>
                    <td>
                        <select class="form-select">
                            <option value="">Seleccione un día</option>
                            <option value="1" ${tema.dias_semana == 1 ? 'selected' : ''}>Lunes</option>
                            <option value="2" ${tema.dias_semana == 2 ? 'selected' : ''}>Martes</option>
                            <option value="3" ${tema.dias_semana == 3 ? 'selected' : ''}>Miércoles</option>
                            <option value="4" ${tema.dias_semana == 4 ? 'selected' : ''}>Jueves</option>
                            <option value="5" ${tema.dias_semana == 5 ? 'selected' : ''}>Viernes</option>
                            <option value="6" ${tema.dias_semana == 6 ? 'selected' : ''}>Sábado</option>
                            <option value="7" ${tema.dias_semana == 7 ? 'selected' : ''}>Domingo</option>
                        </select>
                    </td>
                    <td>${ministro}</td>
                    <td>${sede}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" title="Ver" onclick="abrirModalVer(this)">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" title="Editar" onclick="abrirModalEditar(this)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminarProgramacion(this)">
                            <i class="fas fa-trash-alt"></i>
                        </button>                            
                    </td>
                </tr>`;
            temasTable.row.add($(row)).draw();
        });

    } catch (error) {
        console.error("Error al cargar temas:", error);
    }
}

function getDiaSemana(dia) {
    const dias = {
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sábado",
        7: "Domingo"
    };
    return dias[dia] || "Desconocido";
}

function actualizarDiaSeleccionado(selectElement) {
    const selectedDay = selectElement.value;
    console.log(`Día seleccionado: ${selectedDay}`);
}

const diasSelect = document.getElementById('diasSemanaSelect');
const selectActo = document.getElementById('selectActoLiturgico');
if (selectActo) {
        const actoId = selectActo.value;
        if (actoId) {
            cargarTemasPorActo();
        }
    } else {
        console.error("El elemento selectActoLiturgico no existe.");
    }

function abrirModalVer(button) {
    console.log("Botón 'Ver' clickeado");
    
    const row = button.closest('tr');
    const idProgramacion = row.getAttribute('data-id-programacion');
    console.log("ID de programación enviado al backend:", idProgramacion);

    if (!idProgramacion) {
        alert("No se pudo obtener el ID de la programación.");
        return;
    }

    // Realizar la solicitud al backend para obtener los detalles
    fetch(`/obtener_programacion_detalle?id_programacion=${idProgramacion}`)
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos del backend:", data);
            
            if (data.success) {
                // Llenar los campos del modal con los datos recibidos
                document.getElementById('modalDescripcion').value = data.detalle.descripcion || '';
                document.getElementById('modalHoraInicio').value = data.detalle.hora_inicio || '';
                document.getElementById('modalDiasSemana').value = getDiaSemana(data.detalle.dias_semana) || '';
                document.getElementById('modalMinistro').value = data.detalle.ministro || '';
                document.getElementById('modalSede').value = data.detalle.sede || '';

                // Asegurarse de que los campos estén deshabilitados
                document.getElementById('modalDescripcion').disabled = true;
                document.getElementById('modalHoraInicio').disabled = true;
                document.getElementById('modalDiasSemana').disabled = true;
                document.getElementById('modalMinistro').disabled = true;
                document.getElementById('modalSede').disabled = true;

                // Ocultar el botón "Guardar"
                document.getElementById('btnGuardar').style.display = 'none';

                // Mostrar el modal
                const modalElement = document.getElementById('modalVerProgramacion');
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            } else {
                alert("Error al obtener los detalles de la programación.");
            }
        })
        .catch(error => console.error("Error al abrir el modal:", error));
}


function obtenerValorCookie(nombre) {
    const cookies = document.cookie.split("; ");
    console.log("Cookies actuales:", document.cookie); // Log para ver todas las cookies
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === nombre) {
            console.log(`Cookie encontrada: ${key} = ${value}`);
            return decodeURIComponent(value);
        }
    }
    console.warn(`Cookie no encontrada: ${nombre}`);
    return null;
}

async function obtenerDatosMinistroSede() {
    const dni = obtenerValorCookie('dni');
    if (!dni) {
        console.error("No se encontró el DNI en la cookie.");
        return;
    }

    try {
        const response = await fetch(`/obtener_ministro_sede?dni=${dni}`);
        const data = await response.json();

        if (data.success) {
            console.log("Datos de ministro y sede obtenidos:", data);
            
            // Aquí asignas los valores a los campos ocultos
            document.getElementById('hiddenIdMinistro').value = data.id_ministro;
            document.getElementById('hiddenIdSede').value = data.id_sede;
            
            console.log("Campo oculto de ministro:", document.getElementById('hiddenIdMinistro').value);
            console.log("Campo oculto de sede:", document.getElementById('hiddenIdSede').value);
        }
    } catch (error) {
        console.error("Error al obtener datos del ministro y sede:", error);
    }
}

async function registrarProgramacion() {
    const filas = $('#tablaProgramacion tbody tr');
    const programaciones = [];

    const idMinistro = document.getElementById('hiddenIdMinistro').value;
    const idSede = document.getElementById('hiddenIdSede').value;

    console.log("ID Ministro:", idMinistro);
    console.log("ID Sede:", idSede);

    if (!idMinistro || !idSede) {
        console.error("No se encontraron los valores de ministro o sede");
        alert("Debe seleccionar un ministro y una sede antes de registrar.");
        return;
    }

    filas.each(function () {
        const idTema = $(this).attr('data-id-tema');
        const horaInicio = $(this).find('input[type="time"]').val();
        const diaSemana = $(this).find('td select').val();

        if (idTema && horaInicio && diaSemana) {
            programaciones.push({
                id_tema: parseInt(idTema),
                hora_inicio: horaInicio,
                dia_semana: parseInt(diaSemana),
                id_ministro: parseInt(idMinistro),
                id_sede: parseInt(idSede)
            });
        }
    });

    console.log("Programaciones a registrar:", programaciones);

    try {
        const response = await fetch('/registrar_programacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ programaciones })
        });

        const data = await response.json();
        if (data.success) {
            alert("Programación registrada con éxito.");
            cargarTemasPorActo()
            location.reload();
        } else {
            console.error("Error al registrar la programación:", data.error);
            alert("Error al registrar la programación.");
        }
    } catch (error) {
        console.error("Error en la solicitud al backend:", error);
    }
}

async function verificarProgramacionActo() {
    const actoId = document.getElementById('selectActoLiturgico').value;
    if (!actoId) return;

    try {
        const response = await fetch(`/verificar_programacion?acto=${actoId}`);
        
        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", response.statusText);
            return;
        }

        const data = await response.json();
        
        const temasTable = $('#tablaProgramacion').DataTable();
        temasTable.clear();

        if (!data.success || !data.programaciones || data.programaciones.length === 0) {
            console.warn("No se encontró programación registrada. Puedes proceder a registrar una nueva.");
            
            // Mostrar el botón para registrar programación si no hay ninguna registrada
            const btnRegistrar = document.getElementById('btnRegistrar');
            if (btnRegistrar) {
                btnRegistrar.style.display = 'block';
            }

            await cargarTemasPorActo();
        } else {
            // Ocultar el botón si ya hay programaciones
            const btnRegistrar = document.getElementById('btnRegistrar');
            if (btnRegistrar) {
                btnRegistrar.style.display = 'none';
            }

            data.programaciones.forEach(programacion => {
                console.log("Programación recibida:", programacion); // Log para depurar
                
                const row = `
                    <tr data-id-programacion="${programacion.id_programacion}">
                        <td>${programacion.descripcion || 'Sin descripción'}</td>
                        <td><input type="time" class="form-control" value="${programacion.hora_inicio}" disabled></td>
                        <td>${getDiaSemana(programacion.dias_semana)}</td>
                        <td>${programacion.ministro ? programacion.ministro : 'N/A'}</td>
                        <td>${programacion.sede ? programacion.sede : 'N/A'}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" title="Ver" onclick="abrirModalVer(this)">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-warning btn-sm" title="Editar" onclick="abrirModalEditar(this)">
                                <i class="fas fa-edit"></i>
                            </button>                
                                <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminarProgramacion(this)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>                            

                        </td>
                    </tr>`;
                temasTable.row.add($(row)).draw();
            });
            
        }
    } catch (error) {
        console.error("Error al verificar la programación:", error);
        document.getElementById('btnRegistrar').style.display = 'block';
    }
}

function abrirModalEditar(button) {
    const row = button.closest('tr');
    const idProgramacion = row.getAttribute('data-id-programacion');
    
    if (!idProgramacion) return alert("No se encontró la programación a editar.");

    fetch(`/obtener_programacion_detalle?id_programacion=${idProgramacion}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('editarIdProgramacion').value = idProgramacion;
                document.getElementById('editarTema').value = data.detalle.descripcion;
                document.getElementById('editarHoraInicio').value = data.detalle.hora_inicio;
                document.getElementById('editarDiaSemana').value = data.detalle.dias_semana;
                document.getElementById('editarMinistro').value = data.detalle.ministro;
                document.getElementById('editarSede').value = data.detalle.sede;

                const modal = new bootstrap.Modal(document.getElementById('modalEditarProgramacion'));
                modal.show();
            }
        })
        .catch(error => console.error("Error al cargar los detalles:", error));
}

function guardarCambiosProgramacion() {
    const idProgramacion = document.getElementById('editarIdProgramacion').value;
    const horaInicio = document.getElementById('editarHoraInicio').value;
    const diaSemana = document.getElementById('editarDiaSemana').value;
    const idMinistro = document.getElementById('hiddenIdMinistro').value;
    const idSede = document.getElementById('hiddenIdSede').value;

    if (!idProgramacion || !horaInicio || !diaSemana || !idMinistro || !idSede) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const datos = {
        id_programacion: idProgramacion,
        hora_inicio: horaInicio,
        dia_semana: diaSemana,
        id_ministro: idMinistro,
        id_sede: idSede
    };

    fetch('/actualizar_programacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Programación actualizada con éxito.");
            location.reload();
        } else {
            alert("Error al actualizar la programación.");
        }
    })
    .catch(error => console.error("Error al guardar cambios:", error));
}

// ------------------------------------- MINISTRO -------------------------------------

async function abrirModalMinistro() {
    try {
        const response = await fetch('/obtener_ministros');
        const data = await response.json();

        if (data.success) {
            const tablaMinistrosBody = document.getElementById('tablaMinistrosBody');
            tablaMinistrosBody.innerHTML = '';

            // Generar filas para cada ministro
            data.ministros.forEach(ministro => {
                const row = `
                    <tr>
                        <td>${ministro.nombre}</td>
                        <td>${ministro.documento}</td>
                        <td>${ministro.sede}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="seleccionarMinistro(${ministro.id}, '${ministro.nombre}')">
                                Seleccionar
                            </button>
                        </td>
                    </tr>`;
                tablaMinistrosBody.insertAdjacentHTML('beforeend', row);
            });

            // Destruir la tabla si ya fue inicializada anteriormente
            if ($.fn.DataTable.isDataTable('#tablaMinistros')) {
                $('#tablaMinistros').DataTable().destroy();
            }

            // Inicializar DataTables en el modal
            $('#tablaMinistros').DataTable({
                pageLength: 8,
                lengthChange: false,
                searching: true,
                paging: true,
                info: true,
                autoWidth: false,
                destroy: true,
                language: {
                    paginate: {
                        previous: "Anterior",
                        next: "Siguiente"
                    },
                    search: "Buscar:",
                    lengthMenu: "Mostrar _MENU_ registros por página",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "No hay registros disponibles"
                }
            });

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('modalSeleccionarMinistro'));
            modal.show();
        } else {
            alert('Error al cargar los ministros.');
        }
    } catch (error) {
        console.error("Error al obtener los ministros:", error);
    }
}

function seleccionarMinistro(id, nombre) {
    // Asignar el nombre y el ID del ministro seleccionado al formulario principal
    document.getElementById('editarMinistro').value = nombre;
    document.getElementById('hiddenIdMinistro').value = id;

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalSeleccionarMinistro'));
    modal.hide();
}

// --------------------------------------- SEDE ---------------------------------------

async function abrirModalSede() {
    try {
        const response = await fetch('/obtener_sedes');
        const data = await response.json();

        if (data.success) {
            const tablaSedesBody = document.getElementById('tablaSedesBody');
            tablaSedesBody.innerHTML = '';

            // Generar filas para cada sede
            data.sedes.forEach(sede => {
                const row = `
                    <tr>
                        <td>${sede.nombre}</td>
                        <td>${sede.direccion}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="seleccionarSede(${sede.id}, '${sede.nombre}')">
                                Seleccionar
                            </button>
                        </td>
                    </tr>`;
                tablaSedesBody.insertAdjacentHTML('beforeend', row);
            });

            // Inicializar DataTables para la tabla de sedes
            if ($.fn.DataTable.isDataTable('#tablaSedes')) {
                $('#tablaSedes').DataTable().destroy();
            }
            
            $('#tablaSedes').DataTable({
                pageLength: 8,
                lengthChange: false,
                searching: true,
                paging: true,
                info: true,
                autoWidth: false,
                destroy: true,
                language: {
                    paginate: {
                        previous: "Anterior",
                        next: "Siguiente"
                    },
                    search: "Buscar:",
                    lengthMenu: "Mostrar _MENU_ registros por página",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "No hay registros disponibles"
                }
            });

            const modal = new bootstrap.Modal(document.getElementById('modalSeleccionarSede'));
            modal.show();
        } else {
            alert('Error al cargar las sedes.');
        }
    } catch (error) {
        console.error("Error al obtener las sedes:", error);
    }
}

function seleccionarSede(id, nombre) {
    // Asignar el nombre y el ID de la sede seleccionada al formulario principal
    document.getElementById('editarSede').value = nombre;
    document.getElementById('hiddenIdSede').value = id;

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalSeleccionarSede'));
    modal.hide();
}

// eliminaaaaaar
function eliminarProgramacion(button) {
    const row = button.closest('tr');
    const idProgramacion = row.getAttribute('data-id-programacion');

    if (!idProgramacion) {
        alert("No se pudo obtener el ID de la programación.");
        return;
    }

    // Confirmación antes de eliminar
    if (!confirm("¿Estás seguro de que deseas eliminar esta programación?")) {
        return;
    }

    // Enviar solicitud al backend para eliminar la programación
    fetch(`/eliminar_programacion?id_programacion=${idProgramacion}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Programación eliminada con éxito.");
            location.reload(); // Recargar la tabla para reflejar los cambios
        } else {
            alert("Error al eliminar la programación.");
        }
    })
    .catch(error => console.error("Error al eliminar programación:", error));
}
