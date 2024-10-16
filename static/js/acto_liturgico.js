var actos = []
window.onload = function () {
    listar();
    listar();
    listar();
};

function abrir(accion, id,nombre, requisito,monto){
    actos = []
    var myModal = new bootstrap.Modal(document.getElementById('acciones'));
    var titulo = document.getElementById('titulo_modal');
    var boton_modal = document.getElementById('accion_modal');
    boton_modal.style.display = "block"; 

    document.getElementById('nombre_liturgia').value = "";
    document.getElementById('monto_liturgia').value = "0.00";
    document.getElementById('monto_liturgia').disabled = false;
    document.getElementById('nombre_liturgia').disabled = false;
    document.getElementById('asignar_requisitos').style.removeProperty('display');

    //Limpiamos los campos
    var contenedor = document.getElementById('contenido_actos')
    contenedor.textContent = ''
    var div_nombre1 = document.getElementById('mensaje1');
    div_nombre1.textContent = "";
    var div_nombre2 = document.getElementById('mensaje2');
    div_nombre2.textContent = "";
    var div_nombre3 = document.getElementById('mensaje3');
    div_nombre3.textContent = "";
    document.getElementById('requisito').value = ""; 

    if (accion == "nuevo"){
        myModal.show();

        titulo.textContent = "Agrega y Asigna los actos liturgicos";
        boton_modal.textContent = "Guardar";
    }else if( accion == "modificar"){
        myModal.show();

        titulo.textContent = "Modificar y Asigna los actos liturgicos";
        boton_modal.textContent = "Modificar";  
        fetch(`/actoporid/${id}`)
        .then(response => response.json())
        .then(elemento => {
            console.log(elemento)
            document.getElementById('clave').value = id;
            document.getElementById('nombre_liturgia').value = elemento.nombre;
            document.getElementById('monto_liturgia').value = elemento.monto;
            actos = elemento.requisito;
            console.log()
            if (actos[0] == 'Ninguno'){
                actos = []
            }
            dibujar();
            
        })
    }else if(accion == "ver"){
        myModal.show();
        document.getElementById('asignar_requisitos').style.setProperty('display', 'none', 'important');
        boton_modal.style.display = "none"; 
        titulo.textContent = "Visualizar acto litúrgico con sus requisitos";
        document.getElementById('nombre_liturgia').value = nombre;
        document.getElementById('nombre_liturgia').disabled = true;
        document.getElementById('monto_liturgia').value = monto;
        document.getElementById('monto_liturgia').disabled = true;
        contenedor.textContent = requisito;
    }else if(accion == "eliminar"){
        const resultado = confirm("¿Estás seguro de que deseas eliminar este acto litúrgico con sus requisitos?");
        if (resultado) {
            fetch(`/eliminaracto_requisitos/${id}`)
            .then(data => data.json())
            .then(elemento =>{
                if(elemento.resultado = true){
                    alert("Se elimino correctamente!!");
                    listar();
                }else{
                    alert("No se pudo eliminar debido a que existen que se relacionan")
                }
            }
            )
        }
    }
}

function validar_envio(boton) {
    // Limpiamos los mensajes de error anteriores
    var div_mensaje1 = document.getElementById('mensaje1');
    var div_mensaje3 = document.getElementById('mensaje3');
    var div_mensaje2 = document.getElementById('contenido_actos');

    div_mensaje1.textContent = '';
    div_mensaje3.textContent = '';
    var r = document.getElementById('requisito');

    var label = document.createElement('label');
    var nombre_acto = document.getElementById('nombre_liturgia').value;
    var monto = document.getElementById('monto_liturgia');
    var valor = monto.value;
    var formato = /^\d+(\.\d{1,2})?$/; // Formato válido para el monto
    var error = false; // Variable para rastrear errores

    // Validación del nombre del acto
    if (nombre_acto.length < 4) {
        label.textContent = 'Ingrese valores mayores a 3 caracteres';
        label.style.color = "Red";
        div_mensaje1.appendChild(label);
        error = true; // Marcamos que hay un error
    }

    if(valor == ''){
        monto.value = '0.00';
    }
    // Validación del monto
    if (!formato.test(valor)) {
        label = document.createElement('label');
        label.textContent = 'Ingrese un monto válido (hasta 2 decimales)';
        label.style.color = "Red";
        div_mensaje3.appendChild(label);
        monto.value = '0.00';
        error = true; // Marcamos que hay un error
    }
    // Si hay errores, no continuamos
    if (error) {
        return; // Salimos de la función
    }

    // Lógica para guardar o modificar
    if (boton.textContent === "Guardar") {
        const datos = {
            acto: nombre_acto,
            requisitos: actos,
            monto: valor
        };
        fetch('/registrarActoLiturgico_Requisitos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)  // Convertir el objeto a JSON
        }).then(response => {
            return response.json()
        }).then(response => {

            if (response.estado == true){
                var alerta = document.getElementById('alert-ok');
                alerta.style.display = "block";
                limpiar();
                listar();
                setTimeout(function() {
                    alerta.style.display = "none";
                }, 3000);
            }else{
                var alerta = document.getElementById('alert-no');
                alerta.style.display = "block";
                setTimeout(function() {
                    alerta.style.display = "none";
                }, 3000);
            }
        })
        .catch(error => {
            div_mensaje1.textContent = "";
            label.textContent = 'Ya existe el acto liúrgico';
            label.style.color = "Red";
            div_mensaje1.appendChild(label);
        });
    } else if (boton.textContent === "Modificar") {
        var ids= document.getElementById('clave').value
        const datos = {
            acto: nombre_acto,
            requisitos: actos,
            monto: valor,
            id: ids
        }; 
        fetch('/modificarActoPrerequisito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)  // Convertir el objeto a JSON
        }).then(response => {
            return response.json()
        }).then(response => {
            if (response){
                var alerta = document.getElementById('alert-ok');
                var mensaje = document.getElementById('mensaje_ok');
                mensaje = "Se modifico correctamente"
                alerta.style.display = "block";
                limpiar();
                listar();
                $('#acciones').modal('hide');
                setTimeout(function() {
                    alerta.style.display = "none";
                }, 3000);
            }else{
                var mensaje = document.getElementById('mensaje_no');
                mensaje = "No se pudo modificar"
                var alerta = document.getElementById('alert-no')
                alerta.style.display = "block"
                setTimeout(function() {
                    alerta.style.display = "none";
                }, 3000);
            }
        })
        .catch(error => {

        });
    }
}

function limpiar(){
    document.getElementById('nombre_liturgia').value = "";
    document.getElementById('monto_liturgia').value = "0.00";
    document.getElementById('requisito').value = "";
    document.getElementById('contenido_actos').textContent = '';
    actos = []
}


function agregar() {
    // Obtenemos los campos de los elementos a validar
    var nombre_acto = document.getElementById('nombre_liturgia').value;
    var div_mensaje1 = document.getElementById('mensaje1');
    var r = document.getElementById('requisito');
    var requisito = r.value;
    var div_mensaje2 = document.getElementById('mensaje2');

    // Limpiamos los campos de mensajes anteriores
    div_mensaje1.textContent = "";
    div_mensaje2.textContent = "";

    // Variable para ver si hay errores
    var error = false;

    // Validación del campo nombre_acto
    if (nombre_acto.length < 4) {
        var label1 = document.createElement('label');
        label1.textContent = 'Ingrese valores mayores a 3 caracteres para el nombre del acto litúrgico';
        label1.style.color = "Red";
        div_mensaje1.appendChild(label1);
        error = true;
    }

    // Validación del campo requisito
    if (requisito.length < 3) {
        var label2 = document.createElement('label');
        label2.textContent = 'Ingrese valores de requisitos mayores a 2 caracteres';
        label2.style.color = "Red";
        div_mensaje2.appendChild(label2);
        error = true;
    }

    // Si no hubo errores, agregar el requisito a la lista y limpiar el campo
    if (!error) {
        actos.push(requisito);
        r.value = ""; // Limpiar el campo de requisitos
        div_mensaje1.textContent = ""; // Limpiar mensajes previos
        div_mensaje2.textContent = "";
        dibujar();
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
        btn1.onclick = function(){
            eliminar(this)
        }
        label.appendChild(btn1);
        contenedor.appendChild(label);
    })
}


function eliminar(elemento) {
    var requisito_eliminar = elemento.parentNode.textContent;
    if (actos.includes(requisito_eliminar)){
        var indice_elemento = actos.indexOf(requisito_eliminar);
        actos.splice(indice_elemento,1);
    }
    dibujar();
}

function listar() {
    var tbody = document.getElementById('actosBody');
 
    
    // Destruir DataTable si ya está inicializado
    if ($.fn.DataTable.isDataTable('#actosTable')) {
        $('#actosTable').DataTable().destroy();
    }

    fetch('/lista_actos_requisitos')
        .then(response => response.json())
        .then(elemento => {
            tbody = "";

            elemento.forEach(elemento => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="text-center">${elemento.id}</td>
                    <td>${elemento.nombre}</td>
                    <td>${elemento.requisito}</td>
                    <td>${elemento.monto}</td>
                    <td>
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-primary btn-sm" title="Ver"
                                onclick="abrir('ver', '${elemento.id}', '${elemento.nombre}', '${elemento.requisito}', '${elemento.monto}')">
                                <i class="fas fa-eye"></i>
                            </button>

                            <button class="btn btn-warning btn-sm"
                                onclick="abrir('modificar', '${elemento.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" title="Eliminar"
                                onclick="abrir('eliminar', '${elemento.id}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row); // Agregar la fila al tbody
            });

            // Inicializar DataTable después de agregar las filas
            $('#actosTable').DataTable();

            console.log('Tabla actualizada correctamente');
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);  // Manejar errores
        });
}


