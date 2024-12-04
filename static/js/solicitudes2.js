document.addEventListener('show.bs.tab', function (event) {
    if (event.target.id == 'requisitos-tab') {
        listar_solicitudes();
    }
})

function listar_solicitudes() {
    fetch('/listar_solicitudes')
        .then(response => response.json())
        .then(data => {
            if ($.fn.DataTable.isDataTable('#soli_tab')) {
                $('#soli_tab').DataTable().clear().destroy();
            }
            $('#soli_tab').DataTable({

                data: data && data.data ? data.data.map(solicitud => [
                    solicitud.id_solicitud,       // Columna 0
                    solicitud.fecha,             // Columna 1
                    solicitud.nombre_sede,       // Columna 2
                    solicitud.nombre_liturgia,   // Columna 3
                    solicitud.nombres,           // Columna 4
                    solicitud.estado,            // Columna 5
                    `
                    <button class="btn btn-primary btn-sm" onclick="rellenar_formulario(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                        <i class="bi bi-check2-circle"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="asistencias(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                        <i class="bi bi-calendar3"></i>
                    </button>
                    `
                ]) : [],
                pageLength: 10,
                dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex button-section">>rt<"bottom"p>',
                columnDefs: [
                    { targets: [6], orderable: false, className: 'text-center' } // Opciones no ordenables
                ],
                language: {
                    search: "",
                    emptyTable: "No se encontraron solicitudes",
                },
                columnDefs: [
                    { targets: [0, 5], className: 'text-center' },
                    { orderable: false, targets: [5] }
                ],
                initComplete: function () {
                    $('#filtroLiturgia').on('change', function () {
                        const liturgia = this.value.trim();
                        const table = $('#soli_tab').DataTable();
                        table.column(3).search(liturgia, false, false).draw(); // Filtro por Acto
                    });

                    $('#filtroEstado').on('change', function () {
                        const estado = this.value.trim();
                        const table = $('#soli_tab').DataTable();
                        table.column(5).search(estado, false, false).draw(); // Filtro por Estado
                    });

                    $('#buscar').on('keyup', function () {
                        const value = this.value.trim();
                        const table = $('#soli_tab').DataTable();
                        table.search(value).draw(); // Filtro general
                    });
                }
            });
            limpiar();
        })
        .catch(error => console.error('Error al obtener solicitudes:', error));
}

function responsable_pago() {
    var acto = document.getElementById('acto_seleccionado').value;
    var acto_liturgico = document.getElementById('acto_seleccionado').selectedOptions[0].text;
    var sede = document.getElementById('sede').value;
    const seleccionar = document.getElementById('responsable');

    if (acto == 1) {
        var novio = document.getElementById('dni_novio').value;
        var novia = document.getElementById('dni_novia').value;
        if (seleccionar.value > 0) {
            fetch(`/monto_acto/${acto_liturgico}/${sede}/${novio}/${novio}/${novia}`)
                .then(response => response.json())
                .then(element => {
                    if (element.estado == "si") {
                        let total = (parseFloat(element.datos.pf_acto) || 0) +
                            (parseFloat(element.datos.pf_sede) || 0) +
                            (parseFloat(element.datos.pf_traslado) || 0);
                        document.getElementById('monto').value = total;
                        document.getElementById('saldo').value = total;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    monto.value = '';
                    pagos.innerHTML = '';
                    pagos.readOnly = false;
                    pagos.textContent = 'Error al calcular';
                });

        } else {
            Toastify({
                text: "Ingrese el DNI del novio/a que falta!",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    }

    if (acto == 2) {
        // Calcular monto si es necesario
        fetch(`/montobautismo/${sede}`)
            .then(response => response.json())
            .then(element => {
                if (element.estado == "si") {
                    document.getElementById('monto').value = element.datos;
                    document.getElementById('saldo').value = element.datos;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                monto.value = '';
                pagos.innerHTML = '';
                pagos.readOnly = false;
                pagos.textContent = 'Error al calcular';
            });
    }

    if (acto == 3) {
        // Calcular monto si es necesario
        fetch(`/confirmado/${sede}`)
            .then(response => response.json())
            .then(element => {
                if (element.estado == "si") {
                    document.getElementById('monto').value = element.datos;
                    document.getElementById('saldo').value = element.datos;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                monto.value = '';
                pagos.innerHTML = '';
                pagos.readOnly = false;
                pagos.textContent = 'Error al calcular';
            });
    }
    if (acto == 6) {
        // Calcular monto si es necesario
        fetch(`/primeracm/${sede}`)
            .then(response => response.json())
            .then(element => {
                if (element.estado == "si") {
                    document.getElementById('monto').value = element.datos;
                    document.getElementById('saldo').value = element.datos;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                monto.value = '';
                pagos.innerHTML = '';
                pagos.readOnly = false;
                pagos.textContent = 'Error al calcular';
            });
    }

}


function verificar(excusa) {
    var acto_liturgico = document.getElementById('acto_seleccionado').value;
    if (acto_liturgico == "") {
        Toastify({
            text: "Selecciona un acto litúrgico",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    } else {
        const tbody = document.getElementById('datos_solicitud');

        fetch(`/requisitosXacto/${acto_liturgico}`)
            .then(response => response.json())
            .then(data => {
                tbody.innerHTML = '';  // Limpiar el tbody antes de agregar nuevas filas
                data.forEach(item => {
                    const row = document.createElement('tr');
                    var requerido = ""
                    if (item.nivel == "O") {
                        requerido = "";
                    }

                    row.innerHTML = `
                    <td class="text-center d-none">
                        <label for="">${item.id}</label>
                    </td>
                    <td>
                        <label for="">${item.nombre_requisito}</label>
                    </td>
                    <td>
                        ${retornar_input(item.tipo, item.id_requisito, item.nivel)}
                    </td>
                    <td class="text-center">
                        <div class="form-check form-switch">
                            <input name="${item.id_estador}"   ${requerido}  onchange="validar_campos('${item.tipo}','${item.id_requisito}' ,'${item.id_estador}' )" class="form-check-input" type="checkbox" id="${item.id_estador}">
                            <label class="form-check-label ms-2" for="${item.id_estador}">(Activo)</label>
                        </div>
                    </td>
                    <td class="text-center">
                        ${item.tipo === "Imagen" ?
                            `<button type="button"   onclick="visualizar('${item.id_requisito}')" class="btn btn-sm btn-primary" title="Ver"><i class="bi bi-eye-fill"></i></button>`
                            : item.tipo === "Charla" ?
                                `<button type="button" onclick="visualizar_calendario('${item.id_requisito}')"   class="btn btn-sm btn-secondary" title="Charlas"><i class="bi bi-calendar-week"></i></button>`
                                : '<span style="visibility: hidden;">&nbsp;</span>'}

                    </td>
                `;
                    tbody.appendChild(row);
                });
                if (acto_liturgico == 1) {
                    document.getElementById('formulario_solicitud').action = "registrar_solicitud_matrimonio";
                } else if (acto_liturgico == 2) {
                    document.getElementById('formulario_solicitud').action = "registrar_solicitud_bautismo";
                } else if (acto_liturgico == 3) {
                    document.getElementById('formulario_solicitud').action = "registrar_solicitud_Confirmacion";
                } else if (acto_liturgico == 6) {
                    document.getElementById('formulario_solicitud').action = "registrar_solicitud_Pcomunion";
                }
                limpiar();
                if (excusa == "si") {
                    document.getElementById('registrar').textContent = "Modificar";
                    console.log(document.getElementById('acto_seleccionado').value);
                }
            })
    }
}

function retornar_input(tipo, id, nivel) {
    var sede = document.getElementById('sede').value;
    var requerido = "";
    var id_acto = document.getElementById('acto_seleccionado').value;
    if (nivel == "O") {
        requerido = "";
    }
    //101,139
    console.log("Generando input:", { tipo, id, nivel });
    switch (tipo) {
        case 'Imagen':
            return `
                <input  name="${id}" id="${id}" ${requerido} type="file" class="form-control form-control-sm" accept="image/*,application/pdf">
                <input  id="I${id}"  type="text" class="form-control form-control-sm d-none">

            `;
        case 'Dni':
            return `
                <div class="d-flex"> 
                    <input name="${id}" id="${id}" ${requerido} type="number" class="form-control d-flex form-control-sm w-50 me-1">
                    <input id="nombre${id}"  type="text" class="form-control d-flex form-control-sm w-50 ms-1" readOnly>
                </div>
            `;
        case 'FechaHora':
            return `
                <input name="${id}"  id="${id}" ${requerido} type="datetime-local" class="form-control form-control-sm" readOnly>
            `;
        case 'Sede':
            return `
                <input name="${id}" id="${id}" ${requerido}  type="text" value="${sede}" class="form-control form-control-sm" readOnly>
            `;
        case 'Charla':
            const select = `<select id=${id}    name=${id} class="form-select form-select-sm" id="formaPago" name="formaPago" >
            </select>`;
            if (id_acto == 2) {
                fetch('/fcelebraciones/2')
                    .then(data => data.json())
                    .then(item => {
                        if (item.data == "Error" || item.data == "") {
                            Toastify({
                                text: "No existen charlas programadas!!",
                                duration: 2000,
                                close: true,
                                backgroundColor: "#dc3545",
                                gravity: "bottom",
                                position: "right",
                            }).showToast();
                            document.getElementById('registrar').disabled = true;
                            return "";
                        } else {
                            document.getElementById(`${id}`).innerHTML += "";

                            item.data.forEach(v => {
                                document.getElementById(`${id}`).innerHTML += `<option value="${v.id_charla}">${v.charla}</option>`;

                            });
                        }
                    })
            } else if (id_acto == 3) {
                fetch('/fcelebraciones/3')
                    .then(data => data.json())
                    .then(item => {
                        if (item.data == "Error" || item.data == "") {
                            Toastify({
                                text: "No existen charlas programadas!!",
                                duration: 2000,
                                close: true,
                                backgroundColor: "#dc3545",
                                gravity: "bottom",
                                position: "right",
                            }).showToast();
                            document.getElementById('registrar').disabled = true;
                            return "";
                        } else {
                            document.getElementById(`${id}`).innerHTML += "";

                            item.data.forEach(v => {
                                document.getElementById(`${id}`).innerHTML += `<option value="${v.id_charla}">${v.charla}</option>`;

                            });
                        }
                    })
            } else if (id_acto == 6) {
                fetch('/fcelebraciones/6')
                    .then(data => data.json())
                    .then(item => {
                        if (item.data == "Error" || item.data == "") {
                            Toastify({
                                text: "No existen charlas programadas!!",
                                duration: 2000,
                                close: true,
                                backgroundColor: "#dc3545",
                                gravity: "bottom",
                                position: "right",
                            }).showToast();
                            document.getElementById('registrar').disabled = true;
                            return "";
                        } else {
                            document.getElementById(`${id}`).innerHTML += "";

                            item.data.forEach(v => {
                                document.getElementById(`${id}`).innerHTML += `<option value="${v.id_charla}">${v.charla}</option>`;

                            });
                        }
                    })
            } else {
                return ""
            }
            return select;
    }
    document.getElementById("datos_solicitud").appendChild(row);
    console.log("Fila añadida:", row.innerHTML); // Verifica cada fila generada
}

function validar_campos(tipo, id, checkbox) {
    if (tipo == 'Dni') {
        var dni = document.getElementById(id);
        var variable = 'nombre' + id;
        var nombre = document.getElementById(variable);
        var st = document.getElementById(checkbox);
        var estado = st.checked;

        var responsable = document.getElementById('responsable');

        if (dni.value.length != 8 && estado) {
            Toastify({
                text: "Ingrese los campos completos del DNI!!",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
            st.checked = false;

        } else if (estado) {
            fetch(`/validar_dni/${dni.value}`)
                .then(response => { return response.json() })
                .then(element => {
                    if (element.estado == "si") {
                        dni.readOnly = true; // Hacemos que el campo sea solo lectura
                        nombre.value = element.nombre; // Asignamos el valor al campo 'nombre'
                    } else {
                        Toastify({
                            text: "Ingrese un DNI válido!!",
                            duration: 2000,
                            close: true,
                            backgroundColor: "#dc3545",
                            gravity: "bottom",
                            position: "right",
                        }).showToast();
                        dni.readOnly = false;
                        mostrar.value = "";
                        estado.checked = false;
                        responsable.innerHTML = "";
                    }

                    if (document.getElementById('acto_seleccionado').value == 1) {
                        // Seleccionar los elementos necesarios
                        var es_dni_novio = document.getElementById('es_dni_novio');
                        var es_dni_novia = document.getElementById('es_dni_novia');

                        // Validar si ambos checkboxes están seleccionados
                        if (es_dni_novia.checked && es_dni_novio.checked) {
                            var dni_novio = document.getElementById('dni_novio').value;
                            var nombre_novio = document.getElementById('nombredni_novio').value;

                            var dni_novia = document.getElementById('dni_novia').value;
                            var nombre_novia = document.getElementById('nombredni_novia').value;

                            // Actualizar las opciones dinámicamente
                            responsable.innerHTML = `
                                <option value=""></option>
                                <option value="${dni_novio}">${nombre_novio}</option>
                                <option value="${dni_novia}">${nombre_novia}</option>
                            `;
                            autoSeleccionarComboBoxResponsable('responsable', nombre_novio); // Autoselecciona al novio
                        } else {
                            // Limpiar las opciones si no están seleccionados ambos checkboxes
                            responsable.innerHTML = "";
                        }
                    } else if (document.getElementById('acto_seleccionado').value == 2) {
                        var es_dni_padrino = document.getElementById('es_dni_padrino');
                        var es_dni_madrina = document.getElementById('es_dni_madrina');
                        var es_tutor = document.getElementById('es_dni_tutor');

                        // Validar si todos los checkboxes están seleccionados
                        if (es_dni_padrino.checked && es_dni_madrina.checked && es_tutor.checked) {
                            var dni_padrino = document.getElementById('dni_padrino').value;
                            var nombredni_padrino = document.getElementById('nombredni_padrino').value;

                            var dni_madrina = document.getElementById('dni_madrina').value;
                            var nombredni_madrina = document.getElementById('nombredni_madrina').value;

                            var dni_tutor = document.getElementById('dni_tutor').value;
                            var nombredni_tutor = document.getElementById('nombredni_tutor').value;

                            // Actualizar las opciones dinámicamente
                            responsable.innerHTML = `
                                <option value=""></option>
                                <option value="${dni_padrino}">${nombredni_padrino}</option>
                                <option value="${dni_madrina}">${nombredni_madrina}</option>
                                <option value="${dni_tutor}">${nombredni_tutor}</option>
                            `;
                            autoSeleccionarComboBoxResponsable('responsable', nombredni_padrino); // Autoselecciona al padrino
                        } else {
                            responsable.innerHTML = "";
                        }
                    } else if (document.getElementById('acto_seleccionado').value == 3) {
                        var es_dni_padrino_madrina = document.getElementById('es_dni_padrino_madrina');

                        // Validar si el checkbox está seleccionado
                        if (es_dni_padrino_madrina.checked) {
                            var dni_padrino_madrina = document.getElementById('dni_padrino_madrina').value;
                            var nombredni_padrino_madrina = document.getElementById('nombredni_padrino_madrina').value;

                            // Actualizar las opciones dinámicamente
                            responsable.innerHTML = `
                                <option value=""></option>
                                <option value="${dni_padrino_madrina}">${nombredni_padrino_madrina}</option>
                            `;
                            autoSeleccionarComboBoxResponsable('responsable', nombredni_padrino_madrina); // Autoselecciona padrino/madrina
                        } else {
                            responsable.innerHTML = "";
                        }
                    } else if (document.getElementById('acto_seleccionado').value == 6) {
                        var es_dni_pri_responsable = document.getElementById('es_dni_pri_responsable');

                        // Validar si el checkbox está seleccionado
                        if (es_dni_pri_responsable.checked) {
                            var dni_pri_responsable = document.getElementById('dni_pri_responsable').value;
                            var nombredni_pri_responsable = document.getElementById('nombredni_pri_responsable').value;

                            // Actualizar las opciones dinámicamente
                            responsable.innerHTML = `
                                <option value=""></option>
                                <option value="${dni_pri_responsable}">${nombredni_pri_responsable}</option>
                            `;
                            autoSeleccionarComboBoxResponsable('responsable', nombredni_pri_responsable);
                        } else {
                            responsable.innerHTML = "";
                        }
                    }
                });
        } else {
            dni.readOnly = false;
            nombre.value = "";
            estado.checked = false;
            responsable.innerHTML = "";
        }
    } else if (tipo == 'FechaHora') {
        if (document.getElementById('registrar').textContent == "Registrar") {
            document.getElementById(checkbox).checked = false;
            Toastify({
                text: "Para ingresar una fecha tienes que llevar todas tus charlas",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        } else {
            document.getElementById(checkbox).disabled = false;
            document.getElementById(id).disabled = false;
            var id = document.getElementById('ff').value;
            fetch(`fecha_habil/${id}`)
                .then(response => response.json())
                .then(
                    item => {
                        if (item.estado == true) {

                            document.getElementById(checkbox).disabled = false;
                            document.getElementById(id).readOnly = false;
                        } else {
                            document.getElementById(checkbox).disabled = true;
                            document.getElementById(id).disabled = true;
                            Toastify({
                                text: "Para ingresar una fecha tienes que llevar todas tus charlas",
                                duration: 2000,
                                close: true,
                                backgroundColor: "#dc3545",
                                gravity: "bottom",
                                position: "right",
                            }).showToast();
                        }
                    }
                )
        }
    } else if (tipo == 'Imagen') {
        var archivo = document.getElementById(id).files[0];
        var st = document.getElementById(checkbox);
        if (archivo) {
            st.checked = true;
        } else {
            st.checked = false;
        }
    }
}
function autoSeleccionarComboBoxResponsable(comboBoxId, textoBuscar) {
    const comboBox = document.getElementById(comboBoxId);
    const opciones = Array.from(comboBox.options);
    const opcionSeleccionada = opciones.find(option => option.textContent === textoBuscar);

    if (opcionSeleccionada) {
        comboBox.value = opcionSeleccionada.value; // Seleccionar el valor correspondiente
    } else {
        comboBox.selectedIndex = 0; // Seleccionar la opción por defecto si no encuentra coincidencia
    }
}


function visualizar(id_archivo) {
    const archivo_formulario = document.getElementById(id_archivo).files[0];

    const modal_contenido = document.getElementById('modal_contenido'); // Contenedor del contenido en el modal
    if (archivo_formulario && archivo_formulario.name.length > 0) {
        const objUrl = URL.createObjectURL(archivo_formulario);
        modal_contenido.innerHTML = "";
        if (archivo_formulario.type === 'application/pdf') {
            modal_contenido.innerHTML = `<iframe src="${objUrl}" width="100%" height="800px" style="border:none;"></iframe>`;
        } else if (archivo_formulario.type.startsWith('image/')) {
            modal_contenido.innerHTML = `<img src="${objUrl}" class="img-fluid formulario_imagenes" alt="Previsualización de la imagen">`;
        } else {
            modal_contenido.innerHTML = "Tipo de archivo no soportado.";
        }
        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
    } else {
        // Si no hay archivo en el input, verifica el valor del archivo referenciado
        const src = document.getElementById(`I${id_archivo}`).value; // Usar el valor (value) del archivo referenciado

        console.log(src);  // Verifica lo que contiene el valor

        if (src) {
            // Verifica si el src tiene la ruta completa de la imagen o PDF
            if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.gif')) {
                modal_contenido.innerHTML = `<img src="${src}" class="img-fluid formulario_imagenes" alt="Imagen referenciada">`;
            }
            else if (src.endsWith('.pdf')) {
                modal_contenido.innerHTML = `<iframe src="${src}" width="100%" height="800px" style="border:none;"></iframe>`;
            } else {
                modal_contenido.innerHTML = "Tipo de archivo no soportado.";
            }

            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            myModal.show();
        } else {
            Toastify({
                text: "No se ha encontrado el archivo referenciado.",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    }
}


function precio() {
    var pagos = document.getElementById('pagos');
    var monto = document.getElementById('amount');
    var acto = document.getElementById('acto_seleccionado');
    var acto_liturgico = acto.selectedOptions[0].text;
    var sede = document.getElementById('sede').value;
    var responsable = document.getElementById('responsable').value;

    if (acto_liturgico == 'Matrimonio') {
        var dni1 = document.getElementById('dni_novio').value;
        var dni2 = document.getElementById('dni_novia').value;

        fetch(`/monto_acto/${acto_liturgico}/${sede}/${responsable}/${dni1}/${dni2}`)
            .then(response => response.json())
            .then(element => {
                if (element.estado == "si") {
                    let total = (parseFloat(element.datos.pf_acto) || 0) +
                        (parseFloat(element.datos.pf_sede) || 0) +
                        (parseFloat(element.datos.pf_traslado) || 0);
                    monto.value = total;
                }
                pagos.innerHTML = '';
                pagos.textContent = 'Confirmar pago';
                pagos.readOnly = false;
            })
            .catch(error => {
                console.error('Error:', error);
                monto.value = '';
                pagos.innerHTML = '';
                pagos.readOnly = false;
                pagos.textContent = 'Error al calcular';
            });
    } else if (acto_liturgico == 'Bautismo') {
        fetch(`/montobautismo/${sede}`)
            .then(response => response.json())
            .then(element => {
                if (element.estado == "si") {
                    monto.value = element.datos;
                }
                pagos.innerHTML = '';
                pagos.textContent = 'Confirmar pago';
                pagos.readOnly = false;
            })
            .catch(error => {
                console.error('Error:', error);
                monto.value = '';
                pagos.innerHTML = '';
                pagos.readOnly = false;
                pagos.textContent = 'Error al calcular';
            });
    } else if (acto_liturgico == "Confirmacion") {
        fetch(`/confirmado/${sede}`)
            .then(response => response.json())
            .then(element => {
                if (element.estado == "si") {
                    monto.value = element.datos;
                }
                pagos.innerHTML = '';
                pagos.textContent = 'Confirmar pago';
                pagos.readOnly = false;
            })
            .catch(error => {
                console.error('Error:', error);
                monto.value = '';
                pagos.innerHTML = '';
                pagos.readOnly = false;
                pagos.textContent = 'Error al calcular';
            });
    } else if (acto_liturgico == "Primera comunion") {
        fetch(`/primeracm/${sede}`)
            .then(response => response.json())
            .then(element => {
                if (element.estado == "si") {
                    return element.datos;
                }
                pagos.innerHTML = '';
                pagos.textContent = 'Confirmar pago';
                pagos.readOnly = false;
            })
            .catch(error => {
                console.error('Error:', error);
                monto.value = '';
                pagos.innerHTML = '';
                pagos.readOnly = false;
                pagos.textContent = 'Error al calcular';
            });
    }
}

function validar_precio() {
    var saldo = parseFloat(document.getElementById('saldo').value) || 0;
    var money = parseFloat(document.getElementById('money').value) || 0;
    if (money > saldo) {
        Toastify({
            text: "El monto ingresado es mayor al saldo!",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
        document.getElementById('money').value = saldo;
    }
}


var modal_prevcharlas = new bootstrap.Modal(document.getElementById('modal_prevcharlas'));

function visualizar_calendario(id) {
    modal_prevcharlas.show();

    const tbody = document.getElementById('cu_previ');
    tbody.innerHTML = "";
    const acto = document.getElementById('acto_seleccionado').value;
    const valor_s = document.getElementById(`${id}`).value;

    if (!valor_s) {
        alert("Seleccione una opción!!");
        return;
    }

    let endpoint = "";

    switch (acto) {
        case "1":
            return; // Salimos si no hay lógica para acto 1
        case "2":
            endpoint = `datos_charlas/${valor_s}`;
            break;
        case "3":
            endpoint = `datos_charlas_confirmacion/${valor_s}`;
            break;
        default:
            endpoint = `datos_charlas_comunion/${valor_s}`;
            break;
    }

    fetch(endpoint)
        .then((response) => response.json())
        .then((item) => {
            if (item.mensaje === "Error") {
                Toastify({
                    text: "No se pudo obtener las asistencias",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                return;
            }

            const rows = item.data.map((charla) => `
                    <tr>
                        <td>${charla.descripcion || "Sin descripción"}</td>
                        <td>${charla.fecha || "Sin fecha"}</td>
                        <td>${charla.hora_inicio || "Sin hora de inicio"}</td>
                        <td>${charla.hora_fin || "Sin hora de fin"}</td>
                    </tr>
                `).join("");

            tbody.innerHTML = rows || "<tr><td colspan='4' class='text-center'>No hay datos disponibles</td></tr>";
        })
        .catch((error) => {
            console.error("Error al realizar el fetch:", error);
            Toastify({
                text: "Error al obtener datos",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        });
}

var md_asistencias = new bootstrap.Modal(document.getElementById('modal_asistencia'));
function asistencias(id, acto) {
    md_asistencias.show();
    //limpiamos
    var tbody = document.getElementById('cu_cuerpo');
    tbody.innerHTML = "";

    fetch(`/asistencias_solicitud/${id}`)
        .then(response => response.json())
        .then(item => {
            if (item.estado == "si") {
                item.data.forEach(dt => {
                    console.log(dt);
                    var tr = document.createElement('tr');
                    tr.innerHTML =
                        `
                        <td class="text-center"> ${dt.id_asistencia} </td>
                        <td> ${dt.descripcion}  </td>
                        <td class="text-center"> ${dt.fecha}  </td>
                        <td> ${dt.rol}  </td>
                        <td class="text-center"> ${dt.dni}  </td>
                        <td class="text-center"> ${dt.nombre}  </td>
                        <td class="text-center">
                        <input class="me-1" id="${dt.id_asistencia}" 
                            type="checkbox" 
                            ${dt.estado == 1 ? 'checked disabled' : `onclick="agregar_asistencia(${dt.id_asistencia})"`}>
                        <label for="">${dt.estado == 1 ? '(Asistió)' : '(Falto)'}</label>
                        </td>
                    `
                    tbody.appendChild(tr);
                });
            } else {
                alert("No se encontro las asistencias para esa solicitud");
            }
        })
}

function limpiar() {
    document.getElementById('rp').value = '';
    document.getElementById('rp').classList.add('d-none');

    document.getElementById('responsable').classList.remove('d-none');

    const responsable = document.getElementById('responsable');
    responsable.selectedIndex = 0;
    while (responsable.options.length > 1) {
        responsable.remove(1);
    }

    document.getElementById('responsable').selectedIndex = 0;
    document.getElementById('formaPago').selectedIndex = 0;
    document.getElementById('monto').value = '';
    document.getElementById('saldo').value = '';
    document.getElementById('money').value = '';
    document.getElementById('registrar').textContent = "Registrar";

}
function agregar_asistencia(id) {
    var seleccion = document.getElementById(id);
    if (seleccion.checked == true) {
        seleccion = 1
    } else {
        seleccion = 0;
    }
    fetch(`/check_asistencia/${id}/${seleccion}`)
        .then(response => response.json())
        .then(item => {
            if (item.estado == "correcto") {
                Toastify({
                    text: "Se modifico la asistencia!!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "top",
                    position: "left",
                }).showToast();
            } else {
                Toastify({
                    text: "No se pudo modificar la asistencia!!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545;",
                    gravity: "top",
                    position: "left",
                }).showToast();
            }
        })

}


// function rellenar_formulario(id_solicitud, nombre_liturgia) {
//     limpiar();
//     var select = document.getElementById('acto_seleccionado');
//     var options = select.getElementsByTagName('option');
//     document.getElementById('ff').value = id_solicitud;
//     for (var i = 0; i < options.length; i++) {
//         if (options[i].text === nombre_liturgia) {
//             select.selectedIndex = i;
//             options[i].click();
//             verificar("si");
//             const tabTrigger = new bootstrap.Tab(document.getElementById('solicitudes-tab'));
//             tabTrigger.show();
//             break;
//         }

//     }
//     fetch(`/requisitos_solicitud/${id_solicitud}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.estado == "Correcto") {
//                 data.data.forEach(item => {
//                     const element = fetch(`/requisitos_solicitud/${id_solicitud}`)
//                         .then(response => response.json())
//                         .then(data => {
//                             if (data.estado == "Correcto") {
//                                 data.data.forEach(item => {
//                                     if (item.tipo === "Dni") {
//                                         console.log(`ID del campo: ${item.id_c}`);  // Verifica el ID
//                                         console.log(`Valor a asignar: ${item.valor}`);  // Verifica el valor

//                                         const element = document.getElementById(`${item.id_c}`);
//                                         const estadoElement = document.getElementById(`${item.id_es}`);

//                                         if (element) {
//                                             // Asignar el valor al campo correspondiente
//                                             element.value = item.valor;
//                                             console.log(`Valor asignado a ${item.id_c}: ${element.value}`);
//                                         } else {
//                                             console.error(`No se encuentra el elemento con ID: ${item.id_c}`);
//                                         }

//                                         if (estadoElement && estadoElement.type === "checkbox") {
//                                             estadoElement.checked = item.estado === true || item.estado === "true";
//                                             console.log(`Checkbox (${item.id_es}) actualizado: ${estadoElement.checked}`);

//                                             // Si el checkbox está marcado, simula el clic
//                                             if (estadoElement.checked) {
//                                                 estadoElement.onchange();
//                                                 estadoElement.disabled = true;
//                                             }
//                                         } else if (!estadoElement) {
//                                             console.error(`No se encuentra el elemento con ID: ${item.id_es}`);
//                                         } else {
//                                             console.error(`El elemento con ID ${item.id_es} no es un checkbox`);
//                                         }
//                                     } else if (item.tipo == "Sede") {
//                                         const estadoElement = document.getElementById(`${item.id_es}`);
//                                         estadoElement.checked = true;
//                                         estadoElement.disabled = true;

//                                     } else if (item.tipo == "Charla") {
//                                         const estadoElement = document.getElementById(`${item.id_es}`);
//                                         const element = document.getElementById(`${item.id_c}`);
//                                         estadoElement.checked = item.estado;
//                                         estadoElement.disabled = item.estado;

//                                         element.value = item.valor;
//                                     } else if (item.tipo == "Texto") {
//                                         const estadoElement = document.getElementById(`${item.id_es}`);
//                                         const element = document.getElementById(`${item.id_c}`);
//                                         estadoElement.checked = item.estado;
//                                         estadoElement.disabled = item.estado;
//                                         element.value = item.valor;

//                                         element.value = item.valor;
//                                     } else if (item.tipo == "FechaHora") {
//                                         if (document.getElementById('registrar').textContent != "Registrar") {
//                                             var id = document.getElementById('ff').value;
//                                         }


//                                     } else if (item.tipo == "Imagen") {
//                                         const estadoElement = document.getElementById(`${item.id_es}`);
//                                         const element = document.getElementById(`I${item.id_c}`);
//                                         const element2 = document.getElementById(`${item.id_c}`);

//                                         element2.readOnly = item.estado;
//                                         estadoElement.checked = item.estado;
//                                         estadoElement.readOnly = item.estado;
//                                         element.value = item.valor;

//                                         if (item.estado === true) {
//                                             element2.style.backgroundColor = "var(--bs-primary)";
//                                             element2.style.color = "white";
//                                             element2.disabled = true;
//                                             estadoElement.disabled = true;
//                                         }
//                                     }
//                                 });
//                             }

//                             document.getElementById('monto').value = data.pago.total;
//                             document.getElementById('saldo').value = data.pago.total;
//                             document.getElementById('money').value = data.pago.total;
//                             document.getElementById('formaPago').value = data.pago.forma_pago;
//                             document.getElementById('money').disabled = true;
//                             document.getElementById('formaPago').disabled = true;
//                             document.getElementById('rp').value = data.pago.responsable;
//                             document.getElementById('rp').classList.remove('d-none');

//                             document.getElementById('responsable').classList.add('d-none');

//                         })
//                         .catch(error => {
//                             console.error("Error al obtener los datos:", error);
//                         });
//                 });
//             }
//         })
//         .catch(error => {
//             console.error("Error al obtener los datos:", error);
//         });
//     document.getElementById('registrar').textContent = "Modificar";
// }


function rellenar_formulario(id_solicitud, nombre_liturgia) {
    limpiar();  // Clears the form
    var select = document.getElementById('acto_seleccionado');
    var options = select.getElementsByTagName('option');

    document.getElementById('ff').value = id_solicitud;

    // Select the correct option based on the nombre_liturgia
    for (var i = 0; i < options.length; i++) {
        if (options[i].text === nombre_liturgia) {
            select.selectedIndex = i;
            options[i].click();
            verificar("si");
            const tabTrigger = new bootstrap.Tab(document.getElementById('solicitudes-tab'));
            tabTrigger.show();
            break;
        }
    }

    // Fetch the data related to the request
    fetch(`/requisitos_solicitud/${id_solicitud}`)
        .then(response => response.json())
        .then(data => {
            if (data.estado === "Correcto") {
                data.data.forEach(item => {
                    const element = document.getElementById(`${item.id_c}`);
                    const estadoElement = document.getElementById(`${item.id_es}`);

                    // Handle the field based on item type
                    if (item.tipo === "Dni") {
                        console.log(`ID del campo: ${item.id_c}`);  // Verifica el ID
                        console.log(`Valor a asignar: ${item.valor}`);  // Verifica el valor

                        const element = document.getElementById(`${item.id_c}`);
                        const estadoElement = document.getElementById(`${item.id_es}`);

                        if (element) {
                            // Asignar el valor al campo correspondiente
                            element.value = item.valor;
                            console.log(`Valor asignado a ${item.id_c}: ${element.value}`);
                        } else {
                            console.error(`No se encuentra el elemento con ID: ${item.id_c}`);
                        }

                        if (estadoElement && estadoElement.type === "checkbox") {
                            estadoElement.checked = item.estado === true || item.estado === "true";
                            console.log(`Checkbox (${item.id_es}) actualizado: ${estadoElement.checked}`);

                            // Si el checkbox está marcado, simula el clic
                            if (estadoElement.checked) {
                                estadoElement.onchange();
                                estadoElement.disabled = true;
                            }
                        } else if (!estadoElement) {
                            console.error(`No se encuentra el elemento con ID: ${item.id_es}`);
                        } else {
                            console.error(`El elemento con ID ${item.id_es} no es un checkbox`);
                        }
                    } else if (item.tipo == "Sede") {
                        const estadoElement = document.getElementById(`${item.id_es}`);
                        estadoElement.checked = true;
                        estadoElement.disabled = true;

                    } else if (item.tipo == "Charla") {
                        const estadoElement = document.getElementById(`${item.id_es}`);
                        const element = document.getElementById(`${item.id_c}`);
                        estadoElement.checked = item.estado;
                        estadoElement.disabled = item.estado;

                        element.value = item.valor;
                    } else if (item.tipo == "Texto") {
                        const estadoElement = document.getElementById(`${item.id_es}`);
                        const element = document.getElementById(`${item.id_c}`);
                        estadoElement.checked = item.estado;
                        estadoElement.disabled = item.estado;
                        element.value = item.valor;

                        element.value = item.valor;
                    } else if (item.tipo == "FechaHora") {
                        if (document.getElementById('registrar').textContent != "Registrar") {
                            var id = document.getElementById('ff').value;
                        }
                    }
                });
            } else {
                console.error("Error en la solicitud de requisitos.");
            }
            document.getElementById('monto').value = data.pago.total;
            document.getElementById('saldo').value = data.pago.total;
            document.getElementById('money').value = data.pago.total;
            document.getElementById('formaPago').value = data.pago.forma_pago;
            document.getElementById('money').disabled = true;
            document.getElementById('formaPago').disabled = true;
            document.getElementById('rp').value = data.pago.responsable;
            document.getElementById('rp').classList.remove('d-none');

            document.getElementById('responsable').classList.add('d-none');
        })
        .catch(error => {
            console.error("Error al hacer la solicitud:", error);
        });
}
function validar_fecha_matrimonio(input) {
    const fechaSeleccionada = new Date(input.value);
    const fechaActual = new Date();

    // Comparar solo las fechas, sin las horas
    fechaSeleccionada.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
        Swal.fire({
            icon: 'error',
            title: 'Fecha inválida',
            text: 'La fecha de matrimonio no puede ser anterior al día actual.',
            confirmButtonText: 'Aceptar'
        });
        
        // Limpiar el valor del input
        input.value = '';
    }
}