from flask import render_template, request, redirect, url_for, flash, jsonify
from controladores.controlador_tema import (
        obtener_todos_los_temas,
        insertar_tema,
        obtener_tema_por_id,
        actualizar_tema,
        eliminar_tema_por_id
)
import controladores.controlador_actosliturgicos as acto

def registrar_rutas(app):
    
    @app.route("/gestionar_tema", methods=["GET"])
    def gestionar_tema():        
        actos = acto.listar_nombres_actos()
        return render_template("tema/gestionar_tema.html", actos=actos)

    @app.route("/api/obtener_temas", methods=["GET"])
    def obtener_temas_endpoint():
        try:
            temas = obtener_todos_los_temas()
            
            return jsonify({"success": True, "temas": temas}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500
    
    @app.route("/insertar_tema", methods=["POST"])
    def procesar_insertar_tema():
            descripcion = request.form.get("descripcion")
            id_actoliturgico = request.form.get("id_actoliturgico")
            dias_semana = request.form.get("dias_semana")
            hora_inicio = request.form.get("hora_inicio")
            duracion = request.form.get("duracion")
            orden = request.form.get("orden")

            try:
                exito = insertar_tema(descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden)
                if exito:
                    return jsonify({"success": True, "message": "El tema fue agregado exitosamente"})
                else:
                    return jsonify({"success": False, "message": "No se pudo agregar el tema"}), 500
            except Exception as e:
                return jsonify({"success": False, "message": str(e)}), 500

    @app.route("/api/obtener_tema/<int:id_tema>", methods=["GET"])
    def obtener_tema(id_tema):
        tema = obtener_tema_por_id(id_tema)
        if tema:
            return jsonify({"success": True, "tema": tema})
        else:
            return jsonify({"success": False, "message": "Tema no encontrado"}), 404

    @app.route("/actualizar_tema", methods=["POST"])
    def procesar_actualizar_tema():
        id_tema = request.form.get("id_tema")
        descripcion = request.form.get("descripcion")
        id_actoliturgico = request.form.get("id_actoliturgico")
        dias_semana = request.form.get("dias_semana")
        hora_inicio = request.form.get("hora_inicio")
        duracion = request.form.get("duracion")
        orden = request.form.get("orden")

        if actualizar_tema(id_tema, descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden):
            return jsonify({"success": True, "message": "Tema actualizado exitosamente"})
        else:
            return jsonify({"success": False, "message": "No se pudo actualizar el tema"}), 500

    @app.route("/eliminar_tema", methods=["POST"])
    def procesar_eliminar_tema():
        id_tema = request.form.get("id_tema")
        if eliminar_tema_por_id(id_tema):
            return jsonify({"success": True, "message": "Tema eliminado exitosamente"})
        else:
            return jsonify({"success": False, "message": "No se pudo eliminar el tema"}), 500    
