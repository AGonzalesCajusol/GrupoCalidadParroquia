
from flask import render_template, request, jsonify
from controladores.controlador_celebracion import *
from routers.router_main import requerido_login


def registrar_rutas(app):

    @app.route("/gestionar_celebracionR", methods=["GET"])
    @requerido_login
    def gestionar_celebracionR():
        try:
            # Obtener las celebraciones con estado 'R'
            celebraciones = obtener_celebraciones_desde_bd()
            return render_template("celebracion/gestionar_celebracion_realizada.html", celebraciones=celebraciones)
        except Exception as e:
            print(f"Error al obtener celebraciones: {str(e)}")
            return jsonify(success=False, message="Error al cargar las celebraciones"), 500


    

    @app.route("/gestionar_asistencia_celebracion/<int:id_celebracion>", methods=["GET"])
    @requerido_login
    def gestionar_asistencia_celebracion(id_celebracion):
    
        try:
            # Obtener solicitudes para el acto litúrgico específico
            solicitudes = obtener_solicitudes_por_celebracion(id_celebracion)
            return render_template("celebracion/gestionar_asistencias_celebracion.html", solicitudes=solicitudes)
        except Exception as e:
            print(f"Error al obtener solicitudes: {str(e)}")
            return jsonify(success=False, message="Error al cargar las solicitudes"), 500


    @app.route('/actualizar_asistencias', methods=['POST'])
    @requerido_login
    def actualizar_asistencias():
        data = request.get_json()
        try:
            asistencias = data.get('asistencias', [])
            for asistencia in asistencias:
                id_solicitud = asistencia.get('id_solicitud')
                estado_asistencia = asistencia.get('asistencia')
                actualizar_asistencia_en_bd(id_solicitud, estado_asistencia)
            return jsonify(success=True, message="Asistencias actualizadas exitosamente")
        except Exception as e:
            return jsonify(success=False, message=str(e)), 500
