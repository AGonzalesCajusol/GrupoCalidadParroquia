from flask import render_template, request, redirect, url_for, flash,jsonify
import traceback  # Para capturar detalles del error
from controladores.controlador_tipo_recaudacion import (
    insertar_tipo_recaudacion,
    obtener_tipos_recaudacion,
    obtener_tipo_recaudacion_por_id,
    actualizar_tipo_recaudacion,
    dar_baja_tipo_recaudacion,
    eliminar_tipo_recaudacion
)

def registrar_rutas(app):
    # Ruta para gestionar tipos de recaudación
    @app.route("/gestionar_tipo_recaudacion", methods=["GET"])
    def gestionar_tipo_recaudacion():
        tipos_recaudacion = obtener_tipos_recaudacion()  # Obtener todos los tipos de recaudación
        return render_template("tipo_financiero/gestionar_tipo_recaudacion.html", tipos_recaudacion=tipos_recaudacion)

    # Ruta para mostrar el formulario de registro de un nuevo tipo de recaudación
    @app.route("/registrar_tipo_recaudacion", methods=["GET"])
    def formulario_registrar_tipo_recaudacion():
        return render_template("tipo_recaudacion/registrar_tipo_recaudacion.html")

    # Ruta para insertar un nuevo tipo de recaudación
    @app.route("/insertar_tipo_recaudacion", methods=["POST"])
    def procesar_insertar_tipo_recaudacion():
        nombre_recaudacion = request.form["nombre_recaudacion"]
        tipo = request.form["tipo"]
        estado = request.form.get("estado", default="1")
        insertar_tipo_recaudacion(nombre_recaudacion, tipo, estado)
        flash("El tipo de recaudación fue agregado exitosamente")
        return redirect(url_for("gestionar_tipo_recaudacion"))

    # Ruta para mostrar el formulario de edición de un tipo de recaudación
    @app.route("/editar_tipo_recaudacion/<int:id>", methods=["GET"])
    def formulario_editar_tipo_recaudacion(id):
        tipo_recaudacion = obtener_tipo_recaudacion_por_id(id)
        return render_template("tipo_recaudacion/editar_tipo_recaudacion.html", tipo_recaudacion=tipo_recaudacion)

    # Ruta para manejar la actualización de un tipo de recaudación
    @app.route("/actualizar_tipo_recaudacion", methods=["POST"])
    def procesar_actualizar_tipo_recaudacion():
        try:
            # Captura los datos del formulario
            id = request.form["id"]
            nombre_recaudacion = request.form["nombre_recaudacion"]
            tipo = request.form["tipo"]
            estado = request.form.get('estado') == 'on' 
            actualizar_tipo_recaudacion(nombre_recaudacion, tipo, estado, id)
            flash("El tipo de recaudación fue actualizado exitosamente", "success")
            return redirect(url_for("gestionar_tipo_recaudacion"))

        except Exception as e:
            # En caso de error, captura el mensaje de error y muestra al usuario
            error_message = str(e)
            flash(f"Hubo un error al actualizar el tipo de recaudación: {error_message}", "danger")

            # Usar 'traceback' para registrar el error en el log
            traceback.print_exc()

            # Redirigir a la página de gestión de tipo de recaudación
            return redirect(url_for("gestionar_tipo_recaudacion"))

    # Ruta para eliminar un tipo de recaudación
    @app.route("/eliminar_tipo_recaudacion", methods=["POST"])
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


