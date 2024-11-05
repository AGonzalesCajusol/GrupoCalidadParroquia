from flask import render_template, redirect, jsonify, request
from bd import obtener_conexion 
import controladores.controlador_programacion as cncha
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
        id_charla = request.args.get('id_charla')
        return render_template("charlas/programacion.html", acto=acto, id_actoliturgico=id_actoliturgico, fecha_inicio=fecha_inicio, id_charla=id_charla)

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

    @app.route('/obtener_temas_por_acto', methods=['GET'])
    def obtener_temas_por_acto_route():
        acto = request.args.get('acto')
        if not acto:
            return jsonify({"success": False, "error": "ID del acto litúrgico no proporcionado"}), 400
        temas = tema.obtener_temas_por_acto(acto)
        if temas is None:
            return jsonify({"success": False, "error": "Error al obtener los temas"}), 500
        
        return jsonify({"success": True, "temas": temas})

    @app.route("/verificar_programacion", methods=["GET"])
    def verificar_programacion():
        id_charla = request.args.get("id_charla")
        if not id_charla:
            return jsonify({"error": "ID de charla no proporcionado"}), 400
        
        resultado = cncha.verificar_existencia_programacion(id_charla)
        return jsonify(resultado)
            
    @app.route("/generar_programacion_automatica", methods=["POST"])
    def generar_programacion_automatica_route():
        data = request.json
        id_actoliturgico = data.get("id_actoliturgico")
        fecha_inicio = data.get("fecha_inicio")
        id_charla = data.get("id_charla")
        id_ministro = data.get("id_ministro")
        id_sede = data.get("id_sede")

        if not all([id_actoliturgico, fecha_inicio, id_charla, id_ministro, id_sede]):
            return jsonify({"error": "Todos los parámetros son obligatorios"}), 400
        resultado = cncha.generar_programacion_automatica(id_actoliturgico, fecha_inicio, id_charla, id_ministro, id_sede)
        return jsonify(resultado)

    @app.route("/obtener_programacion_por_charla", methods=["GET"])
    def obtener_programacion_por_charla_route():
        id_charla = request.args.get("id_charla")
        if not id_charla:
            return jsonify({"error": "ID de charla no proporcionado"}), 400

        resultado = cncha.obtener_programacion_por_charla(id_charla)
        return jsonify(resultado)

    @app.route("/registrar_programacion", methods=["POST"])
    def registrar_programacion():
        data = request.json
        id_charla = data.get("id_charla")
        programaciones = data.get("programaciones")

        if not id_charla or not programaciones:
            return jsonify({"error": "Datos incompletos"}), 400

        resultado = cncha.registrar_programacion_en_bloque(id_charla, programaciones)
        return jsonify(resultado)

    @app.route("/obtener_ids_por_dni", methods=["POST"])
    def obtener_ids_por_dni():
        data = request.json
        dni = data.get("dni")

        if not dni:
            return jsonify({"success": False, "error": "DNI no proporcionado"}), 400

        resultado = cncha.obtener_ids_por_dni(dni)
        return jsonify(resultado)

    @app.route("/actualizar_programacion", methods=["POST"])
    def actualizar_programacion():
        data = request.json
        id_programacion = data.get("id_programacion")
        tema = data.get("tema")
        fecha = data.get("fecha")
        hora_inicio = data.get("hora_inicio")
        hora_fin = data.get("hora_fin")
        estado = data.get("estado")
        ministro = data.get("ministro")
        sede = data.get("sede")

        # Llama a la función del controlador para actualizar la programación
        resultado = cncha.actualizar_programacion(id_programacion, tema, fecha, hora_inicio, hora_fin, estado, ministro, sede)
        return jsonify(resultado)


    @app.route("/obtener_ministros", methods=["GET"])
    def obtener_ministros():
        termino_busqueda = request.args.get("busqueda", "")
        pagina = int(request.args.get("pagina", 1))
        limite = int(request.args.get("limite", 10))
        offset = (pagina - 1) * limite

        # Obtén la lista de ministros de la base de datos con búsqueda y paginación
        ministros = cmin.obtener_todos_ministros(termino_busqueda, limite, offset)
        return jsonify({"ministros": ministros, "pagina": pagina})

    @app.route("/obtener_sedes", methods=["GET"])
    def obtener_sedes():
        termino_busqueda = request.args.get("busqueda", "")
        pagina = int(request.args.get("pagina", 1))
        limite = int(request.args.get("limite", 10))
        offset = (pagina - 1) * limite

        # Obtén la lista de sedes de la base de datos con búsqueda y paginación
        sedes = sed.obtener_todas_sedes(termino_busqueda, limite, offset)
        return jsonify({"sedes": sedes, "pagina": pagina})

    @app.route("/dar_de_baja_programacion", methods=["POST"])
    def dar_de_baja_programacion():
        data = request.json
        id_programacion = data.get("id_programacion")

        if not id_programacion:
            return jsonify({"success": False, "error": "ID de programación no proporcionado"}), 400

        # Llama a la función del controlador para actualizar el estado
        resultado = cncha.dar_de_baja_programacion(id_programacion)
        return jsonify(resultado)

    @app.route("/eliminar_programacion", methods=["DELETE"])
    def eliminar_programacion():
        data = request.json
        id_programacion = data.get("id_programacion")

        if not id_programacion:
            return jsonify({"success": False, "error": "ID de programación no proporcionado"}), 400

        # Llama a la función del controlador para eliminar la programación
        resultado = cncha.eliminar_programacion(id_programacion)
        return jsonify(resultado)
