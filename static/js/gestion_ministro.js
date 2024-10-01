$(document).ready(function () {
    $('#ministrosTable').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json"
        }
    });
    
});

function openModal(type, id = null, nombre = '', nacimiento = '', ordenacion = '', actividades = '', tipo = '', sede = '', cargo = '') {
    var modalTitle = '';
    var formAction = '';
    var isReadOnly = false;

    if (type === 'add') {
        modalTitle = 'Agregar Ministro';
        formAction = '{{ url_for("procesar_insertar_ministro") }}';
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'edit') {
        modalTitle = 'Editar Ministro';
        formAction = '{{ url_for("procesar_actualizar_ministro") }}';
        isReadOnly = false;
        document.getElementById('saveChanges').style.display = 'block';
    } else if (type === 'view') {
        modalTitle = 'Ver Ministro';
        formAction = '';
        isReadOnly = true;
        document.getElementById('saveChanges').style.display = 'none';  // Oculta el botón "Guardar" en el modo de visualización
    }

    // Configuración del modal
    document.getElementById('ministroModalLabel').innerText = modalTitle;
    document.getElementById('ministroForm').action = formAction;

    // Asignar valores a los campos de texto
    document.getElementById('ministroId').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('nacimiento').value = nacimiento;
    document.getElementById('ordenacion').value = ordenacion;
    document.getElementById('actividades').value = actividades;

    // Seleccionar el valor correcto en los select de tipo, sede y cargo
    document.getElementById('id_tipoministro').value = tipo;
    document.getElementById('id_sede').value = sede;
    document.getElementById('id_cargo').value = cargo;

    // Alternativa si `document.getElementById().value` no selecciona correctamente la opción en el select:
    // Selecciona manualmente las opciones para los select:
    var tipoSelect = document.getElementById('id_tipoministro');
    for (var i = 0; i < tipoSelect.options.length; i++) {
        if (tipoSelect.options[i].value == tipo) {
            tipoSelect.selectedIndex = i;
            break;
        }
    }

    var sedeSelect = document.getElementById('id_sede');
    for (var i = 0; i < sedeSelect.options.length; i++) {
        if (sedeSelect.options[i].value == sede) {
            sedeSelect.selectedIndex = i;
            break;
        }
    }

    var cargoSelect = document.getElementById('id_cargo');
    for (var i = 0; i < cargoSelect.options.length; i++) {
        if (cargoSelect.options[i].value == cargo) {
            cargoSelect.selectedIndex = i;
            break;
        }
    }

    // Hacer los campos de solo lectura si es el modo "Ver"
    document.querySelectorAll('#ministroForm input, #ministroForm select').forEach(function (input) {
        input.readOnly = isReadOnly;
        input.disabled = isReadOnly;
    });

    // Inicializar y mostrar el modal
    var ministroModal = new bootstrap.Modal(document.getElementById('ministroModal'));
    ministroModal.show();
}
