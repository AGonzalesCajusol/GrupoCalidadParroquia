document.addEventListener('DOMContentLoaded', function () {
    let selectedYear = null;
    let selectedActo = null;

    // Capturar selección del año
    document.getElementById('yearFilter').addEventListener('change', function (event) {
        selectedYear = event.target.value;
        actualizarGrafico(selectedYear, selectedActo);
    });

    // Capturar selección del tipo de acto litúrgico
    document.getElementById('actoFilter').addEventListener('change', function (event) {
        selectedActo = event.target.value;
        actualizarGrafico(selectedYear, selectedActo);
    });
});

// Configuración de meses
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Función principal para actualizar el gráfico
async function actualizarGrafico(year, acto) {
    const noDataMessage = document.getElementById('noDataMessage');
    const ctx = document.getElementById('actosLiturgicosChart').getContext('2d');

    // Mostrar mensaje si faltan filtros
    if (!year || !acto) {
        mostrarMensaje(noDataMessage, "Seleccione un año y un tipo de acto litúrgico para ver el gráfico.");
        renderEmptyChart(ctx);
        return;
    }

    // Obtener datos
    const data = await obtenerDatos(year, acto);

    // Verificar si hay datos
    if (data.length === 0) {
        mostrarMensaje(noDataMessage, "No hay datos disponibles para los filtros seleccionados.");
        renderEmptyChart(ctx);
        return;
    }

    // Ocultar mensaje y renderizar gráfico
    noDataMessage.classList.add('d-none');
    renderChart(ctx, data);
}

// Función para mostrar y ocultar mensajes suavemente
function mostrarMensaje(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove('d-none');
    setTimeout(() => {
        elemento.style.transition = "opacity 1s ease";
        elemento.style.opacity = "0";
        setTimeout(() => {
            elemento.classList.add('d-none');
            elemento.style.opacity = "";
        }, 1000);
    }, 3000);
}

// Función para obtener los datos del API
async function obtenerDatos(year, acto) {
    const url = `/api/celebraciones_por_fecha?year=${year}${acto ? `&acto=${acto}` : ''}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return [];
    }
}

// Función para renderizar un gráfico real
function renderChart(ctx, data) {
    const mesesData = meses.reduce((acc, _, index) => ({ ...acc, [index + 1]: 0 }), {});
    data.forEach(d => { mesesData[d.mes] = d.num_celebraciones; });

    const valores = Object.values(mesesData);

    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [
                {
                    label: 'Número de Celebraciones',
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Mes' } },
                y: { beginAtZero: true, title: { display: true, text: 'Número de Celebraciones' } },
            },
            plugins: { legend: { display: true, position: 'top' } },
        },
    });
}

// Función para renderizar un gráfico vacío
function renderEmptyChart(ctx) {
    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [
                {
                    label: 'Número de Celebraciones',
                    data: new Array(meses.length).fill(0),
                    borderColor: 'rgba(200, 200, 200, 0.5)',
                    borderWidth: 1,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Mes' } },
                y: { beginAtZero: true, title: { display: true, text: 'Número de Celebraciones' } },
            },
            plugins: { legend: { display: false } },
        },
    });
}
