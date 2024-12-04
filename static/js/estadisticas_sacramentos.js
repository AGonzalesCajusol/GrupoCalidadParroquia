document.addEventListener('DOMContentLoaded', function() {
    let chartGeneral = null;
    let chartFiltered = null;

    // Cargar datos iniciales
    cargarResumenGeneral();
    cargarReporteFiltrado();

    // Event listeners para filtros
    document.getElementById('yearFilter').addEventListener('change', cargarReporteFiltrado);
    document.getElementById('monthFilter').addEventListener('change', cargarReporteFiltrado);

    function cargarResumenGeneral() {
        fetch('/api/estadisticas/sacramentos/general')
            .then(response => response.json())
            .then(data => {
                console.log('Datos generales:', data);
                if (chartGeneral) {
                    chartGeneral.destroy();
                }
                chartGeneral = renderizarGrafico('pieChartGeneral', data, 'Distribución General de Sacramentos');
            })
            .catch(error => {
                console.error('Error al cargar datos generales:', error);
            });
    }

    function cargarReporteFiltrado() {
        const year = document.getElementById('yearFilter').value;
        const month = document.getElementById('monthFilter').value;

        fetch(`/api/estadisticas/sacramentos/filtrado?year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                console.log('Datos filtrados:', data);
                if (chartFiltered) {
                    chartFiltered.destroy();
                }
                chartFiltered = renderizarGrafico('pieChartFiltered', data, 'Distribución por Período');
            })
            .catch(error => {
                console.error('Error al cargar datos filtrados:', error);
            });
    }

    function renderizarGrafico(elementId, data, titulo) {
        if (!data || data.length === 0) {
            document.getElementById(elementId).innerHTML = '<div class="alert alert-info">No hay datos disponibles para mostrar.</div>';
            return null;
        }

        const options = {
            series: data.map(item => item.total),
            labels: data.map(item => `${item.nombre_liturgia} (${item.porcentaje}%)`),
            chart: {
                type: 'pie',
                height: 350
            },
            title: {
                text: titulo,
                align: 'center'
            },
            tooltip: {
                y: {
                    formatter: function(value) {
                        return value + ' celebraciones';
                    }
                }
            }
        };

        const chart = new ApexCharts(document.getElementById(elementId), options);
        chart.render();
        return chart;
    }
}); 