from flask import jsonify, request, render_template
from controladores.controlador_estadisticas import (
    obtener_estadisticas_general,
    obtener_estadisticas_filtradas,
    obtener_años_disponibles
)

def registrar_rutas(app):
    @app.route('/estadisticas_sacramentos')
    def estadisticas_sacramentos():
        años = obtener_años_disponibles()
        return render_template('reportes/estadisticas_sacramentos.html', 
                             años=años)

    @app.route('/api/estadisticas/sacramentos/general')
    def api_estadisticas_general():
        datos = obtener_estadisticas_general()
        return jsonify(datos)

    @app.route('/api/estadisticas/sacramentos/filtrado')
    def api_estadisticas_filtrado():
        año = request.args.get('year', type=int)
        mes = request.args.get('month', type=int)
        datos = obtener_estadisticas_filtradas(año, mes)
        return jsonify(datos) 