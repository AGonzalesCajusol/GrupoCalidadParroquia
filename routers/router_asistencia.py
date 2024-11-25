from flask import render_template, request, redirect, url_for, flash, jsonify
from datetime import datetime, timedelta
from controladores.controlador_asistencia import (
    obtener_asistencia,
    obtener_programacion,
    obtener_feligres,
    obtener_solicitud,
    obtener_calendario,
    actualizar_asistencia as actualizar_asistencia_controlador
)
from routers.router_main import requerido_login

def registrar_rutas(app):
    @app.route("/gestionar_asistencia", methods=["GET"])
    @requerido_login
    def gestionar_asistencia():
        asistencia = obtener_asistencia()
        programacion = obtener_programacion()
        feligres = obtener_feligres()
        solicitud = obtener_solicitud()
        return render_template("asistencia_catequista/gestionar_asistencia.html", asistencia=asistencia, programacion=programacion, feligres=feligres, solicitud=solicitud)

    @app.route("/registrar_asistencia", methods=["GET"])
    @requerido_login
    def formulario_registrar_asistencia():
        return render_template("asistencia/registrar_asistencia.html")
     
        
    @app.route("/apiprogramacion", methods=["GET"])
    @requerido_login
    def api_programacion():
        try:
            programacion = obtener_programacion()
            lista_programacion = [{
                "id_programacion": p[0],
                "hora_inicio": str(p[1]),
                "hora_tema": f"{p[1]} - {p[2]}", # Formato: "hora_inicio - tema"
                "nombre_ministro": p[3],
                "duracion": str(p[4])
            } for p in programacion]
            return jsonify({"data": lista_programacion})
        except Exception as e:
            print(f"Error al obtener la programación de charlas: {e}")
            return jsonify({"error": "Error al obtener la programación de charlas"}), 500
           
    @app.route("/apicalendar", methods=["GET"])
    @requerido_login
    def api_calendar():
        try:
            programCal = obtener_calendario()
            return jsonify({"data": programCal}), 200

        except Exception as e:
            print(f"Error al obtener la programación para el calendar: {e}")
            return jsonify({"error": "Error al obtener la programación del calendario"}), 500

    @app.route("/actualizar_asistencia", methods=["POST"])
    @requerido_login
    def actualizar_asistencia_route():
        return actualizar_asistencia_controlador()
