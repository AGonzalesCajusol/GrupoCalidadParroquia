function openNav() {
    document.getElementById("mySidenav").classList.add('open');
    document.querySelector('.main-content').classList.add('shifted');
    document.getElementById('abrir').style.visibility = 'hidden'; // Ocultar el botón de abrir
}


function closeNav() {
    document.getElementById("mySidenav").classList.remove('open');
    document.querySelector('.main-content').classList.remove('shifted');
    document.getElementById('abrir').style.visibility = 'visible'; // Mostrar el botón de abrir
}

window.onload = function() {
    setTimeout(function() {
        $('#spinner').fadeOut(); // Oculta el spinner con un efecto fadeOut después de 2 segundos
        $('body').removeClass('hidden'); // Muestra el contenido eliminando la clase hidden
    }, 500); // 2000 milisegundos = 2 segundos


};

//MODIFICAR >>>> onclick="return modificar()"
function modificar(e) {
    e.preventDefault();

    iziToast.info({
        title: 'Se va a modificar el registro!',
        timeout: 500,
        onClosed: function () {
            e.target.form.submit();
        }
    });
}

function confirmarEliminacion(e) {
    e.preventDefault();

    Swal.fire({
        title: '¿Deseas ELIMINAR este registro?',
        text: "Esta acción es irreversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Eliminado!',
                'El registro ha sido eliminado.',
                'success'
            ).then((result) => {
                if (result.isConfirmed) {
                    if (e.target.form) {
                        e.target.form.submit();
                    } else {
                        window.location = e.target.href;
                    }
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                'Cancelado',
                'No se realizó ninguna eliminación.',
                'error'
            )
        }
    });
}


//GUARD MOD >>>> onclick="return confirmarModificacion()"
function confirmarModificacion(e) {
    e.preventDefault();
    iziToast.success({
        title: 'Modificación Confirmada!',
        message: 'La modificación ha sido realizada.',
        timeout: 1000,
        onClosed: function () {
            e.target.form.submit();
        }
    });
}

//CANCELAR  >>>> onclick="return confirmarCancelacion()"
function confirmarCancelacion(e) {
    e.preventDefault();

    Swal.fire({
        title: '¿Cancelar Modificación?',
        text: "Esta acción es irreversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar!',
        cancelButtonText: 'No, continuar!',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Cancelado!',
                'No se realizaron modificaciones.',
                'info'
            ).then((result) => {
                if (result.isConfirmed) {
                    window.history.back();
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                'Continuar',
                'Continuando con la modificación.',
                'success'
            )
        }
    });
}

//window.addEventListener( "pageshow", function ( event ) {
   // if ( event.persisted ) {
  //    //window.location.reload();
 //   }
//  });

//GUARDAR   >>>> en el form al lado de: method="post" onsubmit="return validarFormulario()"

function validarFormulario(e) {
    e.preventDefault();

    iziToast.success({
        title: 'REGISTRADO CORRECTAMENTE!!!',
        timeout: 500,
        onClosed: function () {
            document.querySelector('form').submit();
        }
    });
}


//VOLVER   >>>> onclick="return volver()"
function volver(e) {
    e.preventDefault();

    iziToast.info({
        title: 'Redirigiendo a la página anterior...',
        timeout: 500,
        onClosed: function () {
            window.history.back();
        }
    });
}

function finalizar_sesion(){
    document.cookie = "token=; path=/;"; 
    document.cookie = "dni=; path=/;"; 
    document.cookie = "tipo=; path=/;"; 
    document.cookie = "nombre=;path=/; "
    window.location.href = "http://127.0.0.1:5000/";
}



