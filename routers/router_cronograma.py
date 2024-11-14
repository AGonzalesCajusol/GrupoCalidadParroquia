from flask import jsonify, request, render_template
from controladores.controlador_cronograma import obtener_cronograma_actividades, obtener_id_sede_por_nombre

def registrar_rutas(app):
    # Ruta para obtener los datos del cronograma en formato JSON (API)
    @app.route('/api/obtener_actividades')
    def obtener_actividades():
        # Obtener el nombre de la sede desde las cookies
        nombre_sede = request.cookies.get('sede')
        if not nombre_sede:
            return jsonify({"error": "Sede no especificada"}), 400

        # Obtener el ID de la sede y luego las actividades
        id_sede = obtener_id_sede_por_nombre(nombre_sede)
        actividades = obtener_cronograma_actividades(id_sede)
        
        # Formatear las actividades para FullCalendar
        eventos = []
        for actividad in actividades:
            eventos.append({
                "title": actividad[4],  # Nombre de la actividad
                "start": f"{actividad[0]}T{actividad[1]}",  # Fecha de inicio + hora de inicio
                "end": f"{actividad[2]}T{actividad[3]}",    # Fecha de fin + hora de fin
            })

        return jsonify(eventos)
    
    # Ruta para renderizar la página HTML del cronograma
    @app.route('/cronograma_actividades')
    def cronograma_actividades():
        return render_template('cronograma/cronograma_actividades.html')
