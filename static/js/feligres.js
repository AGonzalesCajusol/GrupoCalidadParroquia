$(document).ready(function () {
    var table = $('#feligresesTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            $("div.button-section").html('<button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-ministro" data-bs-toggle="modal" onclick="openModal(\'add\')"><i class="bi bi-person-plus"></i> Agregar feligres</button>');
        }
    });
});

function openModal(type, id = null, dni = '', apellidos = '', nombres = '', fecha_nacimiento = '', estado_civil = '', sexo = '', sede = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Feligrés';
        formAction = urlInsertarFeligres;
        isReadOnly = false;
        limpiarModal();
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Feligrés';
        formAction = urlActualizarFeligres;
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';

        document.getElementById('feligresId').value = id;
        document.getElementById('dni').value = dni;
        document.getElementById('apellidos').value = apellidos;
        document.getElementById('nombres').value = nombres;
        document.getElementById('fecha_nacimiento').value = fecha_nacimiento;
        document.getElementById('estado_civil').value = estado_civil;
        document.getElementById('sexo').value = sexo;
        document.getElementById('id_sede').value = sede;

    } else if (type === 'view') {
        modalTitle = 'Ver Feligrés';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';

        document.getElementById('feligresId').value = id;
        document.getElementById('dni').value = dni;
        document.getElementById('apellidos').value = apellidos;
        document.getElementById('nombres').value = nombres;
        document.getElementById('fecha_nacimiento').value = fecha_nacimiento;
        document.getElementById('estado_civil').value = estado_civil;
        document.getElementById('sexo').value = sexo;
        document.getElementById('id_sede').value = sede;
    }

    document.getElementById('feligresModalLabel').innerText = modalTitle;
    document.getElementById('feligresForm').action = formAction;
    document.querySelectorAll('#feligresForm input, #feligresForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    var feligresModal = new bootstrap.Modal(document.getElementById('feligresModal'));
    feligresModal.show();

    document.getElementById('feligresForm').onsubmit = function (event) {
        event.preventDefault();
        let formData = new FormData(this);

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(type === 'edit' ? 'Feligrés actualizado exitosamente' : 'Feligrés agregado exitosamente');
                    if (type === 'add') {
                        agregarFeligresATabla(data.feligres);
                        limpiarModal();
                    } else {
                        location.reload();
                    }
                } else {
                    alert('Error al procesar el feligrés');
                }
            })
            .catch(error => console.error('Error:', error));
    };
}

function limpiarModal() {
    document.getElementById('feligresId').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('fecha_nacimiento').value = '';
    document.getElementById('estado_civil').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('id_sede').value = '';
}



//Segunda parte, Registro de usuario web


/*function crear_cuenta(){
    let dni = document.getElementById('dni11');
    let apellidos = document.getElementById('apellidos11');
    let nombres = document.getElementById('nombres11');
    let f_naci = document.getElementById('fecha_nacimiento11');
    let estado_civil = document.getElementById('estado_civil11');
    let sexo = document.getElementById('sexo11');
    let passw = document.getElementById('password11');


    let datos_enviar = {
        "dni": dni.value,
        "apellidos": apellidos.value,
        "nombres": nombres.value,
        "fecha_nac": f_naci.value,
        "estado_civil": estado_civil.value[0].toLowerCase(),
        "sexo": sexo.value[0].toLowerCase(),
        "contraseña": passw.value
    }

    // Enviar datos al servidor usando fetch
    fetch('/registrar_feligresweb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos_enviar)
    })
    .then(response => response.json())  // Convertir la respuesta en JSON
    .then(data => {
        console.log('Datos recibidos desde el servidor:', data);
        alert('Cuenta creada exitosamente');
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
        alert('Error al crear la cuenta');
    });

}
*/
 



function validar_campos11(){
    dni = document.getElementById('dni11');
    apellidos = document.getElementById('apellidos11');
    nombres = document.getElementById('nombres11');
    f_naci = document.getElementById('f_naci11');
    estado_civil = document.getElementById('estado_civil11');
    sexo = document.getElementById('sexo11');
}