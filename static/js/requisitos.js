const modal = new bootstrap.Modal(document.getElementById('modalactos'));
$(document).ready(function() {
    listar();
});

function listar() {
    const tbody = document.getElementById('cuerpo_actos');

    // Destruir DataTable existente si ya está inicializado
    if ($.fn.dataTable.isDataTable('#tablas')) {
        $('#tablas').DataTable().clear().destroy();
    }

    fetch('/Apilistarrequisitos')
        .then(response => response.json())
        .then(data => {
            tbody.textContent = '';  
            
            data.forEach(element => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${element.id}</td>
                    <td>${element.nombre_acto}</td>
                    <td>${element.nombre_requisito || 'Ninguno'}</td>
                    <td>${element.tipo || 'Ninguno'}</td>
                    <td>${element.estado}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" title="Ver" onclick="ver(${element.id}, '${element.nombre_acto}', '${element.nombre_requisito}', '${element.tipo}', '${element.estado}', '${element.maximo}', '${element.minimo}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" title="Editar" onclick="modificarw(${element.id_requisito}, ${element.id}, '${element.nombre_acto}', '${element.nombre_requisito}', '${element.tipo}', '${element.estado}', '${element.maximo}', '${element.minimo}')" ${element.id_requisito > 0 ? '' : 'disabled'}>
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" title="Dar de baja" onclick="darbaja(${element.id}, ${element.id_requisito})" ${element.estado === 'Inactivo' ? 'disabled' : ''}>
                            <i class="fas fa-ban"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminar(${element.id}, ${element.id_requisito})" ${element.id_requisito > 0 ? '' : 'disabled'}>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);  
            });

            // Inicializar DataTable
            $('#tablas').DataTable({
                paging: false,
                ordering: true,
                info: false,
                searching: true,
                lengthChange: false,
                language: {
                    search: "Buscar:",
                    searchPlaceholder: "Filtrar registros..."
                },
                columnDefs: [
                    { orderable: false, targets: [5] }
                ]
            });
        })
        .catch(error => console.error('Error al listar actos:', error));
}

function abrir_modal(tipo){
    var form = document.getElementById('actos');
    var boton = document.getElementById('btnguardar')
    form.reset();
    boton.style.display = "";

    var titulo = document.getElementById('modalactosLabel');
    modal.show();
    form_elementos('habilitar');
    configuracion();
    if(tipo == 'agregar'){
        titulo.textContent = "Agregar requisitos al acto litúrgico";
        boton.textContent = "Agregar";
    }else if(tipo == 'ver'){
        titulo.textContent = "";
        boton.style.display = "none"; 
    }else if(tipo == 'modificar'){
        titulo.textContent = "Modificar requisito";
        boton.textContent = "Modificar";
    }
}


function configuracion() {
    var variable = document.getElementById('opciones').value;
    var div_conf1 = document.getElementById('cuadro_opciones');

    if (variable == "Numerico" || variable == "Texto") {
        document.getElementById('maximo').value = "";
        document.getElementById('minimo').value = "";
        document.getElementById('maximo').required = true;  // Establece 'required' en true
        document.getElementById('minimo').required = true;  // Establece 'required' en true
        div_conf1.classList.remove('d-none')
    } else {
        document.getElementById('maximo').required = false; 
        document.getElementById('minimo').required = false;  

        div_conf1.classList.add('d-none')
    }
}



function enviar_datos(event){
    const form = document.getElementById('actos');
    const formData = new FormData(form);
    var boton = document.getElementById('btnguardar').textContent;

    if (form.checkValidity() === false) {
        return;
    }
    event.preventDefault();

    if (boton == "Agregar"){
        fetch('/registrarrequisito', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.estado == 'Correcto'){
                alert('Se registro correctamente!');
                modal.hide();
                listar();
            }else{
                alert('Ya existe ese nombre de requisito!');
            }
        });
    }else if (boton == "Modificar"){
        fetch('/modificar_requisito', {
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

function ver(id,nombre_acto,nombre_requisito, tipo,estado, maximo,minimo){
    abrir_modal('ver');
    document.getElementById('nombreLiturgico1').value= id;
    document.getElementById('nombrerequisito').value = nombre_requisito;
    document.getElementById('opciones').value = tipo;
    configuracion();
    document.getElementById('maximo').value = maximo;
    document.getElementById('minimo').value = minimo;

    var estadof =document.getElementById('estado');
    if(estado == 'Activo'){
        estadof.checked = true;
    }
    form_elementos();
}

function form_elementos(accion) {
    var name = document.getElementById('nombreLiturgico1');
    var nombrerequisito = document.getElementById('nombrerequisito');
    var st = document.getElementById('estado');
    var opciones =  document.getElementById('opciones');
    var maximo = document.getElementById('maximo');
    var minimo = document.getElementById('minimo');

    if(accion == 'habilitar'){
        name.disabled = false;
        nombrerequisito.disabled = false;
        st.disabled = false;
        opciones.disabled = false;
        maximo.disabled = false;
        minimo.disabled = false;
    }else{
        name.disabled = true;
        nombrerequisito.disabled = true;
        st.disabled = true;
        opciones.disabled = true;
        maximo.disabled = true;
        minimo.disabled = true;
    }

}


function darbaja(id,id_requi){
    fetch(`/darbaja_requisito/${id}/${id_requi}`)
    .then(response => response.json())
    .then(data => {
        if (data.estado === 'Correcto') {
            listar();
            alert('Se dio de baja correctamente el requisito de ese acto litúrgico.');
        } else {
            alert('No se pudo dar de baja ese requisito');
        }
    });   
}

function eliminar(id_actoliturgico, id_requisito) {
    const estado = confirm('¿Estás seguro de querer eliminar este requisito?');
    if (estado) {
        fetch(`/eliminar_requisito/${id_actoliturgico}/${id_requisito}`)
            .then(response => response.json())
            .then(data => {
                if (data.estado === 'Correcto') {
                    listar();  // Asumiendo que esta función vuelve a cargar la lista
                    alert('Se eliminó el requisito');
                } else {
                    alert('No se pudo eliminar el requisito ');
                }
            })
            .catch(error => {
                alert('Ocurrió un error al intentar eliminar el requisito');
            });
    }
}

function modificarw(id_requisito, id,nombre_acto,nombre_requisito, tipo,estado, maximo,minimo){
    abrir_modal('modificar');
    document.getElementById('nombreLiturgico1').value= id;
    document.getElementById('nombrerequisito').value = nombre_requisito;
    document.getElementById('opciones').value = tipo;
    document.getElementById('id_r').value = id_requisito;
    configuracion();
    document.getElementById('maximo').value = maximo;
    document.getElementById('minimo').value = minimo;

    var estadof =document.getElementById('estado');
    if(estado == 'Activo'){
        estadof.checked = true;
    }
}