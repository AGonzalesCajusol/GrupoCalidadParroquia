document.addEventListener("DOMContentLoaded", function () {
    // Inicializar DataTables para la tabla de programación
    $('#tablaProgramacion').DataTable({
        pageLength: 8,
        lengthChange: false,
        searching: false,
        paging: true,
        info: false,
        autoWidth: false,
        destroy: true, // Asegúrate de que se pueda reinicializar
        language: {
            paginate: {
                previous: "Anterior",
                next: "Siguiente"
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Cargando datos del ministro y sede...");
    await obtenerDatosMinistroSede();
    verificarProgramacionActo();
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

        // Verificar si la respuesta tiene éxito y contiene la clave "temas"
        if (!data.success || !Array.isArray(data.temas)) {
            console.warn("No se encontraron temas para el acto seleccionado.");
            temasTable.draw();
            return;
        }

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
                        <button class="btn btn-warning btn-sm" title="Editar"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>`;
            temasTable.row.add($(row)).draw();
        });

    } catch (error) {
        console.error("Error al cargar temas:", error);
    }
}


// Función auxiliar para obtener el nombre del día de la semana
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

document.addEventListener("DOMContentLoaded", function () {
    cargarActosLiturgicos();
});

function abrirModalVer(button) {
    console.log("Botón 'Ver' clickeado");

    // Obtener el ID de la programación desde la fila seleccionada
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
                            <button class="btn btn-warning btn-sm" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
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

