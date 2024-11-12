from flask import Response, render_template, redirect, jsonify, request
from bd import obtener_conexion 
import controladores.controlador_programacion as cncha
import controladores.controlador_ministro as cmin
import controladores.controlador_actosliturgicos as contro
import controladores.controlador_tema as tema
import controladores.controlador_sede as sed 
from routers.router_main import requerido_login



def registrar_rutas(app):
    @app.route("/gestionar_programacionActo", methods=["GET"])
    def gestionar_programacionActo():
        acto = contro.listar_sacramentos()
        id_actoliturgico = request.args.get('id_actoliturgico')    
        return render_template("charlas/programacion.html", acto=acto, id_actoliturgico=id_actoliturgico)

    @app.route('/obtener_temas_por_acto', methods=['GET'])
    def route_obtener_temas_por_acto():
        acto_id = request.args.get('acto')
        if not acto_id:
            return jsonify({"success": False, "error": "ID de acto no proporcionado"}), 400

        temas = cncha.obtener_temas_por_acto(acto_id)
        
        # Verificar si el resultado es válido antes de devolverlo
        if isinstance(temas, Response):
            return temas
        elif temas:
            return jsonify({"success": True, "temas": temas})
        else:
            return jsonify({"success": False, "error": "No se encontraron temas"}), 404

    @app.route('/obtener_actos_liturgicos', methods=['GET'])
    def obtener_actos_liturgicos():
        try:            
            actos = contro.listar_sacramentos()
            if actos:                
                actos_list = [{"id_actoliturgico": acto[0], "descripcion": acto[1]} for acto in actos]
                return jsonify({"success": True, "actos": actos_list})
            else:
                return jsonify({"success": False, "error": "No se encontraron actos litúrgicos"}), 404
        except Exception as e:
            print(f"Error al obtener actos litúrgicos: {e}")
            return jsonify({"success": False, "error": "Error al obtener actos litúrgicos"}), 500
        
    @app.route("/registrar_programacion", methods=["POST"])
    def registrar_programacion():
        data = request.json
        programaciones = data.get("programaciones")

        if not programaciones:
            return jsonify({"success": False, "error": "No se proporcionaron datos para la programación"}), 400

        for prog in programaciones:
            id_tema = prog.get("id_tema")
            hora_inicio = prog.get("hora_inicio")
            dia_semana = prog.get("dia_semana")
            id_ministro = prog.get("id_ministro")
            id_sede = prog.get("id_sede")
            
            if not all([id_tema, hora_inicio, dia_semana, id_ministro, id_sede]):
                return jsonify({"success": False, "error": "Datos incompletos"}), 400

            # Llamar a la función en el controlador para registrar
            resultado = cncha.registrar_programacion(id_tema, hora_inicio, dia_semana, id_ministro, id_sede)
            if not resultado["success"]:
                return jsonify(resultado), 500

        return jsonify({"success": True, "message": "Programación registrada con éxito"})

    @app.route('/obtener_ministro_sede', methods=['GET'])
    def ruta_obtener_ministro_sede():
        dni = request.args.get('dni')
        if not dni:
            return jsonify({"success": False, "error": "DNI no proporcionado"}), 400

        resultado = cncha.obtener_ministro_y_sede_por_dni(dni)
        
        if resultado:
            id_ministro, id_sede = resultado
            return jsonify({"success": True, "id_ministro": id_ministro, "id_sede": id_sede})
        else:
            return jsonify({"success": False, "error": "No se encontraron datos para el DNI proporcionado"}), 404
        
    @app.route('/verificar_programacion')
    def ruta_verificar_programacion():
        id_acto = request.args.get('acto')
        if not id_acto:
            return jsonify({"success": False, "error": "No se proporcionó un id de acto"}), 400

        resultado = cncha.verificar_programacion(id_acto)
        
        if isinstance(resultado, dict):
            return jsonify(resultado)
        else:
            return jsonify({"success": False, "error": "Error al procesar la solicitud"}), 500

    @app.route('/obtener_programacion_detalle', methods=['GET'])
    def obtener_programacion_detalle():
        id_programacion = request.args.get('id_programacion')
        if not id_programacion:
            return jsonify({"success": False, "error": "ID de programación no proporcionado"}), 400

        try:
            detalle = cncha.obtener_detalle_programacion(id_programacion)
            if detalle:
                return jsonify({"success": True, "detalle": detalle})
            else:
                return jsonify({"success": False, "error": "No se encontró la programación"}), 404
        except Exception as e:
            print(f"Error al obtener los detalles de la programación: {e}")
            return jsonify({"success": False, "error": "Error al obtener los detalles"}), 500




