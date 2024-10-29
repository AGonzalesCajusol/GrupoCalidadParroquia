from flask import render_template, request, redirect, url_for, flash, jsonify
import traceback  # Para capturar detalles del error
from controladores.controlador_recaudaciones import (
    insertar_recaudacion,
    obtener_recaudaciones,
    obtener_recaudacion_por_id,
    actualizar_recaudacion,
    dar_baja_recaudacion,
    eliminar_recaudacion,
    obtener_tipos_recaudacion,
    obtener_id_sede_por_nombre
)

def registrar_rutas(app):
    # Ruta para gestionar recaudaciones
    @app.route("/gestionar_recaudacion", methods=["GET"])
    def gestionar_recaudacion():
        recaudaciones = obtener_recaudaciones()  # Obtener todas las recaudaciones
        return render_template("recaudacion/gestionar_recaudacion.html", recaudaciones=recaudaciones)

    # Ruta para mostrar el formulario de registro de una nueva recaudación
    @app.route("/registrar_recaudacion", methods=["GET"])
    def formulario_registrar_recaudacion():
        tipos_recaudacion = obtener_tipos_recaudacion()
        return render_template("recaudacion/registrar_recaudacion.html", tipos_recaudacion=tipos_recaudacion)

    # Ruta para insertar una nueva recaudación
    @app.route("/insertar_recaudacion", methods=["POST"])
    def procesar_insertar_recaudacion():
        try:
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            id_sede = request.form["id_sede"]
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]
            estado = int(request.form.get("estado", 1))  # Asegurarse de convertir 'estado' a un entero

            insertar_recaudacion(monto, observacion, id_sede, id_tipo_recaudacion, estado)
            recaudaciones = obtener_recaudaciones()

            # Preparar la respuesta JSON
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "fecha": rec[1],
                    "hora": rec[2],
                    "monto": rec[3],
                    "observacion": rec[4],
                    "sede": rec[6],
                    "tipo_recaudacion": rec[7],
                    "estado": "Activo" if rec[5] == 1 else "Inactivo"
                }
                for rec in recaudaciones
            ]

            return jsonify({
                "success": True,
                "message": "La recaudación fue agregada exitosamente.",
                "recaudaciones": recaudaciones_data
            })
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Error al insertar recaudación: {str(e)}"
            }), 400

    # Ruta para mostrar el formulario de edición de una recaudación
    @app.route("/editar_recaudacion/<int:id>", methods=["GET"])
    def formulario_editar_recaudacion(id):
        recaudacion = obtener_recaudacion_por_id(id)
        tipos_recaudacion = obtener_tipos_recaudacion()
        return render_template("recaudacion/editar_recaudacion.html", recaudacion=recaudacion, tipos_recaudacion=tipos_recaudacion)

    # Ruta para manejar la actualización de una recaudación
    @app.route("/actualizar_recaudacion", methods=["POST"])
    def procesar_actualizar_recaudacion():
        try:
            # Obtener datos del formulario
            id_recaudacion = request.form["id"]
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            id_sede = request.form["id_sede"]
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]
            estado = 1 if request.form.get("estado") == "1" else 0

            # Llamar a la función que actualiza la recaudación en la base de datos
            actualizar_recaudacion(monto, observacion, id_sede, id_tipo_recaudacion, estado, id_recaudacion)
            
            # Obtener las recaudaciones actualizadas para enviar en la respuesta
            recaudaciones = obtener_recaudaciones()
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "fecha": rec[1],
                    "hora": rec[2],
                    "monto": rec[3],
                    "observacion": rec[4],
                    "sede": rec[6],
                    "tipo_recaudacion": rec[7],
                    "estado": "Activo" if rec[5] == 1 else "Inactivo"
                }
                for rec in recaudaciones
            ]
            
            return jsonify({"success": True, "recaudaciones": recaudaciones_data, "message": "La recaudación fue actualizada exitosamente"}), 200

        except Exception as e:
            return jsonify({"success": False, "message": f"Error al actualizar: {str(e)}"}), 400

    # Ruta para eliminar una recaudación
    @app.route("/eliminar_recaudacion", methods=["POST"])
    def procesar_eliminar_recaudacion():
        id_recaudacion = request.form["id"]
        resultado = eliminar_recaudacion(id_recaudacion)
        
        if resultado:
            message = "No se puede eliminar la recaudación porque está referenciada en otra tabla."
            return jsonify({"success": False, "message": message}), 400
        else:
            recaudaciones = obtener_recaudaciones()
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "fecha": rec[1],
                    "hora": rec[2],
                    "monto": rec[3],
                    "observacion": rec[4],
                    "sede": rec[6],
                    "tipo_recaudacion": rec[7],
                    "estado": "Activo" if rec[5] == 1 else "Inactivo"
                }
                for rec in recaudaciones
            ]
            message = "La recaudación fue eliminada exitosamente"
            return jsonify({"success": True, "recaudaciones": recaudaciones_data, "message": message})

    # Ruta para dar de baja una recaudación
    @app.route("/dar_baja_recaudacion", methods=["POST"])
    def procesar_dar_baja_recaudacion():
        try:
            id_recaudacion = request.form.get('id')
            dar_baja_recaudacion(id_recaudacion)
            
            recaudaciones = obtener_recaudaciones()
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "fecha": rec[1],
                    "hora": rec[2],
                    "monto": rec[3],
                    "observacion": rec[4],
                    "sede": rec[6],
                    "tipo_recaudacion": rec[7],
                    "estado": "Activo" if rec[5] == 1 else "Inactivo"
                }
                for rec in recaudaciones
            ]
            
            message = "La recaudación fue dada de baja exitosamente"
            return jsonify({"success": True, "recaudaciones": recaudaciones_data, "message": message})
        
        except Exception as e:
            message = f"Hubo un error al dar de baja la recaudación: {str(e)}"
            return jsonify({"success": False, "message": message}), 500
