from flask import jsonify, render_template, request, redirect, url_for,flash,send_file
import traceback
from datetime import datetime, timedelta
from routers.router_main import requerido_login


from controladores.controlador_egresos import (
    insertar_egreso,
    obtener_egresos,
    obtener_rango_de_años,
    obtener_id_sede_por_nombre,
    obtener_egresos_por_año,
    actualizar_egreso,
    obteneregresosporaño

)

def registrar_rutas(app):
    # Ruta para gestionar egresos
    @app.route("/gestionar_egresos", methods=["GET"])
    @requerido_login
    def gestionar_egresos():
        egresos = obtener_egresos()
        años = obtener_rango_de_años()  # Obtenemos el rango de años disponibles en la BD
        return render_template("egresos/gestionar_egresos.html", egresos=egresos, años=años)
    
    # Ruta para modificar un egreso
    @app.route('/procesar_actualizar_egreso', methods=['POST'])
    @requerido_login
    def procesar_actualizar_egreso():
        try:
            # Obtener datos del formulario
            id_egreso = request.form["id"]
            monto = request.form["monto"]
            descripcion = request.form["descripcion"]
            
            # Obtener nombre de la sede desde las cookies
            nombre_sede = request.cookies.get("sede")
            if not nombre_sede:
                return jsonify(success=False, message="No se pudo obtener el nombre de la sede del usuario.")

            # Obtener ID de la sede usando el nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)
            if not id_sede:
                return jsonify(success=False, message="La sede especificada no se encuentra en la base de datos.")

            # Llamar a la función para actualizar el egreso en la base de datos
            success = actualizar_egreso(monto, descripcion, id_egreso, id_sede)
            if success:
                # Obtener los egresos actualizados
                egresos = obtener_egresos()
                egresos_data = [
                    {
                        "id": egr[0],
                        "sede": egr[1],
                        "descripcion": egr[2],
                        "fecha": egr[3].strftime('%Y-%m-%d') if isinstance(egr[3], datetime) else str(egr[3]),
                        "hora": str(egr[4]) if isinstance(egr[4], timedelta) else egr[4],
                        "monto": egr[5],
                    }
                    for egr in egresos
                ]
                return jsonify(success=True, egresos=egresos_data, message="Egreso actualizado exitosamente")
            else:
                return jsonify(success=False, message="Error al actualizar el egreso")
        except Exception as e:
            traceback.print_exc()
            return jsonify(success=False, message="Error al actualizar el  egreso: {str(e)}"), 400


    @app.route("/insertar_egreso", methods=["POST"])
    @requerido_login
    def procesar_insertar_egreso():
        try:
            # Obtener datos del formulario
            monto = request.form["monto"]
            descripcion = request.form["descripcion"]
          
            # Obtener nombre de la sede desde las cookies
            nombre_sede = request.cookies.get("sede")
            if not nombre_sede:
                flash("No se pudo obtener el nombre de la sede del usuario.", "error")
                return redirect(url_for("gestionar_egresos"))

            # Obtener el ID de la sede usando el nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)
            if not id_sede:
                flash("La sede especificada no se encuentra en la base de datos.", "error")
                return redirect(url_for("gestionar_egresos"))

            # Llamar a la función para insertar egreso en la base de datos
            nuevo_id = insertar_egreso(monto, descripcion, id_sede)
            if nuevo_id is None:
                return jsonify(success=False, message="Error al insertar el egreso")

            # Obtener los egresos actualizadas después de la inserción
            egresos = obtener_egresos()
            egresos_data = [
                {
                        "id": egr[0],
                        "sede": egr[1],
                        "descripcion": egr[2],
                        "fecha": egr[3].strftime('%Y-%m-%d') if isinstance(egr[3], datetime) else str(egr[3]),
                        "hora": str(egr[4]) if isinstance(egr[4], timedelta) else egr[4],
                        "monto": egr[5],
                    }
                    for egr in egresos
            ]

            return jsonify({
                "success": True,
                "message": "Egreso agregado exitosamente.",
                "egresos": egresos_data
            })
        except Exception as e:
            traceback.print_exc()
            return jsonify(success=False, message=f"Error al insertar egreso: {str(e)}"), 400
        
    @app.route("/apiaños", methods=["GET"])
    @requerido_login
    def api_años():
        try:
            años = obtener_rango_de_años()  # Esta función debería devolver una lista de años, por ejemplo [(2021,), (2022,), ...]
            lista_años = [{'año': año[0]} for año in años]  # Convertir a formato de diccionario
            return jsonify({'data': lista_años})
        except Exception as e:
            print(f"Error al obtener años: {e}")
            return jsonify({"error": "Error al obtener los años"}), 500
        
    @app.route('/reporte_egresos', methods=['GET'])
    @requerido_login
    def reporte_egresos():
        años = obtener_rango_de_años()
        return render_template('egresos/reporte_egresos.html', años=[a[0] for a in años])


    @app.route('/api/egresos_por_fecha', methods=['GET'])
    @requerido_login
    def obtener_egresos_por_fecha():
        year = request.args.get('year')
        if not year:
            return jsonify([])

        try:
            egresos = obteneregresosporaño(year)  # Cambiado aquí
            resultados = [
                {'mes': egreso['mes'], 'monto_total': egreso['monto_total']}
                for egreso in egresos
            ]
            return jsonify(resultados)
        except Exception as e:
            print(f"Error al obtener egresos: {e}")
            return jsonify([])

#   @app.route("/apiaños", methods=["GET"])
#    def apiaños():
#        try:
#            años = obtener_rango_de_años()  # Asegúrate de que esta función retorne una lista de años
#            lista_años = []
#           for an in años:
#                    lista_años.append ({
#                        'año':an	
#                    })
#            return jsonify({'data':lista_años})
#        except Exception as e:
#            print(f"Error al obtener años: {e}")
#           return jsonify({"error": "Error al obtener los años"}), 500
