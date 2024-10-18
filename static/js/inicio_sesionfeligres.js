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

document.addEventListener('DOMContentLoaded', function () {
// Commenta la parte de validación temporalmente
// const validator = new JustValidate('#formulario-11');

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
        .addField('#apellidos11', [
            {
                rule: 'required',
                errorMessage: 'El apellido es requerido'
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
        ])
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
        ])
        .addField('#estado_civil11', [
            {
                rule: 'required',
                errorMessage: 'Debes seleccionar tu estado civil',
            },
        ])
        .addField('#sexo11', [
            {
                rule: 'required',
                errorMessage: 'Debes seleccionar tu sexo',
            },
        ])
        .addField('#password11', [
            {
                rule: 'required',
                errorMessage: 'La contraseña es requerida',
            },
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'La contraseña debe tener al menos 6 caracteres',
            },
        ])
        .addField('#fecha_nacimiento11', [
            {
                rule: 'required',
                errorMessage: 'La fecha de nacimiento es requerida',
            },
            {
                rule: 'customFunction',
                validator: (value) => {
                    const parts = value.split('-'); // yyyy-MM-dd
                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10);
                    const day = parseInt(parts[2], 10);
                    const birthDate = new Date(year, month - 1, day); // Crear objeto Date

                    // Obtener la fecha actual
                    const today = new Date();
                    // Calcular la fecha de 16 años atrás
                    const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

                    // Validar que la fecha de nacimiento sea anterior a la fecha de 16 años atrás
                    return birthDate <= minAgeDate;
                },
                errorMessage: 'Debes tener al menos 16 años',
            },
        ]);
});
