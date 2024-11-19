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
                    <i class="bi bi-plus-circle"></i> Agregar Intención
                </button>
            `);
        }
    });
});


function abrirModalIntencion(tipo, id, nombre, descripcion, idActo) {
    const modal = new bootstrap.Modal(document.getElementById("intencionModal"));
    const form = document.getElementById("intencionForm");
    const modalTitle = document.getElementById("intencionModalLabel");
    const submitButton = document.getElementById("submitBtn");

    form.reset();
    if (tipo === "ver") {
        modalTitle.innerText = "Ver Intención";
        form.action = "#";
        form.querySelectorAll("input, select").forEach(input => {
            input.readOnly = true;
            input.disabled = true;
        });
        const select = document.getElementById('id_actoliturgico');
            if (!select.querySelector(`option[value="${idActo}"]`)) {
                select.innerHTML += `<option value="${idActo}">${idActo}</option>`;
              }
        submitButton.style.display = "none";
    } else if (tipo === "editar") {
        modalTitle.innerText = "Editar Intención";
        form.action = actualizarIntencionURL;
        form.querySelectorAll("input, select").forEach(input => {
            input.readOnly = false;
            input.disabled = false;
        });
        const select = document.getElementById('id_actoliturgico');
            if (!select.querySelector(`option[value="${idActo}"]`)) {
                select.innerHTML += `<option value="${idActo}">${idActo}</option>`;
              }
        submitButton.style.display = "block";
    } else {
        modalTitle.innerText = "Agregar Intención";
        form.action = insertarIntencionURL;
        submitButton.style.display = "block";
    }

    if (id) document.getElementById("intencionId").value = id;
    if (nombre) document.getElementById("nombre_intencion").value = nombre;
    if (descripcion) document.getElementById("descripcion").value = descripcion;
    if (idActo) document.getElementById("id_actoliturgico").value = idActo;
    const select = document.getElementById('id_actoliturgico');
            if (!select.querySelector(`option[value="${idActo}"]`)) {
                select.innerHTML += `<option value="${idActo}">${idActo}</option>`;
              }

    modal.show();
}

function eliminarIntencion(event, id) {
    event.preventDefault();
    if (confirm("¿Estás seguro de eliminar esta intención?")) {
        fetch(`/eliminar_intencion/${id}`, { method: "POST" })
            .then(response => {
                if (response.ok) location.reload();
                else alert("Error al eliminar la intención.");
            })
            .catch(error => console.error("Error:", error));
    }
}
