let datos_pago = '';
function exportarTablaPDF() {
    const tabla = document.getElementById('miTabla');
    const tabla2 = tabla.cloneNode(true); // Clona la tabla existente
    tabla2.id = 'miTablaClonada';

    html2pdf(tabla2, {
        margin: 1,
        filename: 'tabla_excluyendo_columna.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    });
}
function visualizar_calendario(id_fecha) {
    var tbody = document.getElementById('calendario_cuerpo');
    var id_charla = document.getElementById(id_fecha).value;
    fetch(`/calendario_solicitud/${id_charla}`)
        .then(data => data.json())
        .then(item => {
            tbody.innerHTML = '';
            item.forEach(elemento => {
                var tr = document.createElement('tr');

                var tdId = document.createElement('td');
                tdId.textContent = elemento.id;
                tdId.classList.add('ocultar');
                tr.appendChild(tdId);

                var tdDescripcion = document.createElement('td');
                tdDescripcion.textContent = elemento.descripcion;
                tr.appendChild(tdDescripcion);

                var tdFecha = document.createElement('td');
                tdFecha.textContent = elemento.fecha;
                tr.appendChild(tdFecha);

                var tdHoraInicio = document.createElement('td');
                tdHoraInicio.textContent = elemento.hora_inicio;
                tr.appendChild(tdHoraInicio);

                var tdHoraFin = document.createElement('td');
                tdHoraFin.textContent = elemento.hora_fin;
                tr.appendChild(tdHoraFin);

                tbody.appendChild(tr);
            });
        })

    document.getElementById('requi_actos').classList.add("d-none");
    document.getElementById('contenido_calendario_celebracion').classList.remove("d-none");
}
function retornar(){
    document.getElementById('contenido_calendario_celebracion').classList.add("d-none");
    document.getElementById('requi_actos').classList.remove("d-none");
}
function verificar() {
    var id_acto = document.getElementById('acto_seleccionado');
    var requi_actos = document.getElementById('requi_actos');
    if (id_acto.value == "") {
        requi_actos.classList.add("d-none");
    } else {
        listar_formulario(id_acto.value);
        requi_actos.classList.remove("d-none")
    }
}
function visualizar(id_imagen) {
    const imagen_formulario = document.getElementById(id_imagen).files[0];
    const imagen_modal = document.getElementById('imagen_modal');
    if (imagen_formulario.name.length > 0) {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        const objUrl = URL.createObjectURL(imagen_formulario);
        imagen_modal.src = objUrl;
        myModal.show();
    }
}
function listar_formulario(id_acto) {
    const tbody = document.getElementById('datos_solicitud');
    var acto = document.getElementById('acto_seleccionado').value;
    tbody.innerHTML = '';
    fetch(`/requisitosXacto/${id_acto}`)
        .then(response => response.json())
        .then(elemento => {
            elemento.forEach(element=> {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${element.nombre_requisito}</td>
                    <td>
                        ${obtenerInputPorTipo(element.tipo, element.maximo, element.minimo, element.id_requisito, element.nivel)}
                    </td>
                    <td>
                        <input  type="checkbox"  ${element.tipo == "Dni" ? `onclick="validar_dni('${element.id_requisito}', '${element.id_estador}')"` : ''}   name="${element.id_estador}" id="${element.id_estador}" ${element.nivel[0] == 'O' || element.tipo == "Sede" || element.tipo == "Charla" ? 'required' : ''}>
                        <label for="">Validado</label>
                    </td>
                    <td>
                        ${
                            
                            element.tipo === 'Charla' 
                            ? `
                                <button class="btn btn-primary" type="button" onclick="visualizar_calendario('${element.id_requisito}')">
                                    <i class="bi bi-calendar3"></i>
                                </button>
                            `
                            : (element.tipo !== 'Numerico'  && element.tipo !== 'Sede') 
                                ? `
                                    <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar(${element.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                `
                                : ''
                        }
                    </td>
                `;
                tbody.appendChild(tr);

            })
        })
        .catch(error => console.error('Error al listar formulario:', error));
}
let html_opcionescharla = [];
function obtenerInputPorTipo(tipo, maximo, minimo, id, nivel) {
    html_opcionescharla = [];
    const requerido = (nivel === 'O' || id === 'f_matrimonio') ? 'required' : '';

    switch (tipo) {
        case 'Texto':
            return `<input id="${id}" name="${id}" ${requerido}  type="text" maxlength="${maximo}" minlength="${minimo}" class="form-control" placeholder="Ingrese texto">`;
        case 'Dni':
            var maximo = 10**(maximo) -1 ;
            var minimo =10**(minimo-1);
            return `
                <div class="d-flex">
                    <div class="col-5">
                        <input id="${id}" name="${id}"  oninput="desabilitar('es_${id}')" ${requerido} type="number" max="${maximo}" min="${minimo}" class="form-control" placeholder="Ingrese un número">  
                    </div>
                    <div class="col-6">
                        <input type="text" id="Feligres${id}" name="Feligres${id}" class="form-control" placeholder="Nombre del feligres" readonly disabled>
                    </div>
                </div>
            `;
        case 'Imagen':
            return `<input id="${id}" name="${id}" ${requerido} type="file" class="form-control" accept="image/*">`;
        case 'Fecha':

            return `<input id="${id}" name="${id}" ${requerido} type="date" class="form-control">`;
        case 'Hora':
            return `<input id="${id}" name="${id}" ${requerido} type="time" class="form-control">`;
        case 'FechaHora':
            return `<input id="${id}" name="${id}" ${requerido} type="datetime-local" class="form-control">`;
        case 'Charla':
            let html_opcionescharla = ''; // Declara la variable fuera del fetch
            let opciones = '';
            var acto_liturgico = document.getElementById('acto_seleccionado').value;
            
            fetch(`/charlas_rangoaño/${acto_liturgico}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Convertir la respuesta a JSON
                })
                .then(data => {
                    if (data && data.data) {
                        data.data.forEach(element => {
                            opciones += `<option value="${element.id_charla}">${element.charla}</option>`;
                        });
            
                        // Crear el combo de charlas
                        html_opcionescharla = `
                            <select name="" id="${id}" class="form-select w-100" required>
                                ${opciones}
                            </select>
                        `;
                        document.getElementById(`r${id}`).innerHTML = html_opcionescharla;
                    } else {
                        console.error("La respuesta no tiene el formato esperado.");
                    }
                    document.getElementById()
                })
                .catch(error => {
                    console.error("Error al obtener charlas:", error);
                });
            return `<div id="r${id}">${html_opcionescharla}</div>`;

        default:
            var sede = document.getElementById('sede').value;
            return `<input id="${id}" name="${id}" value="${sede}"  type="text" class="form-control" placeholder="Ingrese texto" disabled>`;
    }
}
function enviar_datos(event){
    const form = document.getElementById('formulario_solicitud');
    const formData = new FormData(form);
    var boton = document.getElementById('registrar').textContent;
    var pago = document.getElementById('pago');
    var formulario_solicitud = document.getElementById('div_sol');
    if (form.checkValidity() === false) {
        return;
    }
    event.preventDefault();

    if (boton == "Registrar"){
        pago.classList.remove('d-none')
        formulario_solicitud.classList.add('d-none');
        completar_pago();
    }else{

    }
}
function mostrar_img(tipo){
    var imagen = document.getElementById('imagen_qr');
    var metodo = document.getElementById('metodo');
    switch (tipo) {
        case 'yape':
                metodo.textContent = "yape";
                imagen.src = "/static/img/yape_qr.jpg";
            break;
        case 'plin':
                metodo.textContent = "plin";
                imagen.src = "/static/img/QR_plin.jpg";
            break;
        case 'tarjeta':
            metodo.textContent = "tarjeta";
            imagen.src = "g";
        break;
        default:
                metodo.textContent = "efectivo";
                imagen.src = "";
            break;
    }
    
}
function desabilitar(elemento){
    document.getElementById(elemento).checked = false;
}
function validar_dni(input,estado){
    var dni = document.getElementById(input);
    var estado = document.getElementById(estado)
    if (estado.checked == true){
        fetch(`/validar_dni/${dni.value}`)
        .then(response => {return response.json()})
        .then(element => {
            if(element.estado == "si"){
                dni.disabled = true;
                document.getElementById(`Feligres${dni.id}`).value = element.nombre;
            }else{
                alert("No existe ese feligres");
                dni.disabled = false;
                document.getElementById(`Feligres${dni.id}`).value = "";
                estado.checked = false;
            }
        }
        )
    }else{
        dni.disabled = false;
        document.getElementById(dni).value = "";
    }
}
function completar_pago(){
    var responsable = document.getElementById('responsable');
    var acto = document.getElementById('acto_seleccionado');
    if(acto.selectedOptions[0].text == "Matrimonio"){
        var dni_novio = document.getElementById('dni_novio');
        var dni_novia = document.getElementById('dni_novia');
        var novio = document.getElementById('Feligresdni_novio');
        var novia = document.getElementById('Feligresdni_novia');
        responsable.innerHTML = `
            <option value="${dni_novio.value}">${novio.value}</option>
            <option value="${dni_novia.value}">${novia.value}</option>
        `;    
    }
}
function precio(){
    var pagos= document.getElementById('pagos');
    var monto = document.getElementById('amount');
    var acto = document.getElementById('acto_seleccionado');
    var acto_liturgico = acto.selectedOptions[0].text;
    var sede = document.getElementById('sede').value;
    var responsable = document.getElementById('responsable').value;
    if(acto_liturgico == 'Matrimonio'){
        var dni1 = document.getElementById('dni_novio').value;
        var dni2 = document.getElementById('dni_novia').value;
        pagos.disabled = true;
        pagos.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span class="ms-2">Calculando...</span>
        `;

    fetch(`/monto_acto/${acto_liturgico}/${sede}/${responsable}/${dni1}/${dni2}`)
        .then(response => response.json())
        .then(element => {
            datos_pago = element;

            if (element.estado == "si") {
                let total = (parseFloat(element.datos.pf_acto) || 0) + 
                            (parseFloat(element.datos.pf_sede) || 0) + 
                            (parseFloat(element.datos.pf_traslado) || 0);
                monto.value = total;
            }
            pagos.innerHTML = '';
            pagos.textContent = 'Confirmar pago';
            pagos.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            pagos.innerHTML = '';
            pagos.textContent = 'Error al calcular';
        });}
}

function grabar_solicitud() {
    var id_acto = document.getElementById('acto_seleccionado').value;
    var acto = array_matrimonio();
    var formData = new FormData();

    for (var key in acto) {
        formData.append(key, acto[key]);  // Aquí se añaden tanto archivos como datos de texto
    }

    fetch(`/registrarsolicitud/${id_acto}`, {
        method: 'POST',
        body: formData  // Aquí no se establecen los headers manualmente
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.estado == "Correcto"){
            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
            }).then(() => {
                location.reload();
            });
        }else{
            Swal.fire({
                title: "Cancelado",
                text: "La operación ha sido cancelada.",
                icon: "error", // Cambia a 'error' para mostrar un ícono de error
                confirmButtonText: "Aceptar" // Texto del botón de confirmación
            });
              
        }
    })
    .catch(error => {
        Swal.fire({
            title: "Cancelado",
            text: "La operación ha sido cancelada.",
            icon: "error", // Cambia a 'error' para mostrar un ícono de error
            confirmButtonText: "Aceptar" // Texto del botón de confirmación
          });
          
    });
}


function array_matrimonio() {
    var array = {
        'copia_dninovio': document.getElementById('copia_dninovio').files[0],  // Archivo
        'dni_novio': document.getElementById('dni_novio').value,              // Valor de texto
        'copia_dninovia': document.getElementById('copia_dninovia').files[0],  // Archivo
        'dni_novia': document.getElementById('dni_novia').value,              // Valor de texto
        'dni_testigo1': document.getElementById('dni_testigo1').value,        // Valor de texto
        'dni_testigo2': document.getElementById('dni_testigo2').value,        // Valor de texto
        'sede': document.getElementById('sede').value,                        // Valor de texto
        'f_matrimonio': document.getElementById('f_matrimonio').value,        // Valor de texto
        'consb_novio': document.getElementById('consb_novio').files[0],      // Archivo
        'consc_novio': document.getElementById('consc_novio').files[0],      // Archivo
        'consb_novia': document.getElementById('consb_novia').files[0],      // Archivo
        'consc_novia': document.getElementById('consc_novia').files[0],      // Archivo
        'fc_novio': document.getElementById('fc_novio').files[0],            // Archivo
        'fc_novia': document.getElementById('fc_novia').files[0],            // Archivo
        'fvih_novio': document.getElementById('fvih_novio').files[0],        // Archivo
        'fvih_novia': document.getElementById('fvih_novia').files[0],        // Archivo
        'charlas': document.getElementById('charlas').value,                  // Valor de texto
        //aca empieza lo de divertido los paguitos
        'responsable' : document.getElementById('responsable').value,
        'metodo': document.getElementById('metodo').textContent,
        'sede': document.getElementById('sede').value,
        'es_copia_dninovio': document.getElementById('es_copia_dninovio').checked,
        'es_dni_novio': document.getElementById('es_dni_novio').checked,
        'es_copia_dninovia': document.getElementById('es_copia_dninovia').checked,
        'es_dni_novia': document.getElementById('es_dni_novia').checked,
        'es_dni_testigo1': document.getElementById('es_dni_testigo1').checked,
        'es_dni_testigo2': document.getElementById('es_dni_testigo2').checked,
        'es_sede': document.getElementById('es_sede').checked,
        'es_f_matrimonio': document.getElementById('es_f_matrimonio').checked,
        'es_consb_novio': document.getElementById('es_consb_novio').checked,
        'es_consc_novio': document.getElementById('es_consc_novio').checked,
        'es_consb_novia': document.getElementById('es_consb_novia').checked,
        'es_consc_novia': document.getElementById('es_consc_novia').checked,
        'es_fc_novio': document.getElementById('es_fc_novio').checked,
        'es_fc_novia': document.getElementById('es_fc_novia').checked,
        'es_fvih_novio': document.getElementById('es_fvih_novio').checked,
        'es_fvih_novia': document.getElementById('es_fvih_novia').checked,
        'es_charlas': document.getElementById('es_charlas').checked
    };
    return array;
}

