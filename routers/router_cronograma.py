from flask import jsonify, request, render_template
from controladores.controlador_cronograma import obtener_cronograma_actividades, obtener_id_sede_por_nombre

def registrar_rutas(app):
    # Ruta para obtener los datos del cronograma en formato JSON (API)
    @app.route('/api/obtener_actividades')
    def obtener_actividades():
        year = request.args.get('year', type=int)  # Obtener el año de los parámetros
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
            for actividad in actividades if actividad[0].year == year  # Filtrar por año
        ]

        return jsonify(eventos)

    
    # Ruta para renderizar la página HTML del cronograma
    @app.route('/cronograma_actividades')
    def cronograma_actividades():
        return render_template('cronograma/cronograma_actividades.html')
