from flask import render_template, request, jsonify
from controladores.controlador_celebracion import (
    obtener_celebraciones,
    insertar_celebracion,
    actualizar_celebracion,
    eliminar_celebracion
)
from routers.router_main import requerido_login

import controladores.controlador_sede as csede

def registrar_rutas(app):
    
    @app.route("/gestionar_celebracion", methods=["GET"])
    def gestionar_celebracion():
        sedes = csede.obtener_sede()
        return render_template("celebracion/gestionar_celebracion.html",sedes = sedes)

    # Ruta para obtener las celebraciones en formato JSON
    @app.route("/api/obtener_celebraciones", methods=["GET"])
    def api_obtener_celebraciones():
        return obtener_celebraciones()

    # Ruta para insertar una nueva celebración
    @app.route("/api/insertar_celebracion", methods=["POST"])
    def api_insertar_celebracion():
        data = request.get_json()
        titulo = data.get('titulo')
        fecha_inicio = data.get('fecha_inicio').split('T')[0]
        hora_inicio = data.get('fecha_inicio').split('T')[1]
        fecha_fin = data.get('fecha_fin').split('T')[0] if data.get('fecha_fin') else None
        hora_fin = data.get('fecha_fin').split('T')[1] if data.get('fecha_fin') else None
        sede = data.get('sede')
        return insertar_celebracion(titulo, fecha_inicio, hora_inicio, fecha_fin, hora_fin, sede)

    # Ruta para actualizar una celebración
    @app.route("/api/actualizar_celebracion", methods=["POST"])
    def api_actualizar_celebracion():
        data = request.get_json()
        id_celebracion = data.get('id')
        titulo = data.get('titulo')
        fecha_inicio = data.get('fecha_inicio').split('T')[0]
        hora_inicio = data.get('fecha_inicio').split('T')[1]
        fecha_fin = data.get('fecha_fin').split('T')[0] if data.get('fecha_fin') else None
        hora_fin = data.get('fecha_fin').split('T')[1] if data.get('fecha_fin') else None
        sede = data.get('sede')
        return actualizar_celebracion(id_celebracion, titulo, fecha_inicio, hora_inicio, fecha_fin, hora_fin, sede)

    # Ruta para eliminar una celebración
    @app.route("/api/eliminar_celebracion", methods=["POST"])
    def api_eliminar_celebracion():
        id_celebracion = request.form["id"]
        return eliminar_celebracion(id_celebracion)
