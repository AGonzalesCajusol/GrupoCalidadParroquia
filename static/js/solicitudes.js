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


function visualizar_calendario(id_acto) {
    var tbody = document.getElementById('calendario_cuerpo');
    
    fetch(`/calendario_solicitud/${id_acto}`)
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
    id_acto = document.getElementById('acto_seleccionado');
    if (id_acto.value == "") {
        alert("Seleccione un acto litúrgico");
    } else {
        //graficar_formularios(acto_liturgico.value);
        listar_formulario(id_acto.value);
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
                        ${obtenerInputPorTipo(element.tipo, element.maximo, element.minimo, element.id)}
                    </td>
                    <td>
                        <input  onclick="validar_dni(${element.id}, '${element.tipo}' )"   type="checkbox"  name="estado${element.id}" id="estado${element.id}" ${element.tipo == "Numerico" || element.tipo == "Sede"   ? 'required' : ''}>
                        <label for="">Validado</label>
                    </td>
                    <td>
                        ${
                            element.tipo === 'Charla' 
                            ? `
                                <button class="btn btn-primary" type="button" onclick="visualizar_calendario('${acto}')">
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

function obtenerInputPorTipo(tipo, maximo, minimo, id) {


    switch (tipo) {
        case 'Texto':
            return `<input id="${id}" name="input${id}" required  type="text" maxlength="${maximo}" minlength="${minimo}" class="form-control" placeholder="Ingrese texto">`;
        case 'Numerico':
            var maximo = 10**(maximo) -1 ;
            var minimo =10**(minimo-1);
            return `
                <div class="d-flex">
                    <div class="col-5">
                        <input id="${id}" name="input${id}"  oninput="desabilitar('estado${id}')" required type="number" max="${maximo}" min="${minimo}" class="form-control" placeholder="Ingrese un número">  
                    </div>
                    <div class="col-6">
                        <input type="text" id="Feligres${id}" name="Feligres${id}" class="form-control" placeholder="Nombre del feligres" readonly disabled>
                    </div>
                </div>
            `;
        case 'Imagen':
            return `<input id="${id}" name="input${id}"  type="file" class="form-control" accept="image/*">`;
        case 'Fecha':
            return `<input id="${id}" name="input${id}"  type="date" class="form-control">`;
        case 'Hora':
            return `<input id="${id}" name="input${id}"  type="time" class="form-control">`;
        case 'FechaHora':
            return `<input id="${id}" name="input${id}"  type="datetime-local" class="form-control">`;
        case 'Charla':
            return `<textarea id="${id}" name="input${id}"  class="form-control" placeholder="Ingrese detalles de la charla"></textarea>`;
        default:
            var sede = document.getElementById('sede').value;
            return `<input id="${id}" name="input${id}" value="${sede}"  type="text" class="form-control" placeholder="Ingrese texto" disabled>`;
    }
}

function enviar_datos(event){
    const form = document.getElementById('formulario_solicitud');
    const formData = new FormData(form);
    var boton = document.getElementById('registrar').textContent;

    if (form.checkValidity() === false) {
        return;
    }
    event.preventDefault();


    if (boton == "Registrar"){
        modal.show();
    }else if (boton == "Modificar"){
        fetch('/modificaracto1', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.estado == 'Correcto'){
                alert('Se modifico correctamente!');
                modal.hide();
                listar();
            }else{
                alert('No se pudo modificar ese acto!');
            }
        });
    }
}

function desabilitar(elemento){
    document.getElementById(elemento).checked = false;
}

function validar_dni(input, tipo){
    var dni = document.getElementById(input);
    var estado = document.getElementById(`estado${input}`)
    if (tipo === "Sede"){
        
    }else{
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
            document.getElementById(`Feligres${dni.id}`).value = "";
        }
    }


}