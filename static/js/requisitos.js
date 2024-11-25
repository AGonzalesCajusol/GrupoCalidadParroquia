const modal = new bootstrap.Modal(document.getElementById('modalactos'));
$(document).ready(function() {
    listar();
});

function listar() {
    const tbody = document.getElementById('cuerpo_actos');

    fetch('/Apilistarrequisitos')
        .then(response => response.json())
        .then(data => {
            // Verificar si DataTable ya está inicializado
            if ($.fn.dataTable.isDataTable('#tablas')) {
                const dataTable = $('#tablas').DataTable();
                dataTable.clear(); // Limpiar datos existentes
                
                // Agregar nuevas filas con los datos
                const rows = data.map(element => [
                    element.id,
                    element.nombre_acto,
                    element.nombre_requisito || 'Ninguno',
                    element.tipo || 'Ninguno',
                    element.estado,
                    element.nivel,
                    `
                    <button class="btn btn-primary btn-sm" title="Ver" onclick="ver(${element.id}, '${element.nombre_acto}', '${element.nombre_requisito}', '${element.tipo}', '${element.estado}', '${element.maximo}', '${element.minimo}', '${element.nivel[0]}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Editar" onclick="modificarw(${element.id_requisito}, ${element.id}, '${element.nombre_acto}', '${element.nombre_requisito}', '${element.tipo}', '${element.estado}', '${element.maximo}', '${element.minimo}', '${element.nivel[0]}')" ${element.id_requisito > 0 ? '' : ''}>
                        <i class="fas fa-edit"></i>
                    </button>
                    ${element.estado === 'Inactivo' ? 
                        `<button class="btn btn-success btn-sm" title="Activar" onclick="activar(${element.id}, ${element.id_requisito})">
                            <i class="bi bi-check-lg"></i>
                        </button>`
                        :
                        `<button class="btn btn-secondary btn-sm" title="Dar de baja" onclick="darbaja(${element.id}, ${element.id_requisito})">
                            <i class="fas fa-ban"></i>
                        </button>`
                    }
                    <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminar(${element.id}, ${element.id_requisito})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    `
                ]);
                dataTable.rows.add(rows).draw(); // Agregar y redibujar los datos
            } else {
                // Inicializar DataTable si no existe
                $('#tablas').DataTable({
                    data: data.map(element => [
                        element.id,
                        element.nombre_acto,
                        element.nombre_requisito || 'Ninguno',
                        element.tipo || 'Ninguno',
                        element.estado,
                        element.nivel,
                        `
                        <button class="btn btn-primary btn-sm" title="Ver" onclick="ver(${element.id}, '${element.nombre_acto}', '${element.nombre_requisito}', '${element.tipo}', '${element.estado}', '${element.maximo}', '${element.minimo}', '${element.nivel[0]}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" title="Editar" onclick="modificarw(${element.id_requisito}, ${element.id}, '${element.nombre_acto}', '${element.nombre_requisito}', '${element.tipo}', '${element.estado}', '${element.maximo}', '${element.minimo}', '${element.nivel[0]}')" ${element.id_requisito > 0 ? '' : ''}>
                            <i class="fas fa-edit"></i>
                        </button>
                        ${element.estado === 'Inactivo' ? 
                            `<button class="btn btn-success btn-sm" title="Activara" onclick="activar(${element.id}, ${element.id_requisito})">
                                <i class="bi bi-check-lg"></i>
                            </button>`
                            :
                            `<button class="btn btn-secondary btn-sm" title="Dar de baja" onclick="darbaja(${element.id}, ${element.id_requisito})">
                                <i class="fas fa-ban"></i>
                            </button>`
                        }
                        <button class="btn btn-danger btn-sm" title="Eliminar" onclick="eliminar(${element.id}, ${element.id_requisito})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        `
                    ]),
                    pageLength: 8,
                    dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
                    language: {
                        search: "Buscar:",
                        searchPlaceholder: "Filtrar registros..."
                    },
                    columnDefs: [
                        { orderable: false, targets: [5] },
                        { targets: [0, 6], className: 'text-center' }
                    ],
                    initComplete: function () {
                        $("div.button-section").html('<button type="button" class="btn btn-success btn-sm mr-2" onclick="abrir_modal(\'agregar\')"><i class="bi bi-plus-circle"></i> Agregar</button>');
                    }
                });
            }
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
    if(tipo == 'agregar'){
        titulo.textContent = "Agregar requisitos a un acto litúrgico";
        boton.textContent = "Agregar";
    }else if(tipo == 'ver'){
        titulo.textContent = "Ver requisito";
        boton.style.display = "none"; 
    }else if(tipo == 'modificar'){
        titulo.textContent = "Modificar requisito";
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
        fetch('/registrarrequisito', {
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
                    text: "Ya existe ese requisito!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
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
                Toastify({
                    text: "Se modificó correctamente!",
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
                    text: "No se puede modificar este requisito!",
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

function ver(id,nombre_acto,nombre_requisito, tipo,estado, maximo,minimo,nivel){
    abrir_modal('ver');
    document.getElementById('nombreLiturgico1').value= id;
    document.getElementById('nombrerequisito').value = nombre_requisito;
    document.getElementById('opciones').value = tipo;
    document.getElementById('nivel').value = nivel;
    document.getElementById('maximo').value = maximo;

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
    var nivel = document.getElementById('nivel');

    if(accion == 'habilitar'){
        name.disabled = false;
        nombrerequisito.disabled = false;
        st.disabled = false;
        opciones.disabled = false;
        maximo.disabled = false;
        minimo.disabled = false;
        nivel.disabled = false;
    }else{
        name.disabled = true;
        nombrerequisito.disabled = true;
        st.disabled = true;
        opciones.disabled = true;
        maximo.disabled = true;
        minimo.disabled = true;
        nivel.disabled = true;
    }

}


function darbaja(id,id_requi){
    fetch(`/darbaja_requisito/${id}/${id_requi}`)
    .then(response => response.json())
    .then(data => {
        if (data.estado === 'Correcto') {
            Toastify({
                text: "Se dio de baja correctamente ese requisito!",
                duration: 2000,
                close: true,
                backgroundColor: "--bs-primary",
                gravity: "bottom",
                position: "right",
            }).showToast(); 
            listar();
        } else {
            Toastify({
                text: "No se pudo dar de baja ese requisito!",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
        }
    });   
}

function activar(id,id_requi){
    fetch(`/activar_requisito/${id}/${id_requi}`)
    .then(response => response.json())
    .then(data => {
        if (data.estado === 'Correcto') {
            Toastify({
                text: "Se activo correctamente ese requisito!",
                duration: 2000,
                close: true,
                backgroundColor: "--bs-primary",
                gravity: "bottom",
                position: "right",
            }).showToast(); 
            listar();
        } else {
            Toastify({
                text: "No se pudo activar ese requisito!",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
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
                    Toastify({
                        text: "Se elimino correctamente ese requisito!",
                        duration: 2000,
                        close: true,
                        backgroundColor: "--bs-primary",
                        gravity: "bottom",
                        position: "right",
                    }).showToast(); 
                    listar();
                } else {
                    alert('No se pudo eliminar el requisito ');
                }
            })
            .catch(error => {
                Toastify({
                    text: "No se puede eliminar ese rquisito porque esta siendo utilizado!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            });
    }
}

function modificarw(id_requisito, id,nombre_acto,nombre_requisito, tipo,estado, maximo,minimo, nivel){
    abrir_modal('modificar');
    document.getElementById('nombreLiturgico1').value= id;
    document.getElementById('nombrerequisito').value = nombre_requisito;
    document.getElementById('opciones').value = tipo;
    document.getElementById('id_r').value = id_requisito;
    document.getElementById('nivel').value = nivel;
    document.getElementById('maximo').value = maximo;
    document.getElementById('minimo').value = minimo;

    var estadof =document.getElementById('estado');
    if(estado == 'Activo'){
        estadof.checked = true;
    }
}