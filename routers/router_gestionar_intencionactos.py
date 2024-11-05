from flask import render_template, request, redirect, url_for, flash, jsonify
import traceback  # Para capturar detalles del error
from controladores.controlador_gestionar_intencionactos import (
    insertar_intencion,
    obtener_intenciones,
    obtener_intencion_por_id,
    actualizar_intencion,
    eliminar_intencion,
    obtener_actos_liturgicos  # Importamos la función para obtener actos litúrgicos
)

def registrar_rutas(app):
    # Ruta para gestionar intenciones
    @app.route("/gestionar_intenciones", methods=["GET"])
    def gestionar_intenciones():
        intenciones = obtener_intenciones()  # Obtener todas las intenciones
        actos_liturgicos = obtener_actos_liturgicos()  # Obtener todos los actos litúrgicos
        return render_template("actos_liturgicos/gestionar_intencionactos.html", intenciones=intenciones, actos_liturgicos=actos_liturgicos)

    # Ruta para insertar una nueva intención
    @app.route("/insertar_intencion", methods=["POST"])
    def procesar_insertar_intencion():
        try:
            nombre_intencion = request.form["nombre_intencion"]
            descripcion = request.form["descripcion"]
            id_actoliturgico = int(request.form["id_actoliturgico"])

            resultado = insertar_intencion(nombre_intencion, descripcion, id_actoliturgico)
            intenciones = obtener_intenciones()  # Obtener intenciones actualizadas

            if resultado["success"]:
                intenciones_data = [
                    {
                        "id": intencion[0],
                        "nombre": intencion[1],
                        "descripcion": intencion[2],
                        "nombre_liturgia": intencion[3]
                    }
                    for intencion in intenciones
                ]

                return jsonify({
                    "success": True,
                    "message": resultado["message"],
                    "intenciones": intenciones_data
                })
            else:
                return jsonify({
                    "success": False,
                    "message": resultado["message"]
                }), 400
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Error al insertar la intención: {str(e)}"
            }), 400
    
    # Ruta API para obtener actos litúrgicos en formato JSON
    @app.route("/api/actos_liturgicos", methods=["GET"])
    def api_obtener_actos_liturgicos():
        actos = obtener_actos_liturgicos()
        actos_data = [{"id": acto[0], "nombre": acto[1]} for acto in actos]
        return jsonify(actos_data)
    
    # Ruta para mostrar el formulario de edición de una intención
    @app.route("/editar_intencion/<int:id>", methods=["GET"])
    def formulario_editar_intencion(id):
        intencion = obtener_intencion_por_id(id)
        actos_liturgicos = obtener_actos_liturgicos()  # Obtener actos litúrgicos para el combo box
        return render_template("actos_liturgicos/editar_intencion.html", intencion=intencion, actos_liturgicos=actos_liturgicos)

    # Ruta para ver una intención
    @app.route("/ver_intencion/<int:id>", methods=["GET"])
    def formulario_ver_intencion(id):
        intencion = obtener_intencion_por_id(id)
        actos_liturgicos = obtener_actos_liturgicos()
        return render_template("actos_liturgicos/ver_intencion.html", intencion=intencion, actos_liturgicos=actos_liturgicos)

    # Ruta para actualizar una intención
    @app.route("/actualizar_intencion", methods=["POST"])
    def procesar_actualizar_intencion():
        try:
            id = int(request.form["id"])
            nombre_intencion = request.form["nombre_intencion"]
            descripcion = request.form["descripcion"]
            id_actoliturgico = int(request.form["id_actoliturgico"])

            actualizar_intencion(nombre_intencion, descripcion, id_actoliturgico, id)
            intenciones = obtener_intenciones()  # Obtener intenciones actualizadas

            intenciones_data = [
                {
                    "id": intencion[0],
                    "nombre": intencion[1],
                    "descripcion": intencion[2],
                    "nombre_liturgia": intencion[3]
                }
                for intencion in intenciones
            ]

            return jsonify({"success": True, "intenciones": intenciones_data, "message": "La intención fue actualizada exitosamente"}), 200
        except Exception as e:
            return jsonify({"success": False, "message": f"Error al actualizar: {str(e)}"}), 400

    # Ruta para eliminar una intención
    @app.route("/eliminar_intencion", methods=["POST"])
    def procesar_eliminar_intencion():
        id = int(request.form["id"])
        resultado = eliminar_intencion(id)
        
        if resultado:
            # Si hay un error, devuelve el mensaje de error
            message = "No se puede eliminar la intención porque está referenciada en otra tabla."
            return jsonify({"success": False, "message": message}), 400
        else:
            intenciones = obtener_intenciones()  # Obtener intenciones actualizadas
            intenciones_data = [
                {
                    "id": intencion[0],
                    "nombre": intencion[1],
                    "descripcion": intencion[2],
                    "nombre_liturgia": intencion[3]
                }
                for intencion in intenciones
            ]
            message = "La intención fue eliminada exitosamente"
            return jsonify({"success": True, "intenciones": intenciones_data, "message": message})

