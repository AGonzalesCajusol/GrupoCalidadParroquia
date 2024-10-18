function ver_contraseña() {
    const icono = document.getElementById('boton_ver');
    const psw = document.getElementById('password11');
    
    // Cambiar de icono de ver a no ver 
    if (icono.classList.contains("bi-eye-fill")) {
        icono.classList.remove("bi-eye-fill");
        icono.classList.add("bi-eye-slash-fill");
        psw.type = "password";
    } else {
        // Cambiar de icono de no ver a ver 
        icono.classList.remove("bi-eye-slash-fill");
        icono.classList.add("bi-eye-fill");
        psw.type = "text";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    //const validator = new JustValidate('#formulario-11');
    
    validator
        .addField('#dni11', [
            {
                rule: 'required',
                errorMessage: 'El DNI es requerido',
            },
            {
                rule: 'minLength',
                value: 8,
                errorMessage: 'El DNI debe tener exactamente 8 caracteres',
            },
            {
                rule: 'maxLength',
                value: 8,
                errorMessage: 'El DNI debe tener exactamente 8 caracteres',
            }
        ])
        // Agrega las otras validaciones de campos aquí
        .addField('#nombres11', [
            {
                rule: 'required',
                errorMessage: 'El nombre es requerido'
            },
            {
                rule: 'maxLength',
                value: 35,
                errorMessage: 'Pasaste de los 35 caracteres'
            },
            {
                rule: 'minLength',
                value: 2,
                errorMessage: 'Ingresa al menos 2 caracteres'
            }
        ]);
});


