document.addEventListener('DOMContentLoaded', function () {
    let selectedYear = null;
    let selectedActo = null;

    // Capturar selección del año
    document.getElementById('yearFilter').addEventListener('change', function (event) {
        selectedYear = event.target.value;
        crearGrafico(selectedYear, selectedActo);
    });

    // Capturar selección del tipo de acto litúrgico
    document.getElementById('actoFilter').addEventListener('change', function (event) {
        selectedActo = event.target.value;
        crearGrafico(selectedYear, selectedActo);
    });
});

// Mapeo de meses
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Función para obtener los datos según el año y acto seleccionados
async function obtenerDatos(year, acto) {
    const url = `/api/celebraciones_por_fecha?year=${year}${acto ? `&acto=${acto}` : ''}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return [];
    }
}

// Función para crear o actualizar el gráfico
async function crearGrafico(year, acto) {
    const noDataMessage = document.getElementById('noDataMessage');
    const chartContainer = document.getElementById('chartContainer');
    const ctx = document.getElementById('actosLiturgicosChart').getContext('2d');

    // Validar que se hayan seleccionado año y acto
    if (!year || !acto) {
        noDataMessage.style.display = 'block';
        noDataMessage.textContent = "Seleccione un año y un tipo de acto litúrgico para ver el gráfico.";
        chartContainer.style.display = 'none';
        return;
    }

    const data = await obtenerDatos(year, acto);

    // Mostrar mensaje si no hay datos
    if (data.length === 0) {
        noDataMessage.style.display = 'block';
        noDataMessage.textContent = "No hay datos disponibles para los filtros seleccionados.";
        chartContainer.style.display = 'none';
        return;
    } else {
        noDataMessage.style.display = 'none';
        chartContainer.style.display = 'block';
    }

    // Crear un objeto con todos los meses inicializados en 0
    const mesesData = meses.reduce((acc, mes, index) => {
        acc[index + 1] = 0; // Inicializamos cada mes (1 a 12) con valor 0
        return acc;
    }, {});

    // Llenar los meses con los datos obtenidos
    data.forEach((d) => {
        mesesData[d.mes] = d.num_celebraciones;
    });

    // Convertir el objeto a arrays para el gráfico
    const labels = Object.values(meses); // Nombres de los meses
    const valores = Object.values(mesesData); // Valores (incluyendo 0 donde no hay datos)

    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Nombres de los meses
            datasets: [
                {
                    label: 'Número de Celebraciones',
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 4, // Ajusta el tamaño de los puntos
                    pointHoverRadius: 6, // Ajusta el tamaño del punto al pasar el cursor
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Mes',
                    },
                    ticks: {
                        maxRotation: 0, // Mantiene las etiquetas horizontales
                        minRotation: 0, // Evita la rotación
                        padding: 5, // Reduce el espacio entre las etiquetas y la línea del eje
                    },
                    grid: {
                        display: false, // Elimina las líneas verticales del grid
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Celebraciones',
                    },
                    ticks: {
                        precision: 0, // Asegura que los valores del eje Y sean enteros
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });
}
