// Validación para Nombre de la Sede
document.getElementById('nombre_sede').addEventListener('input', function () {
    const nombreSede = this.value.trim();  // Elimina espacios en blanco al inicio y al final
    if (nombreSede === '') {
        this.setCustomValidity('El nombre de la sede no puede estar vacío ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});

// Validación para Dirección
document.getElementById('direccion').addEventListener('input', function () {
    const direccion = this.value.trim();  // Elimina espacios en blanco al inicio y al final
    if (direccion === '') {
        this.setCustomValidity('La dirección no puede estar vacía ni contener solo espacios en blanco.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});

//validacion fecha
document.addEventListener('DOMContentLoaded', function () {
    const inputFecha = document.getElementById('creacion');

    // Establecer la fecha máxima (hoy) en el campo de fecha
    const today = new Date().toISOString().split('T')[0];  // Formato YYYY-MM-DD
    inputFecha.setAttribute('max', today);

    // Bloquear la entrada manual en el campo de fecha
    inputFecha.addEventListener('keydown', function (e) {
        e.preventDefault();  // Evita cualquier entrada manual
    });

    // Validar la fecha al seleccionarla
    inputFecha.addEventListener('input', function () {
        const selectedDate = new Date(this.value);
        const currentDate = new Date();

        // Si la fecha seleccionada es mayor a la fecha actual, mostrar un error
        if (selectedDate > currentDate) {
            this.setCustomValidity('La fecha no puede ser mayor a la fecha actual.');
        } else {
            this.setCustomValidity('');  // Limpia el error si la fecha es válida
        }
    });
});

// Validación para Teléfono
const inputTelefono = document.getElementById('telefono');

inputTelefono.addEventListener('input', function () {
    const telefono = this.value.trim();
    const regexTelefono = /^[1-9][0-9]{8}$/;  // Asegura que el primer dígito sea mayor a 0 y que sean 9 dígitos numéricos

    if (!regexTelefono.test(telefono)) {
        this.setCustomValidity('El teléfono debe tener 9 dígitos y no puede comenzar con 0.');
    } else {
        this.setCustomValidity('');  // Elimina el mensaje de error si el valor es válido
    }
});

// Evitar la escritura de letras y permitir solo números
inputTelefono.addEventListener('keydown', function (e) {
    // Permitir solo teclas numéricas, tecla de retroceso, suprimir, tabulador y flechas
    if (
        (e.key >= '0' && e.key <= '9') ||  // Permite números
        e.key === 'Backspace' ||           // Permite retroceso
        e.key === 'Delete' ||              // Permite suprimir
        e.key === 'Tab' ||                 // Permite tabulación
        e.key === 'ArrowLeft' ||           // Permite flecha izquierda
        e.key === 'ArrowRight'             // Permite flecha derecha
    ) {
        return;  // Si la tecla es válida, no hacer nada
    } else {
        e.preventDefault();  // Evita que se escriban otros caracteres
    }
});

// Validación para Congregación
document.getElementById('id_congregacion').addEventListener('change', function () {
    const congregacionSelect = this.value;
    if (congregacionSelect === '' || congregacionSelect === '0') { // Asumiendo que '0' es una opción por defecto o inválida
        this.setCustomValidity('Por favor selecciona una congregación válida.');
    } else {
        this.setCustomValidity(''); // Limpia el error si la selección es válida
    }
});

// Validación para Diócesis
document.getElementById('id_diosesis').addEventListener('change', function () {
    const diossSelect = this.value;
    if (diossSelect === '' || diossSelect === '0') { // Asumiendo que '0' es una opción por defecto o inválida
        this.setCustomValidity('Por favor selecciona una diócesis válida.');
    } else {
        this.setCustomValidity(''); // Limpia el error si la selección es válida
    }
});


// abrir los modales de agregar y editar

function abir() {
    var modalSede = new bootstrap.Modal(document.getElementById('modalSede'));

    const modalTitle = document.getElementById('modalSedeLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formSede = document.getElementById('formSede'); // Obtener el formulario

    modalTitle.textContent = 'Agregar Sede';
    submitBtn.textContent = 'Guardar';

    // Cambiar el action del formulario para que apunte a la ruta de inserción
    formSede.setAttribute('action', insertarSedeURL);

    // Limpiar campos del modal
    document.getElementById('sedeId').value = '';
    document.getElementById('nombre_sede').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('creacion').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('id_congregacion').value = '';
    document.getElementById('id_diosesis').value = '';
    
    modalSede.show();
}



function abrirModalEditar(id, nombre, direccion, creacion, telefono, correo, id_congregacion, id_diosesis) {
    var modalSede = new bootstrap.Modal(document.getElementById('modalSede'));

    const modalTitle = document.getElementById('modalSedeLabel');
    const submitBtn = document.getElementById('submitBtn');
    const formSede = document.getElementById('formSede'); // Obtener el formulario

    modalTitle.textContent = 'Editar Sede';
    submitBtn.textContent = 'Guardar cambios';

    // Cambiar el action del formulario para que apunte a la ruta de actualización
    formSede.setAttribute('action', actualizarSedeURL);

    // Llenar los campos con los datos existentes
    document.getElementById('sedeId').value = id;
    document.getElementById('nombre_sede').value = nombre;
    document.getElementById('direccion').value = direccion;
    document.getElementById('creacion').value = creacion;
    document.getElementById('telefono').value = telefono;
    document.getElementById('correo').value = correo;

    let selectCongregacion = document.getElementById('id_congregacion');
    let selectDiosesis = document.getElementById('id_diosesis');

    // Asignar la congregación y la diócesis basándose en el nombre (texto) mostrado en las opciones
    if (selectCongregacion) {
        seleccionarOpcionPorTexto(selectCongregacion, id_congregacion);
    }

    if (selectDiosesis) {
        seleccionarOpcionPorTexto(selectDiosesis, id_diosesis);
    }

    modalSede.show();
}

// Función auxiliar para seleccionar la opción correcta en los select
function seleccionarOpcionPorTexto(selectElement, texto) {
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text === texto) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}
