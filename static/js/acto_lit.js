$(document).ready(function() {
    listar();
});

function listar() {
    const tbody = document.getElementById('cuerpo_actos');
    
    if ($.fn.dataTable.isDataTable('#tablas')) {
        $('#tablas').DataTable().clear(); 
        $('#tablas').DataTable().destroy(); 
    }
    

    
    fetch('/Apilistaactos')
        .then(response => {
            return response.json();
        })
        .then(data => {
            tbody.textContent = '';  
                data.forEach(element => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td> ${element.id} </td>
                    <td> ${element.nombre_acto} </td>
                    <td> ${element.sacramento}</td>
                    <td> ${element.estado}</td>
                    <td> ${element.monto}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" title="Ver" onclick="ver( ${element.id}, '${element.nombre_acto}', '${element.sacramento}', '${element.estado}', ${element.monto})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" title="Editar" onclick="modificarw( ${element.id}, '${element.nombre_acto}', '${element.sacramento}', '${element.estado}', ${element.monto})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" title="Dar de baja" onclick="darbaja(${element.id})"  ${element.estado == 'Inactivo' ? 'disabled' : ''} ">
                            <i class="fas fa-ban"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminar(${element.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            console.log('Tabla antes de destruir:', $.fn.dataTable.isDataTable('#tablas'));



            $('#tablas').DataTable({
                destroy:    true,
                pageLength: 8,
                dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
                language: {
                    search: "Buscar:",
                    searchPlaceholder: "Filtrar registros..."
                },
                columnDefs: [
                    { orderable: false, targets: [5] },
                    { targets: [0, 3, 5], className: 'text-center' },  // Alineación centrada
                    { targets: [4], className: 'text-end' }
                ],
                initComplete: function () {
                    // Insertar el botón "Agregar" dinámicamente
                    $("div.button-section").html('<button type="button" class="btn btn-success btn-sm mr-2" onclick="abrir_modal(\'agregar\')"><i class="bi bi-plus-circle"></i> Agregar acto litúrgico</button>');
                }
            });
        })
        .catch(error => console.error('Error al listar actos:', error)); // Manejo de errores
}

const modal = new bootstrap.Modal(document.getElementById('modalactos'));


function abrir_modal(tipo){
    var form = document.getElementById('actos');
    var boton = document.getElementById('btnguardar')
    form.reset();
    boton.style.display = "";

    var titulo = document.getElementById('modalactosLabel');
    modal.show();

    if(tipo == 'agregar'){
        form_elementos('habilitar');
        titulo.textContent = "Agregar acto litúrgico";
        boton.textContent = "Agregar";
    }else if(tipo == 'ver'){
        titulo.textContent = "";
        boton.style.display = "none"; 
    }else if(tipo == 'modificar'){
        form_elementos('habilitar');
        titulo.textContent = "Modificar acto litúrgico";
        boton.textContent = "Modificar";
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
        fetch('/registraractoliturgico1', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.estado == 'Correcto'){                
                Toastify({
                    text: "Se registro correctamente!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                modal.hide();
                listar();
            }else{                
                Toastify({
                    text: "Ya existe ese acto litúrgico!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        });
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
                Toastify({
                    text: "Se modifico correctamente!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
                modal.hide();
                listar();
                modal.hide();
                listar();
            }else{                
                Toastify({
                    text: "No se pudo modificar ese acto!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        });
    }
}

//funciones
function eliminar(id){
    estado = confirm('¿Estás seguro de querer eliminar este acto litúrgico?');
    if (estado) {
        // Lógica para eliminar el acto litúrgico, como hacer una petición a la API
        fetch(`/eliminar_acto/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.estado == 'Correcto') {
                listar();                  
                Toastify({
                    text: "Se eliminó el acto litúrgico",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();

            } else {                
                Toastify({
                    text: "No se pudo eliminar el acto litúrgico",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        });
        
    }
}

function darbaja(id){
    fetch(`/darbaja_acto/${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.estado === 'Correcto') {
            listar();            
            Toastify({
                text: "Se dio de baja correctamente el acto litúrgico",
                duration: 2000,
                close: true,
                backgroundColor: "--bs-primary",
                gravity: "bottom",
                position: "right",
            }).showToast();
        } else {            
            Toastify({
                text: "No se pudo dar de baha el acto litúrgico",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    });   
}

function ver(id,nombre,tipo,estado,monto){
    abrir_modal('ver');
    document.getElementById('id_f').value = id;
    document.getElementById('nombreLiturgico').value = nombre;
    document.getElementById('montoFijo').value = monto;
    var estadof =   document.getElementById('estado');
    var tipof = document.getElementById('tipo');

    if (tipo == 'Sacramento'){
        tipof.checked = true;
    }

    if(estado == 'Activo'){
        estadof.checked = true;
    }
    form_elementos();
}

function form_elementos(accion) {
    var name = document.getElementById('nombreLiturgico');
    var mnt = document.getElementById('montoFijo');
    var st = document.getElementById('estado');
    var tip =  document.getElementById('tipo');

    if(accion == 'habilitar'){
        name.disabled = false;
        mnt.disabled = false;
        st.disabled = false;
        tip.disabled = false;
    }else{
        name.disabled = true;
        mnt.disabled = true;
        st.disabled = true;
        tip.disabled = true;
    }

}


function modificarw(id,nombre,tipo,estado,monto){
    abrir_modal('modificar');
    document.getElementById('id_f').value = id;
    document.getElementById('nombreLiturgico').value = nombre;
    document.getElementById('montoFijo').value = monto;
    var estadof =   document.getElementById('estado');
    var tipof = document.getElementById('tipo');

    if (tipo == 'Sacramento'){
        tipof.checked = true;
    }

    if(estado == 'Activo'){
        estadof.checked = true;
    }

}

