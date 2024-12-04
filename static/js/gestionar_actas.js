document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formActa').addEventListener('submit', function(e) {
        e.preventDefault();
        generarActa();
    });
});

function generarActa() {
    const datos = {
        libro: document.getElementById('libro').value,
        folio: document.getElementById('folio').value,
        partida: document.getElementById('partida').value,
        dni_novio: document.getElementById('dniNovio').value,
        dni_novia: document.getElementById('dniNovia').value,
        fecha_nacimiento_novio: document.getElementById('fechaNacNovio').value,
        fecha_nacimiento_novia: document.getElementById('fechaNacNovia').value,
        fecha_matrimonio: document.getElementById('fechaMatrimonio').value,
        id_ministro: document.getElementById('sacerdote').value,
        nota_marginal: document.getElementById('notaMarginal').value,
        padre_novio: document.getElementById('padreNovio').value,
        madre_novio: document.getElementById('madreNovio').value,
        padre_novia: document.getElementById('padreNovia').value,
        madre_novia: document.getElementById('madreNovia').value,
        nombre_novio: document.getElementById('nombreNovio').value,
        nombre_novia: document.getElementById('nombreNovia').value,
        nombre_padrino: document.getElementById('nombrePadrino').value,
        nombre_testigo1: document.getElementById('nombreTestigo1').value,
        nombre_testigo2: document.getElementById('nombreTestigo2').value
    };

    Swal.fire({
        title: 'Generando acta...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch('/generar_acta_matrimonio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al generar el acta');
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'acta_matrimonio.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El acta se ha generado correctamente'
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo generar el acta'
        });
    });
}

function validar_fecha_matrimonio(input) {
    const fechaSeleccionada = new Date(input.value);
    const fechaActual = new Date();

    // Comparar solo las fechas, sin las horas
    fechaSeleccionada.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
        Swal.fire({
            icon: 'error',
            title: 'Fecha inválida',
            text: 'La fecha de matrimonio no puede ser anterior al día actual.',
            confirmButtonText: 'Aceptar'
        });
        
        // Limpiar el valor del input
        input.value = '';
    }
} 