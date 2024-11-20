from flask import render_template, request, jsonify
from controladores.controlador_tipo_ministro import *
from routers.router_main import requerido_login



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
    @app.route("/procesar_insertar_tipo_ministro", methods=["POST"])
    def procesar_insertar_tipo_ministro():
        try:
            data = request.json  # Leer el JSON desde la solicitud
            nombre = data.get("tipo")
            estado = data.get("estado", 1)
            insertar_tipo_ministro(nombre, estado)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al insertar tipo de ministro: " + str(e))


    # Ruta para actualizar un tipo de ministro existente
    @app.route("/procesar_actualizar_tipo_ministro", methods=["POST"])
    def procesar_actualizar_tipo_ministro():
        try:
            data = request.json  # Leer el JSON desde la solicitud
            id = data.get("id")
            nombre = data.get("tipo")
            estado = data.get("estado", 1)
            actualizar_tipo_ministro(nombre, estado, id)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al actualizar el tipo de ministro: " + str(e))

    @app.route("/actualizar_estado_tipo_ministro", methods=["POST"])
    def actualizar_estado_tipo_ministro():
        try:
            # Recibir datos del formulario
            id = request.form.get("id")
            nuevo_estado = request.form.get("estado") == "1"  # `1` indica Activo, `0` indica Inactivo

            # Llamar al controlador para cambiar el estado
            success, message = cambiar_estado_tipo_ministro(id, nuevo_estado)

            if success:
                # Obtener los tipos de ministro actualizados
                tipos_ministro = obtener_tipos_ministro()
                tipos_ministro_data = [
                    {
                        "id": tipo[0],
                        "nombre": tipo[1],
                        "estado": "Activo" if tipo[2] == 1 else "Inactivo"
                    }
                    for tipo in tipos_ministro
                ]
                return jsonify({"success": True, "tipos_ministro": tipos_ministro_data, "message": message})
            else:
                return jsonify({"success": False, "message": message}), 500

        except Exception as e:
            return jsonify({"success": False, "message": f"Error en el servidor: {str(e)}"}), 500


    # Ruta para eliminar un tipo de ministro
    @app.route("/eliminar_tipo_ministro", methods=["POST"])
    def procesar_eliminar_tipo_ministro():
        try:
            id = request.json["id"]
            eliminar_tipo_ministro(id)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message="Error al eliminar el tipo de ministro: " + str(e))
