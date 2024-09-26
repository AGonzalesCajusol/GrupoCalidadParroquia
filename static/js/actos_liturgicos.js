function abrir(accion, id, nombre) {
    var myModal = new bootstrap.Modal(document.getElementById('acciones'));
    myModal.show();
    var titulo = document.getElementById('titulo_modal')
    var boton = document.getElementById('accion_modal')
    var nombre_liturgia = document.getElementById('nombre_liturgia')
    var nombre_prerequisito = document.getElementById('nombre_prerequisito')
    var pre = document.getElementById('prere').value
    console.log(pre)
    if(accion == "modificar"){
        titulo.textContent = "Modificar Acto Liturgico"
        boton.textContent = "Modificar"
        nombre_liturgia.value = nombre
        
    }else{
        nombre_prerequisito.value = "";
        titulo.textContent = "Ingresar Nuevo Acto Liturgico"
        boton.textContent = "Nuevo"
    }


}