
from flask import render_template, request, jsonify
from controladores.controlador_celebracion import *
from routers.router_main import requerido_login

from controladores.controlador_actosliturgicos import *

def registrar_rutas(app):

    @app.route("/gestionar_celebracionR", methods=["GET"])
    @requerido_login
    def gestionar_celebracionR():
        try:
            # Obtener las celebraciones con estado 'R'
            celebraciones = obtener_celebraciones_desde_bd()
            # Obtener los actos litúrgicos
            actos_liturgicos = obtener_acto()  # Devuelve una lista [(id, nombre), ...]
            return render_template(
                "celebracion/gestionar_celebracion_realizada.html",
                celebraciones=celebraciones,
                actos_liturgicos=[{"id": a[0], "nombre": a[1]} for a in actos_liturgicos],
            )
        except Exception as e:
            print(f"Error al obtener celebraciones o actos litúrgicos: {str(e)}")
            return jsonify(success=False, message="Error al cargar los datos"), 500

        

    
    @app.route("/gestionar_asistencia_celebracion", methods=["GET", "POST"])
    def gestionar_asistencia_celebracion():
        if request.method == "POST":
            data = request.get_json()  # Leer datos del cuerpo para POST
            id_celebracion = data.get("id_celebracion")
        elif request.method == "GET":
            id_celebracion = request.args.get("id_celebracion")

    #     if not id_celebracion:
    #         return jsonify(success=False, message="ID de celebración no proporcionado"), 400

    #     try:
    #         solicitudes = obtener_solicitudes_por_celebracion(id_celebracion)
    #         return render_template("celebracion/gestionar_asistencias_celebracion.html", solicitudes=solicitudes)
    #     except Exception as e:
    #         print(f"Error al obtener solicitudes: {str(e)}")
    #         return jsonify(success=False, message="Error al cargar las solicitudes"), 500



    # @app.route('/actualizar_asistencias', methods=['POST'])
    # @requerido_login
    # def actualizar_asistencias():
    #     try:
    #         # Obtener datos del cuerpo de la solicitud
    #         data = request.get_json()
    #         asistencias = data.get('asistencias', [])

    #         if not asistencias:
    #             return jsonify(success=False, message="No se recibieron datos para actualizar"), 400

    #         # Conexión a la base de datos
    #         conexion = obtener_conexion()
    #         cursor = conexion.cursor()

    #         # Actualizar cada registro en la base de datos
    #         for asistencia in asistencias:
    #             id_solicitud = asistencia.get('id_solicitud')
    #             asistencia_valor = asistencia.get('asistencia')

    #             # Validar datos antes de ejecutar la consulta
    #             if id_solicitud is not None and asistencia_valor is not None:
    #                 cursor.execute("""
    #                     UPDATE solicitud
    #                     SET asistencia = %s
    #                     WHERE id_solicitud = %s
    #                 """, (asistencia_valor, id_solicitud))

    #         # Confirmar los cambios
    #         conexion.commit()
    #         cursor.close()
    #         conexion.close()

    #         return jsonify(success=True, message="Asistencias actualizadas correctamente")
    #     except Exception as e:
    #         print(f"Error al actualizar asistencias: {str(e)}")
    #         return jsonify(success=False, message="Hubo un error al actualizar las asistencias"), 500
