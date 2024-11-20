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
    const url = `/api/egresos_por_fecha?year=${year}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return [];
    }
}



async function crearGrafico(year) {
    const noDataMessage = document.getElementById('noDataMessage');
    const ctx = document.getElementById('egresosChart').getContext('2d');

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

    const mesesData = meses.reduce((acc, mes, index) => {
        acc[index + 1] = 0;
        return acc;
    }, {});

    data.forEach((d) => {
        mesesData[d.mes] = d.monto_total; // Suponiendo que la API devuelve `mes` y `monto_total`.
    });

    const labels = meses;
    const valores = Object.values(mesesData);

    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Monto de Egresos',
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
