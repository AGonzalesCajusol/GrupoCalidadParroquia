from flask import render_template, request, jsonify
from controladores.controlador_tipo_ministro import *

def registrar_rutas(app):
    # Ruta para la página principal de gestión de tipos de ministros
    @app.route("/gestionar_tipo_ministro", methods=["GET"])
    def gestionar_tipo_ministro():
        try:
            tipos = obtener_tipos_ministro()
            return render_template("ministro/gestionar_tipo_ministro.html", tipos_ministro=tipos)
        except Exception as e:
            return jsonify(success=False, message="Error al cargar la página: " + str(e))

    # Ruta para insertar un nuevo tipo de ministro
    @app.route("/insertar_tipo_ministro", methods=["POST"])
    def procesar_insertar_tipo_ministro():
        try:
            nombre = request.form["tipo"]
            estado = request.form.get("estado", default="1")  # Estado activo por defecto
            insertar_tipo_ministro(nombre, estado)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al insertar tipo de ministro: " + str(e))

    # Ruta para actualizar un tipo de ministro existente
    @app.route("/procesar_actualizar_tipo_ministro", methods=["POST"])
    def procesar_actualizar_tipo_ministro():
        try:
            data = request.json
            id = data.get("id")
            nombre = data.get("tipo", None)  # El nombre puede o no cambiar
            estado = data.get("estado", 1)  # Estado del tipo de ministro (1: activo, 0: inactivo)
            actualizar_tipo_ministro(id, nombre, estado)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al actualizar el tipo de ministro: " + str(e))



    @app.route("/procesar_dar_baja", methods=["POST"])
    def procesar_dar_baja():
            try:
                data = request.json
                id = data.get("id")
                estado = data.get("estado", 0)  # Estado del tipo de ministro (1: activo, 0: inactivo)
                dar_baja_tipo_ministro(id,estado)
                return jsonify(success=True)
            except Exception as e:
                return jsonify(success=False, message="Error al actualizar el tipo de ministro: " + str(e))





    # Ruta para eliminar un tipo de ministro
    @app.route("/eliminar_tipo_ministro", methods=["POST"])
    def procesar_eliminar_tipo_ministro():
        try:
            id = request.json["id"]
            eliminar_tipo_ministro(id)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al eliminar el tipo de ministro: " + str(e))
