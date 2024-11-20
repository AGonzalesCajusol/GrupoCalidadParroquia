from flask import render_template, request, jsonify
from controladores.controlador_cargo import (
    obtener_cargo,
    obtener_cargo_por_id,
    insertar_cargo,
    actualizar_cargo,
    eliminar_cargo
)
from routers.router_main import requerido_login


def registrar_rutas(app):
    # Ruta para la página principal de gestión de cargos
    @app.route("/gestionar_cargo", methods=["GET"])
    @requerido_login
    def gestionar_cargo():
        try:
            # Obtener la lista de cargos para la tabla
            cargos = obtener_cargo()
            return render_template("ministro/gestionar_cargo.html", cargos=cargos)
        except Exception as e:
            return jsonify(success=False, message="Error al cargar la página: " + str(e))

    @app.route("/insertar_cargo", methods=["POST"])
    @requerido_login
    def procesar_insertar_cargo():
        try:
            nombre = request.form["nombre"]
            # Estado activo por defecto
            estado = request.form.get("estado", default="1")
            insertar_cargo(nombre, estado)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al insertar cargo: " + str(e))


    @app.route("/procesar_actualizar_cargo", methods=["POST"])
    @requerido_login
    def procesar_actualizar_cargo():
        try:
            data = request.json
            id = data.get("id")
            nombre = data.get("nombre", None)  # El nombre puede o no cambiar
            estado = data.get("estado", 1)  # Estado del cargo (1: activo, 0: inactivo)
            actualizar_cargo(id, nombre, estado)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al actualizar el cargo: " + str(e))

    # Ruta para eliminar un cargo
    @app.route("/eliminar_cargo", methods=["POST"])
    @requerido_login
    def procesar_eliminar_cargo():
        try:
            id = request.json["id"]
            eliminar_cargo(id)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al eliminar el cargo: " + str(e))
