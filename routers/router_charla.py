from flask import render_template, redirect, jsonify, request
from bd import obtener_conexion 
import controladores.controlador_charla as cncha
import controladores.controlador_ministro as cmin
import controladores.controlador_actosliturgicos as contro
import controladores.controlador_tema as tema
import controladores.controlador_sede as sed 

def registrar_rutas(app):
    @app.route("/gestionar_programacionActo", methods=["GET"])
    def gestionar_programacionActo():
        acto = contro.listar_sacramentos()
        id_actoliturgico = request.args.get('id_actoliturgico')
        fecha_inicio = request.args.get('fecha_inicio')
        id_charla = request.args.get('id_charla')  # Obtener el nuevo parámetro
        print(id_actoliturgico,id_charla,fecha_inicio)
        return render_template("charlas/charlas.html", acto=acto, id_actoliturgico=id_actoliturgico, fecha_inicio=fecha_inicio, id_charla=id_charla)

    
    @app.route("/ministros_registro", methods=["GET"])
    def ministros_registro():
        ministros = cmin.obtener_ministros()
        lista_ministro = []
        for ministro in ministros:
            lista_ministro.append({
                'numero_doc': ministro[2],
                'nombre_ministro': ministro[1],
                'sede': ministro[8]
            })
        return jsonify(lista_ministro)

    @app.route("/sedes_registro", methods=["GET"])
    def sedes_registro():
        sedes = sed.obtener_sedes_charla()
        lista_sede = []
        for sede in sedes:
            lista_sede.append({
                'id_sede': sede[0],
                'nombre_sede': sede[1],
                'direccion': sede[2],
                'telefono': sede[3],
                'correo': sede[4]
            })
        return jsonify(lista_sede)

    @app.route('/obtener_programacion_por_acto', methods=['GET'])
    def obtener_programacion_por_acto():
        acto_id = request.args.get('acto')
        charla_id = request.args.get('charla')  # Capturamos el parámetro id_charla

        if not acto_id or not charla_id:
            print("ID de acto o charla no proporcionado")
            return jsonify({"error": "ID de acto o charla no proporcionado"}), 400

        try:
            # Asegúrate de que la función en el controlador use ambos parámetros
            programaciones = tema.obtener_programacion_por_acto_y_charla(acto_id, charla_id)
            print(f"Programaciones obtenidas: {programaciones}")
            return jsonify(programaciones)
        except Exception as e:
            print(f"Error en la función obtener_programacion_por_acto: {e}")
            return jsonify({"error": "Error al obtener las programaciones"}), 500

    ## oara insertar los datos -------------------
    @app.route('/registrar_programacion_en_bloque', methods=['POST'])
    def registrar_programacion_en_bloque_route():
        data = request.get_json()
        id_charla = data.get('id_charla')
        programaciones = data.get('programaciones', [])

        # Llamamos al controlador para realizar la lógica de negocio
        response = cncha.registrar_programacion_en_bloque(id_charla, programaciones)
        return jsonify(response)
    
    @app.route('/obtener_temas_por_acto', methods=['GET'])
    def obtener_temas_por_acto_route():
        acto = request.args.get('acto')

        if not acto:
            return jsonify({"success": False, "error": "ID del acto litúrgico no proporcionado"}), 400

        temas = tema.obtener_temas_por_acto(acto)

        if temas is None:
            return jsonify({"success": False, "error": "Error al obtener los temas"}), 500
        
        return jsonify({"success": True, "temas": temas})