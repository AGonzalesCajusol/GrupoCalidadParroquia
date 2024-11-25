document.addEventListener('show.bs.tab', function (event){
    if(event.target.id == 'requisitos-tab'){
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


function verificar(){
    var acto_liturgico = document.getElementById('acto_seleccionado').value;
    if (acto_liturgico == ""){
        Toastify({
            text: "Selecciona un acto litúrgico",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    }else{
        const tbody = document.getElementById('datos_solicitud');

        fetch(`/requisitosXacto/${acto_liturgico}`)
        .then(response => response.json())
        .then(data => {
            tbody.innerHTML = '';  // Limpiar el tbody antes de agregar nuevas filas
            data.forEach(item => {
                const row = document.createElement('tr');
                var requerido = ""
                if(item.nivel == "O" ){
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
                        ${retornar_input(item.tipo, item.id_requisito,item.nivel)}
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
            if(acto_liturgico == 1){
                document.getElementById('formulario_solicitud').action = "registrar_solicitud_matrimonio";
            }else if(acto_liturgico == 2){
                document.getElementById('formulario_solicitud').action = "registrar_solicitud_bautismo";
            }else if(acto_liturgico == 3){
                document.getElementById('formulario_solicitud').action = "registrar_solicitud_Confirmacion";
            }else if(acto_liturgico == 6){
                document.getElementById('formulario_solicitud').action = "registrar_solicitud_Pcomunion";
            }
            limpiar();
        })
    }
}

function retornar_input(tipo,id,nivel){
    var sede = document.getElementById('sede').value;
    var requerido = "";
    var id_acto = document.getElementById('acto_seleccionado').value;
    if(nivel == "O" ){
        requerido = "";
    }
    //101,139

    switch (tipo) {
        case 'Imagen':
            return `
                <input  name="${id}" id="${id}" ${requerido} type="file" class="form-control form-control-sm" accept="image/*,application/pdf">
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
            if(id_acto == 2){
                fetch('/fcelebraciones/2')
                .then(data =>  data.json())
                .then( item => {
                    if(item.data == "Error" || item.data == ""){
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
                    }else{
                        document.getElementById(`${id}`).innerHTML += "";

                        item.data.forEach(v => {
                            document.getElementById(`${id}`).innerHTML +=  `<option value="${v.id_charla}">${v.charla}</option>`;
                           
                        });
                    }
                }) 
            }else if(id_acto == 3){
                fetch('/fcelebraciones/3')
                .then(data =>  data.json())
                .then( item => {
                    if(item.data == "Error" || item.data == ""){
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
                    }else{
                        document.getElementById(`${id}`).innerHTML += "";

                        item.data.forEach(v => {
                            document.getElementById(`${id}`).innerHTML +=  `<option value="${v.id_charla}">${v.charla}</option>`;
                           
                        });
                    }
                }) 
            }else if(id_acto == 6){
                fetch('/fcelebraciones/6')
                .then(data =>  data.json())
                .then( item => {
                    if(item.data == "Error" || item.data == ""){
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
                    }else{
                        document.getElementById(`${id}`).innerHTML += "";

                        item.data.forEach(v => {
                            document.getElementById(`${id}`).innerHTML +=  `<option value="${v.id_charla}">${v.charla}</option>`;
                           
                        });
                    }
                }) 
            }
            return select;
            case 'Texto':
                return '<input name="${id}"  id="${id}" ${requerido} type="text" class="form-control form-control-sm" readOnly></input>';  
    }
}

function validar_campos(tipo,id,checkbox){
    if (tipo == 'Dni'){
        var dni = document.getElementById(id);
        var variable = 'nombre' + id;
        var nombre = document.getElementById(variable);
        var st = document.getElementById(checkbox);
        var estado = st.checked;

        var responsable = document.getElementById('responsable');

        if(dni.value.length != 8 && estado){
            Toastify({
                text: "Ingrese los campos completos del DNI!!",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
            st.checked = false;

        }else if (estado){
            fetch(`/validar_dni/${dni.value}`)
            .then(response => {return response.json()})
            .then(element => {
                if(element.estado == "si"){
                    dni.readOnly = true;  // Hacemos que el campo sea solo lectura
                    nombre.value = element.nombre; // Asignamos el valor al campo 'nombre'
                }else{
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

                if(document.getElementById('acto_seleccionado').value == 1){
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
                    } else {
                        // Limpiar las opciones si no están seleccionados ambos checkboxes
                        responsable.innerHTML = "";
                    }
                }else if(document.getElementById('acto_seleccionado').value == 2){
                    var es_dni_padrino = document.getElementById('es_dni_padrino');
                    var es_dni_madrina = document.getElementById('es_dni_madrina');
                    var es_tutor = document.getElementById('es_dni_tutor');
            
                    // Validar si ambos checkboxes están seleccionados
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
                    } else {
                        responsable.innerHTML = "";
                    }
                }else if(document.getElementById('acto_seleccionado').value == 3){

                    var es_dni_padrino_madrina = document.getElementById('es_dni_padrino_madrina');
            
                    // Validar si ambos checkboxes están seleccionados
                    if (es_dni_padrino_madrina.checked) {

                        var dni_padrino_madrina = document.getElementById('dni_padrino_madrina').value;
                        var nombredni_padrino_madrina = document.getElementById('nombredni_padrino_madrina').value;
            
                        // Actualizar las opciones dinámicamente
                        responsable.innerHTML = `
                            <option value=""></option>
                            <option value="${dni_padrino_madrina}">${nombredni_padrino_madrina}</option>
                        `;
                    } else {
                        responsable.innerHTML = "";
                    }
                }else if(document.getElementById('acto_seleccionado').value == 6){

                    var es_dni_pri_responsable = document.getElementById('es_dni_pri_responsable');
            
                    // Validar si ambos checkboxes están seleccionados
                    if (es_dni_pri_responsable.checked) {

                        var dni_pri_responsable = document.getElementById('dni_pri_responsable').value;
                        var nombredni_pri_responsable = document.getElementById('nombredni_pri_responsable').value;
            
                        // Actualizar las opciones dinámicamente
                        responsable.innerHTML = `
                            <option value=""></option>
                            <option value="${dni_pri_responsable}">${nombredni_pri_responsable}</option>
                        `;
                    } else {
                        responsable.innerHTML = "";
                    }
                }
            })
        }else{
            dni.readOnly = false;
            nombre.value = ""; 
            estado.checked = false;
            responsable.innerHTML = "";

        }
    }else if(tipo == 'FechaHora'){
        document.getElementById(checkbox).checked = false;
        Toastify({
            text: "Para ingresar una fecha tienes que llevar todas tus charlas",
            duration: 2000,
            close: true,
            backgroundColor: "#dc3545",
            gravity: "bottom",
            position: "right",
        }).showToast();
    }else if(tipo == 'Imagen'){
        var archivo = document.getElementById(id).files[0];
        var st = document.getElementById(checkbox);
        if (archivo){
            st.checked = true;
        }else{
            st.checked = false;
        }

    }
    


}


function visualizar(id_archivo) {
    const archivo_formulario = document.getElementById(id_archivo).files[0];
    const modal_contenido = document.getElementById('modal_contenido');
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
    }else{
        const src = document.getElementById(id_archivo).name; 
        if (src) {
            // Verifica si es una imagen
            if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.gif')) {
                modal_contenido.innerHTML = `<img src="${src}" class="img-fluid formulario_imagenes" alt="Imagen referenciada">`;
            }
            // Verifica si es un PDF
            else if (src.endsWith('.pdf')) {
                modal_contenido.innerHTML = `<iframe src="${src}" width="100%" height="800px" style="border:none;"></iframe>`;
            } 
            else {
                modal_contenido.innerHTML = "Tipo de archivo no soportado.";
            }

            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            myModal.show();
        }else{
            Toastify({
                text: "Aún no ha sudido ninguna imagen/pdf",
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
        document.getElementById('money').value= saldo;
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
    function asistencias(id,acto){
        md_asistencias.show();
        //limpiamos
        var tbody = document.getElementById('cu_cuerpo');
        tbody.innerHTML = "";

        fetch(`/asistencias_solicitud/${id}`)
        .then(response => response.json())
        .then(item => {
            if (item.estado == "si"){
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
                        <label for="">${ dt.estado == 1 ? '(Asistió)' : '(Falto)' }</label>
                        </td>
                    `
                    tbody.appendChild(tr);
                });
            }else{
                alert("No se encontro las asistencias para esa solicitud");
            }
        })
    }

    function limpiar() {

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

    }
    function agregar_asistencia(id){
        var seleccion = document.getElementById(id);
        if (seleccion.checked == true){
            seleccion = 1
        }else{
            seleccion = 0;
        }
        fetch(`/check_asistencia/${id}/${seleccion}`)
        .then(response => response.json())
        .then(item =>{
            if (item.estado == "correcto"){
                Toastify({
                    text: "Se modifico la asistencia!!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "top",
                    position: "left",
                }).showToast();
            }else{
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