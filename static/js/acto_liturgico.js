var actos = []
window.onload = function () {
    listar_actosliturgicos();
};

function listar_actosliturgicos() {
    const tbody = document.getElementById('actosBody');
    tbody.innerHTML = ''; 

    fetch('/listar_Todoslosactosliturgicos')
        .then(response => response.json())
        .then(data => {
            if (data.estado === 1) {
                data.data.forEach(elemento => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="text-center">${elemento.id}</td>
                        <td>${elemento.nombreliturgia}</td>
                        <td>${elemento.requisitos}</td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <button class="btn btn-warning btn-sm me-2"
                                    onclick="abrir('modificar', '${elemento.id}', '${elemento.nombreliturgia}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row); // Agrega la fila al tbody
                });

                $('#actosTable').DataTable(); // Asegúrate de tener jQuery y DataTables importados
            } else {
                console.error(data.mensaje); // Muestra mensaje si hay error
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error); // Maneja errores
        });
}

function abrir(accion){
    actos = []
    var myModal = new bootstrap.Modal(document.getElementById('acciones'));
    myModal.show();
    var titulo = document.getElementById('titulo_modal');
    var boton_modal = document.getElementById('accion_modal');
    document.getElementById('nombre_liturgia').value = "";
    var contenedor = document.getElementById('contenido_actos')
    contenedor.textContent = ''

    var div_nombre = document.getElementById('mensaje1');
    div_nombre.textContent = "";

    if (accion == "nuevo"){
        titulo.textContent = "Agrega y Asigna los actos liturgicos";
        boton_modal.textContent = "Guardar";
    }
}

function validar_envio(){
    var nombre = document.getElementById('nombre_liturgia').value;
    var div_nombre = document.getElementById('mensaje1');
    div_nombre.textContent = '';
    var label = document.createElement('label');
    label.id = "label_modal1"; 
    if (nombre.length < 3){
        label.textContent = 'Ingrese valores mayores a 3 caracteres';
        label.style.color = "Red";
        div_nombre.appendChild(label); 
    } else {
        div_nombre.textContent = '';
        //Validamos que no existan duplicados 
        fetch(`/duplicidad/${nombre}`)
        .then(response => response.json())
        .then(data => {
            if (data.name == true){
                div_nombre.textContent = ""
                label.textContent = 'Ya existe ese nombre como acto litúrgico';
                label.style.color = "Red";
                div_nombre.appendChild(label); 
            }else{
                const data = {
                    nombre_liturgia: nombre,  // Cambiar 'nombre' a 'nombre_liturgia'
                    actos: actos               // Cambiar 'datos' a 'actos'
                };
                
                fetch('/insertar_actoliturgico', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)  // Convertir el objeto a JSON
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.respuesta)
                })
            }
        })
    }
}
function agregar(){

    var nombre = document.getElementById('nombre_liturgia').value;
    var div_nombre = document.getElementById('mensaje1');
    div_nombre.textContent = '';
    var label = document.createElement('label');
    var select = document.getElementById('chkselect')
    label.id = "label_modal1"; 
    if (nombre.length < 3){
        label.textContent = 'Ingrese valores mayores a 3 caracteres';
        label.style.color = "Red";
        div_nombre.appendChild(label); 
    }else{
        //aca guardamos todos los datos 
        if(select.value == "Ninguno"){
            var contenedor = document.getElementById('contenido_actos')
            contenedor.textContent = ""
            actos = ['Ninguno']

        }else{
            if (actos.includes('Ninguno')) {
                actos = actos.filter(acto => acto !== 'Ninguno');
            }            
            if (!actos.includes(select.value)){
                actos.push(select.value);
            }
        }
        dibujar()
    }
}

function dibujar(){
    var contenedor = document.getElementById('contenido_actos')
    contenedor.textContent = ''
    actos.forEach(elemento => {
        var label = document.createElement('label');
        var btn1 = document.createElement('button');
        label.classList.add('btn','btn-secondary','me-2', 'mt-2','btn-sm');
        btn1.type = "button";
        btn1.classList.add('me-2','btn-close');
        label.textContent = elemento;
        label.appendChild(btn1);
        contenedor.appendChild(label);
    })
}