from flask import render_template, request, jsonify
from controladores.controlador_celebracion_crud import (
    obtener_celebraciones_crud,
    insertar_celebracion_crud,
    eliminar_celebracion_crud,
    editar_celebracion_crud,
    cambiar_estado_celebracion
)
from routers.router_main import requerido_login
import controladores.controlador_sede as csede
import controladores.controlador_actosliturgicos as cacto

def registrar_rutas(app):
    @app.route('/gestionar_celebracion_crud', methods=['GET'])
    def gestionar_celebracion_crud():
        try:
            sedes = csede.obtener_sedes_celebracion()
            actos = cacto.obtener_actos_liturgicos()
            return render_template('celebracion/gestionar_celebracion_crud.html',  sedes=sedes, actos=actos)
        except Exception as e:
            return jsonify({"error": str(e)})

    @app.route('/listar_celebraciones_crud', methods=['GET'])
    def listar_celebraciones():        
        try:
            celebraciones = obtener_celebraciones_crud()
            return jsonify(celebraciones)
        except Exception as e:
            return jsonify({"error": str(e)})
        
    @app.route('/insertar_celebracion_crud', methods=['POST'])
    def insertar_celebracion():
        try:
            # Obtener los datos del formulario
            data = request.form
            fecha = data.get('fecha')
            hora_inicio = data.get('hora_inicio')
            hora_fin = data.get('hora_fin')
            estado = data.get('estado')
            id_sede = data.get('id_sede')
            id_actoliturgico = data.get('id_actoliturgico')

            # Llamar al controlador para insertar en la base de datos
            insertar_celebracion_crud(fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico)

            # Retornar una respuesta exitosa
            return jsonify({"success": True, "message": "Celebración registrada correctamente."})
        except Exception as e:
            return jsonify({"success": False, "message": f"Error al registrar la celebración: {str(e)}"})
        

    @app.route('/eliminar_celebracion_crud', methods=['POST'])
    def eliminar_celebracion():
        try:
            # Obtener el ID desde la solicitud JSON
            data = request.get_json()
            id_celebracion = data.get('id')

            # Llamar al controlador para eliminar el registro
            eliminar_celebracion_crud(id_celebracion)

            # Retornar respuesta exitosa
            return jsonify({"success": True, "message": "Celebración eliminada correctamente."})
        except Exception as e:
            return jsonify({"success": False, "message": f"Error al eliminar la celebración: {str(e)}"})


    @app.route('/editar_celebracion_crud', methods=['POST'])
    def editar_celebracion():
        try:
            # Obtener los datos del formulario
            data = request.form
            id_celebracion = data.get('id_celebracion')
            fecha = data.get('fecha')
            hora_inicio = data.get('hora_inicio')
            hora_fin = data.get('hora_fin')
            estado = data.get('estado')
            id_sede = data.get('id_sede')
            id_actoliturgico = data.get('id_actoliturgico')

            # Llamar al controlador para actualizar el registro
            editar_celebracion_crud(id_celebracion, fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico)

            # Responder con éxito
            return jsonify({"success": True, "message": "Celebración actualizada correctamente."})
        except Exception as e:
            return jsonify({"success": False, "message": f"Error al actualizar la celebración: {str(e)}"})


    @app.route('/dar_de_baja_celebracion', methods=['POST'])
    def dar_de_baja_celebracion():
        try:
            # Obtener el ID desde la solicitud JSON
            data = request.get_json()
            id_celebracion = data.get('id')

            # Llamar al controlador para actualizar el estado
            cambiar_estado_celebracion(id_celebracion, 'I')

            # Responder con éxito
            return jsonify({"success": True, "message": "La celebración ha sido dada de baja correctamente."})
        except Exception as e:
            return jsonify({"success": False, "message": f"Error al dar de baja la celebración: {str(e)}"})
