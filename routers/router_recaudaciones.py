from flask import jsonify, render_template, request, redirect, url_for, flash, send_file
import traceback
from datetime import datetime,timedelta


from controladores.controlador_recaudaciones import *
from routers.router_main import requerido_login

def registrar_rutas(app):
    # Ruta para gestionar recaudaciones
    @app.route("/gestionar_recaudaciones", methods=["GET"])
    def gestionar_recaudaciones():
        recaudaciones = obtener_recaudaciones()
        tipos = obtener_tipos_recaudacion()  # Obtén los tipos de recaudación
        años = obtener_rango_de_años()  # Obtenemos el rango de años disponibles en la BD
        return render_template("tipo_financiero/gestionar_recaudaciones.html", recaudaciones=recaudaciones, tipos=tipos, años=años)


    @app.route("/procesar_actualizar_recaudacion", methods=["POST"])
    def procesar_actualizar_recaudacion():
        try:
            # Obtener datos del formulario
            id_recaudacion = request.form["id"]
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            nombre_tipo_recaudacion = request.form["id_tipo_recaudacion"]  # Nombre del tipo de recaudación

            # Obtener ID del tipo de recaudación usando el nombre
            id_tipo_recaudacion = obtener_id_tipoR_por_nombre(nombre_tipo_recaudacion)
            if not id_tipo_recaudacion:
                return jsonify(success=False, message="Tipo de recaudación no válido")

            # Obtener nombre de la sede desde las cookies
            nombre_sede = request.cookies.get("sede")
            if not nombre_sede:
                return jsonify(success=False, message="No se pudo obtener el nombre de la sede del usuario.")

            # Obtener ID de la sede usando el nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)
            if not id_sede:
                return jsonify(success=False, message="La sede especificada no se encuentra en la base de datos.")

            # Llamar a la función para actualizar la recaudación en la base de datos
            success = actualizar_recaudacion(monto, observacion, id_tipo_recaudacion, id_recaudacion, id_sede)
            if success:
                # Obtener las recaudaciones actualizadas
                recaudaciones = obtener_recaudaciones()
                recaudaciones_data = [
                    {
                        "id": rec[0],
                        "fecha": rec[1].strftime('%Y-%m-%d') if isinstance(rec[1], datetime) else str(rec[1]),
                        "hora": str(rec[2]) if isinstance(rec[2], timedelta) else rec[2],
                        "monto": rec[3],
                        "observacion": rec[4],
                        "sede": rec[5],
                        "tipo_recaudacion": rec[6]
                    }
                    for rec in recaudaciones
                ]
                return jsonify(success=True, recaudaciones=recaudaciones_data, message="Recaudación actualizada exitosamente")
            else:
                return jsonify(success=False, message="Error al actualizar la recaudación")
        except Exception as e:
            traceback.print_exc()
            return jsonify(success=False, message="Error al actualizar la recaudación: {str(e)}"), 400

    @app.route("/insertar_recaudacion", methods=["POST"])
    def procesar_insertar_recaudacion():
        try:
            # Obtener datos del formulario
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            nombre_tipo_recaudacion = request.form["id_tipo_recaudacion"]  # Nombre del tipo de recaudación

            # Obtener el ID del tipo de recaudación usando el nombre
            id_tipo_recaudacion = obtener_id_tipoR_por_nombre(nombre_tipo_recaudacion)
            if not id_tipo_recaudacion:
                return jsonify(success=False, message="Tipo de recaudación no válido")

            # Obtener nombre de la sede desde las cookies
            nombre_sede = request.cookies.get("sede")
            if not nombre_sede:
                flash("No se pudo obtener el nombre de la sede del usuario.", "error")
                return redirect(url_for("gestionar_recaudaciones"))

            # Obtener el ID de la sede usando el nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)
            if not id_sede:
                flash("La sede especificada no se encuentra en la base de datos.", "error")
                return redirect(url_for("gestionar_recaudaciones"))

            # Llamar a la función para insertar recaudación en la base de datos
            nuevo_id = insertar_recaudacion(monto, observacion, id_sede, id_tipo_recaudacion)
            if nuevo_id is None:
                return jsonify(success=False, message="Error al insertar la recaudación")

            # Obtener las recaudaciones actualizadas después de la inserción
            recaudaciones = obtener_recaudaciones()
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "fecha": rec[1].strftime('%Y-%m-%d') if isinstance(rec[1], datetime) else str(rec[1]),
                    "hora": str(rec[2]) if isinstance(rec[2], timedelta) else rec[2],
                    "monto": rec[3],
                    "observacion": rec[4],
                    "sede": rec[5],
                    "tipo_recaudacion": rec[6]
                }
                for rec in recaudaciones
            ]

            return jsonify({
                "success": True,
                "message": "Recaudación agregada exitosamente.",
                "recaudaciones": recaudaciones_data
            })
        except Exception as e:
            traceback.print_exc()
            return jsonify(success=False, message=f"Error al insertar recaudación: {str(e)}"), 400

    @app.route("/apiaños", methods=["GET"])
    def apiaños():
        try:
            años = obtener_rango_de_años()  # Asegúrate de que esta función retorne una lista de años
            lista_años = []
            for an in años:
                    lista_años.append ({
                        'año':an	
                    })
            return jsonify({'data':lista_años})
        except Exception as e:
            print(f"Error al obtener años: {e}")
            return jsonify({"error": "Error al obtener los años"}), 500
    # Ruta para obtener los tipos de recaudación en formato JSON
    @app.route("/api/tipos", methods=["GET"])
    def api_tipos():
        try:
            tipos = obtener_tipos_recaudacion()
            lista_tipos = [{"tipo": tipo[1]} for tipo in tipos]  # Asegúrate de que 'tipos' sea una lista de tuplas (id, nombre)
            return jsonify({"data": lista_tipos})
        except Exception as e:
            print(f"Error al obtener tipos de recaudación: {e}")
            return jsonify({"error": "Error al obtener los tipos de recaudación"}), 500
