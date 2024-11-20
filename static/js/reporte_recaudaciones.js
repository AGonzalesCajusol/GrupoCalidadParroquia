document.addEventListener('DOMContentLoaded', function () {
    let selectedYear = null;

    document.getElementById('yearFilter').addEventListener('change', function (event) {
        selectedYear = event.target.value;
        crearGrafico(selectedYear);
    });
});

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

async function obtenerDatos(year) {
    const url = `/api/recaudaciones_por_fecha?year=${year}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
        const data = await response.json();
        console.log("Datos recibidos:", data);  // Para debug
        return data;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return [];
    }
}

async function crearGrafico(year) {
    const noDataMessage = document.getElementById('noDataMessage');
    const ctx = document.getElementById('recaudacionesChart').getContext('2d');

    if (!year) {
        noDataMessage.classList.remove('d-none');
        noDataMessage.textContent = "Seleccione un año para ver el gráfico.";
        return;
    }

    const data = await obtenerDatos(year);

    if (data.length === 0) {
        noDataMessage.classList.remove('d-none');
        noDataMessage.textContent = "No hay datos disponibles para los filtros seleccionados.";
        return;
    } else {
        noDataMessage.classList.add('d-none');
    }

    // Inicializar array con 12 meses en 0
    const mesesData = Array(12).fill(0);

    // Procesar los datos recibidos
    data.forEach((d) => {
        // Obtener el mes de la fecha (formato: "Fri, 10 Mar 2023 00:00:00 GMT")
        const fecha = new Date(d[1]);
        const mes = fecha.getMonth(); // 0-11
        const monto = parseFloat(d[2]);
        mesesData[mes] = monto;
    });

    const labels = meses;
    const valores = mesesData;

    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Monto de Recaudación',
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
                x: {
                    title: {
                        display: true,
                        text: 'Mes',
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto (S/.)',
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