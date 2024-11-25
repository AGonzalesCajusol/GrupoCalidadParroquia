from flask import jsonify, render_template, request, redirect, url_for, flash, send_file
import traceback
from datetime import datetime,timedelta


from controladores.controlador_recaudaciones import (
    insertar_recaudacion,
    obtener_recaudaciones,
    obtener_rango_de_años,
    obtener_tipos_recaudacion,
    obtener_id_sede_por_nombre,
    obtener_recaudaciones_por_año,
    obtener_id_tipoR_por_nombre,
    actualizar_recaudacion,
    eliminar_recaudacion,
    obtener_todos_los_tipos_recaudacion,
    obtener_tipos_recaudacion_activos,
    obtener_recaudaciones_por_mes,
    obtener_recaudaciones_por_sede
)
from routers.router_main import requerido_login

def registrar_rutas(app):
    # Ruta para gestionar recaudaciones
    @app.route("/gestionar_recaudaciones", methods=["GET"])
    @requerido_login
    def gestionar_recaudaciones():
        recaudaciones = obtener_recaudaciones()
        tipos = obtener_tipos_recaudacion()  # Obtén los tipos de recaudación
        años = obtener_rango_de_años()  # Obtenemos el rango de años disponibles en la BD
        return render_template("tipo_financiero/gestionar_recaudaciones.html", recaudaciones=recaudaciones, tipos=tipos, años=años)
    
    @app.route('/reporte_recaudaciones', methods=['GET'])
    @requerido_login
    def reporte_recaudaciones():
        años_tuplas = obtener_rango_de_años()
        años = [año[0] for año in años_tuplas]  # Extraer solo el año de cada tupla
        return render_template('tipo_financiero/reporte_recaudaciones.html', años=años)


    @app.route("/procesar_actualizar_recaudacion", methods=["POST"])
    @requerido_login
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
    @requerido_login
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
    @requerido_login
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
    #Endpoint para obtener todos los tipos (activos e inactivos)

    @app.route("/api/tipos_todos", methods=["GET"])
    @requerido_login
    def api_tipos_todos():
        try:
            tipos = obtener_todos_los_tipos_recaudacion()
            lista_tipos = [{"tipo": tipo[1]} for tipo in tipos]
            return jsonify({"data": lista_tipos})
        except Exception as e:
            print(f"Error al obtener todos los tipos de recaudación: {e}")
            return jsonify({"error": "Error al obtener los tipos de recaudación"}), 500
    #Endpoint para obtener solo los tipos activos
    @app.route("/api/tipos_activos", methods=["GET"])
    @requerido_login
    def api_tipos_activos():
        try:
            tipos = obtener_tipos_recaudacion_activos()
            lista_tipos = [{"tipo": tipo[1]} for tipo in tipos]
            return jsonify({"data": lista_tipos})
        except Exception as e:
            print(f"Error al obtener tipos de recaudación activos: {e}")
            return jsonify({"error": "Error al obtener los tipos de recaudación activos"}), 500
        
    @app.route('/api/recaudaciones_por_fecha', methods=['GET'])
    @requerido_login
    def obtener_recaudaciones_por_fecha():
        year = request.args.get('year')
        recaudaciones = obtener_recaudaciones_por_año(year)  # Función que obtiene los datos de la base de datos
        return jsonify(recaudaciones)

    @app.route('/api/recaudaciones_por_fecha')
    @requerido_login
    def api_recaudaciones_por_fecha():
        año = request.args.get('year', type=int)
        if not año:
            return jsonify([])
        
        try:
            # Obtener las recaudaciones del año
            recaudaciones = obtener_recaudaciones_por_año(año)
            
            # Crear un diccionario para agrupar por mes
            datos_por_mes = {}
            
            for rec in recaudaciones:
                # rec[1] es la fecha en formato "Fri, 10 Mar 2023 00:00:00 GMT"
                fecha = datetime.strptime(rec[1], '%a, %d %b %Y %H:%M:%S GMT') if isinstance(rec[1], str) else rec[1]
                mes = fecha.month
                # rec[2] es el monto como string "400.00"
                monto = float(rec[2]) if isinstance(rec[2], str) else float(rec[2])
                
                if mes not in datos_por_mes:
                    datos_por_mes[mes] = 0
                datos_por_mes[mes] += monto
            
            # Convertir a lista de diccionarios
            resultado = [
                {
                    "mes": mes,
                    "monto_total": monto
                }
                for mes, monto in datos_por_mes.items()
            ]
            
            # Ordenar por mes
            resultado.sort(key=lambda x: x["mes"])
            
            print("Datos procesados:", resultado)  # Para debug
            return jsonify(resultado)
        except Exception as e:
            print(f"Error al procesar recaudaciones: {e}")
            traceback.print_exc()  # Para ver el error completo
            return jsonify([])