from flask import jsonify, request, render_template
from controladores.controlador_cronograma import obtener_cronograma_actividades, obtener_id_sede_por_nombre
from routers.router_main import requerido_login
from datetime import datetime
from bd import obtener_conexion

def registrar_rutas(app):
    @app.route('/api/obtener_actividades')
    @requerido_login
    def obtener_actividades():
        year = request.args.get('year', type=int)  
        if not year:
            return jsonify({"error": "Año no especificado"}), 400

        nombre_sede = request.cookies.get('sede')
        if not nombre_sede:
            return jsonify({"error": "Sede no especificada"}), 400

        id_sede = obtener_id_sede_por_nombre(nombre_sede)
        actividades = obtener_cronograma_actividades(id_sede)

        eventos = [
            {
                "title": actividad[4],
                "start": f"{actividad[0]}T{actividad[1]}",
                "end": f"{actividad[2]}T{actividad[3]}"
            }
            for actividad in actividades if actividad[0].year == year
        ]

        return jsonify(eventos)

    @app.route('/cronograma_actividades')
    @requerido_login
    def cronograma_actividades():
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                cursor.execute("""
                    SELECT DISTINCT YEAR(fecha) as año 
                    FROM celebracion 
                    ORDER BY año DESC
                """)
                años = [int(row[0]) for row in cursor.fetchall()]
                
            if not años:
                años = [datetime.now().year]
            
            año_actual = datetime.now().year
            
            return render_template('cronograma/cronograma_actividades.html', 
                                 años=años,
                                 año_actual=año_actual)
        finally:
            conexion.close()
