$(document).ready(function () {
    // Inicializar DataTable para intenciones
    var table = $('#intencionTable').DataTable({
        pageLength: 8,
        dom: '<"d-flex justify-content-between align-items-center mb-3"<"d-flex"f><"d-flex justify-content-end button-section">>rt<"bottom"p>',
        language: {
            search: "Buscar:"
        },
        initComplete: function () {
            // Agregar botón para añadir una nueva intención
            $("div.button-section").html(`
                <button type="button" class="btn btn-success btn-lg custom-btn ml-3 btn-agregar-intencion" data-bs-toggle="modal" onclick="abrirModalIntencion('add')">
                    <i class="bi bi-plus-circle"></i> Agregar intención
                </button>
            `);

            // Cargar dinámicamente las opciones del filtro de actos litúrgicos
            let opcionesTipo = '<option value="">Todos</option>';
            fetch("/api/tipos_actos_liturgicos")
                .then(response => response.json())
                .then(response => {
                    if (response.data) {
                        response.data.forEach(element => {
                            opcionesTipo += `<option value="${element.id_actoliturgico}">${element.nombre_liturgia}</option>`;
                        });
                        $('#filtroTipo').html(opcionesTipo);
                    }
                })
                .catch(error => {
                    console.error("Error al cargar los tipos:", error);
                });
        }
    });
});

function abrirModalIntencion(tipo, id = null, nombre = '', descripcion = '', idActo = '') {
    const modal = new bootstrap.Modal(document.getElementById("intencionModal"));
    const form = document.getElementById("intencionForm");
    const modalTitle = document.getElementById("intencionModalLabel");
    const submitButton = document.getElementById("submitBtn");

    // Resetear el formulario
    form.reset();

    // Configurar el modal según el tipo de acción
    if (tipo === "ver") {
        modalTitle.innerText = "Ver Intención";
        form.action = "#";
        form.querySelectorAll("input, select").forEach(input => {
            input.readOnly = true;
            input.disabled = true;
        });
        submitButton.style.display = "none";
    } else if (tipo === "editar") {
        modalTitle.innerText = "Editar Intención";
        form.action = actualizarIntencionURL;
        form.querySelectorAll("input, select").forEach(input => {
            input.readOnly = false;
            input.disabled = false;
        });
        submitButton.style.display = "block";
    } else {
        modalTitle.innerText = "Agregar Intención";
        form.action = insertarIntencionURL;
        submitButton.style.display = "block";
    }

    // Rellenar los campos del formulario
    if (id) document.getElementById("intencionId").value = id;
    if (nombre) document.getElementById("nombre_intencion").value = nombre;
    if (descripcion) document.getElementById("descripcion").value = descripcion;

    // Manejar el dropdown de actos litúrgicos
    const select = document.getElementById("id_actoliturgico");
    if (idActo) {
        const optionExists = Array.from(select.options).some(option => option.value == idActo);
        if (!optionExists) {
            const newOption = document.createElement("option");
            newOption.value = idActo;
            newOption.text = `Acto Litúrgico ${idActo}`; // Cambia el texto según lo que necesites
            select.appendChild(newOption);
        }
        select.value = idActo;
    }

    // Mostrar el modal
    modal.show();
}

function eliminarIntencion(event, id) {
    event.preventDefault();
    if (confirm("¿Estás seguro de eliminar esta intención?")) {
        fetch(`/eliminar_intencion/${id}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    alert("Error al eliminar la intención.");
                }
            })
            .catch(error => console.error("Error:", error));
    }
}
