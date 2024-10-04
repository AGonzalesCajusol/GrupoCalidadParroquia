var actos = []
$(document).ready(function () {
    var table = $('#actosTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json' // Traducción al español
        },
    });
});
function abrir(accion, id_acto, nombre) {
    var nombre_liturgia = document.getElementById('nombre_liturgia');
    nombre_liturgia.value = "";
    var select = document.getElementById('chkselect')
    select.selectedIndex=0;
    actos = [];
    dibujar();
    var myModal = new bootstrap.Modal(document.getElementById('acciones'));
    myModal.show();

    var titulo = document.getElementById('titulo_modal');
    var boton = document.getElementById('accion_modal');
    var form = document.getElementById('formulario_acto');
    var id = document.getElementById('id_liturgia');
    id.value = id_acto
    

    // Establecer la acción del formulario según la acción solicitada
    if (accion === "nuevo") {
        //form.action = "/insertar_actoliturgico"; // Establece la acción para insertar
        titulo.textContent = "Ingresar Nuevo Acto Litúrgico";
        boton.textContent = "Nuevo";
        form.action = "/insertar_actoliturgico";
    } else {
        nombre_liturgia.value = nombre
        titulo.textContent = "Modificar Acto Litúrgico";
        boton.textContent = "Modificar";
        boton.disabled = true
        fetch(`/retornar_prerequisitosXid/${id_acto}`, {
            method: 'GET',  
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            let lista= data.prerequisitos

            if(lista.length>0){
                lista.forEach((element) =>
                    actos.push(element[0])
            );
                dibujar()
            }else{
                actos = ["Ninguno"]
                dibujar()
            }
            crear_cookie()
            boton.disabled = false
            form.action = "/modificar_actoliturgico";
            document.getElementById('btnn').click
        })
        .catch(error => {
            console.error('Error:', error);  // Manejo de errores
        });

    }
}

function crear_cookie(){
    document.cookie = `seleccion=${encodeURIComponent(JSON.stringify(actos))}`;
}

function añadir(){
    var nombre_liturgia = document.getElementById('nombre_liturgia').value;
    
    var chkselect = document.getElementById('chkselect')
    var acto = chkselect.selectedOptions[0].text;

    if(nombre_liturgia.length <= 2){
        document.getElementById('accion_modal').click();
    } else {
        if (actos.includes(acto)){
        }else{
            actos.push(acto)
            if(acto == "Ninguno" && actos.length >1){
                actos = ['Ninguno']
            }else{
                if(actos.includes('Ninguno') && actos.length>1){
                    var indice = actos.indexOf('Ninguno')
                    actos.splice(indice,1)
                } 
            }
            dibujar()
        }  
    }    
}


function dibujar(){
    crear_cookie();
    var padre = document.getElementById('contenido_actos');
    padre.textContent = "";
    actos.forEach(element => {
        var label = document.createElement('label');
        var btn1 = document.createElement('button');
        label.classList.add('btn','btn-secondary','me-2', 'mt-2');
        btn1.type = "button";
        btn1.classList.add('me-2','btn-close');
        label.textContent = element;
        btn1.onclick = function(){
            var indice = actos.indexOf(element);
            actos.splice(indice, 1);
            dibujar();
        }
        label.appendChild(btn1);
        padre.appendChild(label);
    });
}
