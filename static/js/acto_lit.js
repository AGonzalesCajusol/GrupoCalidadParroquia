$(document).ready(function() {
    listar();
});

function listar() {
    const tbody = document.getElementById('cuerpo_actos');
    
    fetch('/Apilistaactos')
        .then(response => response.json())
        .then(data => {
            // Verificar si DataTable ya está inicializado
            if ($.fn.dataTable.isDataTable('#tablas')) {
                const dataTable = $('#tablas').DataTable();
                dataTable.clear(); // Limpiar datos existentes
                const rows = data.map(element => {
                    return [
                        element.id,
                        element.nombre_acto,
                        element.sacramento,
                        element.estado,
                        element.monto,
                        `
                        <button class="btn btn-primary btn-sm" title="Ver" onclick="ver(${element.id}, '${element.nombre_acto}', '${element.sacramento}', '${element.estado}', ${element.monto})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" title="Editar" onclick="modificarw(${element.id}, '${element.nombre_acto}', '${element.sacramento}', '${element.estado}', ${element.monto})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${element.estado == 'Inactivo' ? 
                            `<button type="button" class="btn btn-success btn-sm" title="Activar" onclick="activar(${element.id})">
                                <i class="bi bi-check-lg"></i>
                            </button>`
                            :
                            `<button type="button" class="btn btn-secondary btn-sm" title="Dar de baja" onclick="darbaja(${element.id})">
                                <i class="fas fa-ban"></i>
                            </button>`
                        }
                        <button type="button" class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminar(${element.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        `
                    ];
                });
                dataTable.rows.add(rows).draw(); // Agregar y redibujar los datos
            } else {
                // Inicializar DataTable si no existe
                $('#tablas').DataTable({
                    data: data.map(element => [
                        element.id,
                        element.nombre_acto,
                        element.sacramento,
                        element.estado,
                        element.monto,
                        `
                        <button class="btn btn-primary btn-sm" title="Ver" onclick="ver(${element.id}, '${element.nombre_acto}', '${element.sacramento}', '${element.estado}', ${element.monto})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" title="Editar" onclick="modificarw(${element.id}, '${element.nombre_acto}', '${element.sacramento}', '${element.estado}', ${element.monto})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${element.estado == 'Inactivo' ? 
                            `<button type="button" class="btn btn-success btn-sm" title="Activar" onclick="activar(${element.id})">
                                <i class="bi bi-check-lg"></i>
                            </button>`
                            :
                            `<button type="button" class="btn btn-secondary btn-sm" title="Dar de baja" onclick="darbaja(${element.id})">
                                <i class="fas fa-ban"></i>
                            </button>`
                        }
                        <button type="button" class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminar(${element.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        `
                    ]),
                    destroy: false,
                    pageLength: 8,
                    dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
                    language: {
                        search: "Buscar:",
                        searchPlaceholder: "Filtrar registros..."
                    },
                    columnDefs: [
                        { orderable: false, targets: [5] },
                        { targets: [0, 3, 5], className: 'text-center' },
                        { targets: [4], className: 'text-end' }
                    ],
                    initComplete: function () {
                        $("div.button-section").html('<button type="button" class="btn btn-success btn-sm mr-2" onclick="abrir_modal(\'agregar\')"><i class="bi bi-plus-circle"></i> Agregar acto litúrgico</button>');
                    }
                });
            }
        })
        .catch(error => console.error('Error al listar actos:', error));
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
                text: "No se pudo dar de baja el acto litúrgico",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    });   
}
function activar(id){
    fetch(`/activar_acto/${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.estado === 'Correcto') {
            listar();            
            Toastify({
                text: "Se activo correctamente el estado del acto litúrgico",
                duration: 2000,
                close: true,
                backgroundColor: "--bs-primary",
                gravity: "bottom",
                position: "right",
            }).showToast();
        } else {            
            Toastify({
                text: "No se pudo activar el estado del acto litúrgico",
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

