from flask import render_template, request, redirect, url_for, flash,jsonify
import traceback  # Para capturar detalles del error
from controladores.controlador_tipo_recaudacion import (
    insertar_tipo_recaudacion,
    obtener_tipos_recaudacion,
    obtener_tipo_recaudacion_por_id,
    actualizar_tipo_recaudacion,
    dar_baja_tipo_recaudacion,
    verificar_nombre_recaudacion_existe,
    eliminar_tipo_recaudacion
)
from routers.router_main import requerido_login

def registrar_rutas(app):
    # Ruta para gestionar tipos de recaudación
    @app.route("/gestionar_tipo_recaudacion", methods=["GET"])
    @requerido_login
    def gestionar_tipo_recaudacion():
        tipos_recaudacion = obtener_tipos_recaudacion()  # Obtener todos los tipos de recaudación
        return render_template("tipo_financiero/gestionar_tipo_recaudacion.html", tipos_recaudacion=tipos_recaudacion)

    # Ruta para mostrar el formulario de registro de un nuevo tipo de recaudación
    @app.route("/registrar_tipo_recaudacion", methods=["GET"])
    @requerido_login
    def formulario_registrar_tipo_recaudacion():
        return render_template("tipo_recaudacion/registrar_tipo_recaudacion.html")

    @app.route("/insertar_tipo_recaudacion", methods=["POST"])
    @requerido_login
    def procesar_insertar_tipo_recaudacion():
        try:
            nombre_recaudacion = request.form["nombre_recaudacion"].strip()
            tipo = request.form["tipo"]
            estado = int(request.form.get("estado", 1))  # Asegurarse de convertir 'estado' a un entero

            # Verificar si el nombre de recaudación ya existe en la base de datos
            if verificar_nombre_recaudacion_existe(nombre_recaudacion):
                return jsonify({
                    "success": False,
                    "message": "Este nombre de recaudación ya existe. Por favor, elige otro nombre."
                }), 400

            # Insertar el nuevo tipo de recaudación si no existe
            insertar_tipo_recaudacion(nombre_recaudacion, tipo, estado)
            tipos_recaudacion = obtener_tipos_recaudacion()

            # Preparar la respuesta JSON con los datos actualizados
            tipos_recaudacion_data = [
                {
                    "id": tipo[0],
                    "nombre": tipo[1],
                    "tipo": "Monetario" if tipo[2] == 1 else "No Monetario",
                    "estado": "Activo" if tipo[3] == 1 else "Inactivo"
                }
                for tipo in tipos_recaudacion
            ]

            return jsonify({
                "success": True,
                "message": "El tipo de recaudación fue agregado exitosamente.",
                "tipos_recaudacion": tipos_recaudacion_data
            })

        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Error al insertar tipo de recaudación: {str(e)}"
            }), 400


    # Ruta para mostrar el formulario de edición de un tipo de recaudación
    @app.route("/editar_tipo_recaudacion/<int:id>", methods=["GET"])
    @requerido_login
    def formulario_editar_tipo_recaudacion(id):
        tipo_recaudacion = obtener_tipo_recaudacion_por_id(id)
        return render_template("tipo_recaudacion/editar_tipo_recaudacion.html", tipo_recaudacion=tipo_recaudacion)

    # Ruta para manejar la actualización de un tipo de recaudación
    @app.route("/actualizar_tipo_recaudacion", methods=["POST"])
    @requerido_login
    def procesar_actualizar_tipo_recaudacion():
        try:
            # Obtener datos del formulario
            id = request.form["id"]
            nombre_recaudacion = request.form["nombre_recaudacion"]
            tipo = request.form["tipo"]
            
            # Convertir el estado a entero (1 o 0) para guardar correctamente
            estado = 1 if request.form.get("estado") == "1" else 0

            # Llamar a la función que actualiza el tipo de recaudación en la base de datos
            actualizar_tipo_recaudacion(nombre_recaudacion, tipo, estado, id)
            
            # Obtener los tipos de recaudación actualizados para enviar en la respuesta
            tipos_recaudacion = obtener_tipos_recaudacion()
            tipos_recaudacion_data = [
                {
                    "id": tipo[0],
                    "nombre": tipo[1],
                    "tipo": "Monetario" if tipo[2] == 1 else "No Monetario",
                    "estado": "Activo" if tipo[3] == 1 else "Inactivo"
                }
                for tipo in tipos_recaudacion
            ]
            
            # Responder con los datos actualizados en formato JSON
            return jsonify({"success": True, "tipos_recaudacion": tipos_recaudacion_data, "message": "El tipo de recaudación fue actualizado exitosamente"}), 200

        except Exception as e:
            # En caso de error, devolver un mensaje de error en JSON
            return jsonify({"success": False, "message": f"Error al actualizar: {str(e)}"}), 400
    # Ruta para eliminar un tipo de recaudación
    @app.route("/eliminar_tipo_recaudacion", methods=["POST"])
    @requerido_login
    def procesar_eliminar_tipo_recaudacion():
        id = request.form["id"]
        resultado = eliminar_tipo_recaudacion(id)
        
        if resultado:
            # Si hay un error, devuelve el mensaje de error
            message = "No se puede eliminar el tipo de recaudación porque está referenciado en otra tabla."
            return jsonify({"success": False, "message": message}), 400
        else:
            tipos_recaudacion = obtener_tipos_recaudacion()
            tipos_recaudacion_data = [
                {
                    "id": tipo[0],
                    "nombre": tipo[1],
                    "tipo": "Monetario" if tipo[2] == 1 else "No Monetario",
                    "estado": "Activo" if tipo[3] == 1 else "Inactivo"
                }
                for tipo in tipos_recaudacion
            ]
            message = "El tipo de recaudación fue eliminado exitosamente"
            return jsonify({"success": True, "tipos_recaudacion": tipos_recaudacion_data, "message": message})
    
    # Ruta para dar de baja un tipo de recaudación
    @app.route("/dar_baja_tipo_recaudacion", methods=["POST"])
    @requerido_login
    def procesar_dar_baja_tipo_recaudacion():
        try:
            id = request.form.get('id')
            dar_baja_tipo_recaudacion(id)
            
            # Obtener los tipos de recaudación actualizados
            tipos_recaudacion = obtener_tipos_recaudacion()
            tipos_recaudacion_data = [
                {
                    "id": tipo[0],
                    "nombre": tipo[1],
                    "tipo": "Monetario" if tipo[2] == 1 else "No Monetario",
                    "estado": "Activo" if tipo[3] == 1 else "Inactivo"
                }
                for tipo in tipos_recaudacion
            ]
            
            # Enviar respuesta JSON con el mensaje de éxito
            message = "El tipo de recaudación fue dado de baja exitosamente"
            return jsonify({"success": True, "tipos_recaudacion": tipos_recaudacion_data, "message": message})
        
        except Exception as e:
            # Enviar respuesta JSON con el mensaje de error
            message = f"Hubo un error al dar de baja el tipo de recaudación: {str(e)}"
            return jsonify({"success": False, "message": message}), 500


