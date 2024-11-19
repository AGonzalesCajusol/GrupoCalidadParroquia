document.addEventListener('DOMContentLoaded', async function() {
    await cargarAnios();  // Carga los años como botones

    let selectedYear = null;
    let selectedMonth = null;
    const monthFiltersContainer = document.getElementById('monthFiltersContainer'); // Contenedor de meses

    // Manejar la selección de año
    document.getElementById('yearFilters').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            selectedYear = event.target.getAttribute('data-year');
            marcarSeleccion('yearFilters', selectedYear, 'data-year');

            // Mostrar el contenedor de meses cuando se seleccione un año
            if (selectedYear) {
                monthFiltersContainer.style.display = 'block';
            }

            crearGrafico(selectedYear, selectedMonth);  // Actualizar el gráfico al seleccionar año
        }
    });

    // Manejar la selección de mes
    document.getElementById('monthFilters').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            selectedMonth = event.target.getAttribute('data-month');
            marcarSeleccion('monthFilters', selectedMonth, 'data-month');
            crearGrafico(selectedYear, selectedMonth);  // Actualizar el gráfico al seleccionar mes
        }
    });
});


// Función para marcar la selección en los botones
function marcarSeleccion(containerId, value, dataAttr) {
    const container = document.getElementById(containerId);
    Array.from(container.children).forEach(btn => {
        if (btn.getAttribute(dataAttr) === value) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline-secondary');
        } else {
            btn.classList.add('btn-outline-secondary');
            btn.classList.remove('btn-primary');
        }
    });
}

// Función para cargar los años como botones
async function cargarAnios() {
    try {
        const response = await fetch('/api/obtener_anos');
        if (!response.ok) throw new Error('Error al obtener los años');
        
        const data = await response.json();
        const yearFilters = document.getElementById('yearFilters');
        yearFilters.innerHTML = '';  // Limpiar botones previos

        data.data.forEach(element => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-outline-secondary';
            button.setAttribute('data-year', element.año);
            button.textContent = element.año;
            yearFilters.appendChild(button);
        });
    } catch (error) {
        console.error("Error al cargar los años:", error);
    }
}

// Función para obtener los datos de la API según el año y mes seleccionados
async function obtenerDatos(year, month) {
    const url = `/api/celebraciones_por_fecha?year=${year}${month ? `&month=${month}` : ''}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    }
}

async function crearGrafico(year, month) {
    const data = await obtenerDatos(year, month);
    const noDataMessage = document.getElementById('noDataMessage');
    const chartContainer = document.getElementById('chartContainer');
    const ctx = document.getElementById('actosLiturgicosChart').getContext('2d');

    const labels = data.length > 0 ? data.map(d => d.acto_liturgico) : ['No hay datos'];
    const valores = data.length > 0 ? data.map(d => d.num_celebraciones) : [0];

    // Mostrar mensaje si no hay datos
    if (data.length === 0) {
        noDataMessage.style.display = 'block'; // Asegurarse de que se muestre
        noDataMessage.style.opacity = '1';    // Restablecer la opacidad inicial

        // Ocultar con una transición suave después de 3 segundos
        setTimeout(() => {
            noDataMessage.style.opacity = '0'; // Desvanece el mensaje
            setTimeout(() => {
                noDataMessage.style.display = 'none'; // Lo oculta completamente después del desvanecimiento
            }, 1000); // 1 segundo para coincidir con la transición CSS
        }, 3000); // Esperar 3 segundos antes de comenzar a desvanecer
    }

    // Asegurarse de que el gráfico se renderice incluso si no hay datos
    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de Celebraciones',
                data: valores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Acto Litúrgico'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Celebraciones'
                    },
                    max: Math.max(10, ...valores) // Asegura un rango adecuado
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}
