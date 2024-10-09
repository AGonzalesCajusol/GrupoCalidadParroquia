from flask import jsonify, render_template, request, redirect, url_for, flash
from controladores.controlador_tipo_recaudacion import *

def registrar_rutas(app):
    # Ruta para gestionar tipos de recaudación
    @app.route("/gestionar_tipo_recaudacion", methods=["GET"])
    def gestionar_tipo_recaudacion():
        tipos_recaudacion = obtener_tipos_recaudacion()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        return render_template("tipo_financiero/gestionar_tipo_recaudacion.html", tipos_recaudacion=tipos_recaudacion)

    # Ruta para mostrar el formulario de registro de un nuevo tipo de recaudación
    @app.route("/registrar_tipo_recaudacion", methods=["GET"])
    def formulario_registrar_tipo_recaudacion():
        return render_template("tipo_financiero/registrar_tipo_recaudacion.html")

    # Ruta para mostrar el formulario de edición de un tipo de recaudación
    @app.route("/editar_tipo_recaudacion/<int:id>", methods=["GET"])
    def formulario_editar_tipo_recaudacion(id):
        tipo_recaudacion = obtener_tipo_recaudacion_por_id(id)
        return render_template("tipo_financiero/editar_tipo_recaudacion.html", tipo_recaudacion=tipo_recaudacion)

    # Procesar la actualización de un tipo de recaudación
    @app.route("/procesar_actualizar_tipo_recaudacion", methods=["POST"])
    def procesar_actualizar_tipo_recaudacion():
        try:
            id = request.form["id"]
            nombre_recaudacion = request.form["nombre_recaudacion"]
            tipo = request.form["tipo"]

            # Lógica para actualizar un tipo de recaudación en la base de datos
            actualizar_tipo_recaudacion(nombre_recaudacion, tipo, id)

            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))

    # Procesar la inserción de un tipo de recaudación
    @app.route("/insertar_tipo_recaudacion", methods=["POST"])
    def procesar_insertar_tipo_recaudacion():
        try:
            nombre_recaudacion = request.form["nombre_recaudacion"]
            tipo = request.form["tipo"]

            # Lógica para insertar un nuevo tipo de recaudación en la base de datos
            insertar_tipo_recaudacion(nombre_recaudacion, tipo)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))

    # Procesar la eliminación de un tipo de recaudación
    @app.route("/eliminar_tipo_recaudacion", methods=["POST"])
    def procesar_eliminar_tipo_recaudacion():
        data = request.get_json()
        try:
            eliminar_tipo_recaudacion(data['id'])
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))
