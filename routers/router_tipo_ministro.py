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

    @app.route("/procesar_insertar_tipo_ministro", methods=["POST"])
    def procesar_insertar_tipo_ministro():
        try:
            nombre = request.form["tipo"]
            estado = int(request.form.get("estado", 1))
            insertar_tipo_ministro(nombre, estado)

            # Actualizar la tabla
            tipos_ministro = obtener_tipos_ministro()
            tipos_ministro_data = [
                {"id": tipo[0], "nombre": tipo[1], "estado": "Activo" if tipo[2] == 1 else "Inactivo"}
                for tipo in tipos_ministro
            ]
            return jsonify({"success": True, "message": "Tipo de Ministro agregado exitosamente.", "tipos_ministro": tipos_ministro_data})

        except Exception as e:
            return jsonify({"success": False, "message": f"Error al insertar: {str(e)}"})


    @app.route("/procesar_actualizar_tipo_ministro", methods=["POST"])
    def procesar_actualizar_tipo_ministro():
        try:
            id = request.form["id"]
            nombre = request.form["tipo"]
            estado = int(request.form.get("estado", 1))
            actualizar_tipo_ministro(nombre, estado, id)

            # Actualizar la tabla
            tipos_ministro = obtener_tipos_ministro()
            tipos_ministro_data = [
                {"id": tipo[0], "nombre": tipo[1], "estado": "Activo" if tipo[2] == 1 else "Inactivo"}
                for tipo in tipos_ministro
            ]
            return jsonify({"success": True, "message": "Tipo de Ministro actualizado exitosamente.", "tipos_ministro": tipos_ministro_data})

        except Exception as e:
            return jsonify({"success": False, "message": f"Error al actualizar: {str(e)}"})


    @app.route("/eliminar_tipo_ministro", methods=["POST"])
    def procesar_eliminar_tipo_ministro():
        try:
            id = request.json["id"]
            eliminar_tipo_ministro(id)

            # Actualizar la tabla
            tipos_ministro = obtener_tipos_ministro()
            tipos_ministro_data = [
                {"id": tipo[0], "nombre": tipo[1], "estado": "Activo" if tipo[2] == 1 else "Inactivo"}
                for tipo in tipos_ministro
            ]
            return jsonify({"success": True, "message": "Tipo de Ministro eliminado exitosamente.", "tipos_ministro": tipos_ministro_data})

        except Exception as e:
            return jsonify({"success": False, "message": f"Error al eliminar: {str(e)}"})

    @app.route("/actualizar_estado_tipo_ministro", methods=["POST"])
    def actualizar_estado_tipo_ministro():
        try:
            id = request.form.get("id")
            nuevo_estado = request.form.get("estado") == "1"
            success, message = cambiar_estado_tipo_ministro(id, nuevo_estado)
            if success:
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
                return jsonify({"success": False, "message": message}), 400
        except Exception as e:
            return jsonify({"success": False, "message": f"Error en el servidor: {str(e)}"}), 500
