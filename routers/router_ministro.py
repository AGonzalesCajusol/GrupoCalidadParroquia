from flask import jsonify, render_template, request, redirect, url_for, flash
from controladores.controlador_sede import *
from controladores.controlador_ministro import *
from controladores.controlador_cargo import *
from controladores.controlador_tipo_ministro import *


def registrar_rutas(app):
    # Ruta para gestionar ministro
    @app.route("/gestionar_ministro", methods=["GET"])
    def gestionar_ministro():
        ministros = obtener_ministros()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        tipos = obtener_tipos_ministro()
        sedes = obtener_sede()
        cargos = obtener_cargo()
        return render_template("ministro/gestionar_ministro.html", ministros=ministros, tipos=tipos, cargos=cargos, sedes=sedes)

    # Ruta para mostrar el formulario de registro de un nuevo ministro
    @app.route("/registrar_ministro", methods=["GET"])
    def formulario_registrar_ministro():
        return render_template("ministro/registrar_ministro.html")

    # Ruta para mostrar el formulario de edición de un ministro
    @app.route("/editar_ministro/<int:id>", methods=["GET"])
    def formulario_editar_ministro(id):
        ministro = obtener_ministro_por_id(id)
        return render_template("ministro/editar_ministro.html", ministro=ministro)

    # Procesar la actualización de un ministro
    @app.route("/procesar_actualizar_ministro", methods=["POST"])
    def procesar_actualizar_ministro():
        try:
            id = request.form["id"]
            nombre = request.form["nombre"]
            nacimiento = request.form["nacimiento"]
            ordenacion = request.form["ordenacion"]
            actividades = request.form["actividades"]
            tipo_ministro_nombre = request.form["id_tipoministro"]  # Viene el nombre del tipo de ministro
            sede_nombre = request.form["id_sede"]
            cargo_nombre = request.form["id_cargo"]

            # Obtener el id_tipoministro a partir del nombre
            id_tipoministro = obtener_id_tipoMinistro_por_nombre(tipo_ministro_nombre)
            id_sede=obtener_id_sede_por_nombre(sede_nombre)
            id_cargo=obtener_id_cargo_por_nombre(cargo_nombre)
            
            if id_tipoministro is None:
                return jsonify(success=False, message="Tipo de ministro no válido"), 400

            # Lógica para actualizar un ministro en la base de datos
            actualizar_ministro(nombre, nacimiento, ordenacion, actividades, id_tipoministro, id_sede, id_cargo, id)

            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))

    # Procesar la inserción de un ministro
    @app.route("/insertar_ministro", methods=["POST"])
    def procesar_insertar_ministro():
        try:
            nombre = request.form["nombre"]
            nacimiento = request.form["nacimiento"]
            ordenacion = request.form["ordenacion"]
            actividades = request.form["actividades"]
            tipo_ministro_nombre = request.form["id_tipoministro"]  # Viene el nombre del tipo de ministro
            sede_nombre = request.form["id_sede"]
            cargo_nombre = request.form["id_cargo"]

            # Obtener el id_tipoministro a partir del nombre
            id_tipoministro = obtener_id_tipoMinistro_por_nombre(tipo_ministro_nombre)
            id_sede=obtener_id_sede_por_nombre(sede_nombre)
            id_cargo=obtener_id_cargo_por_nombre(cargo_nombre)
            if id_tipoministro is None:
                return jsonify(success=False, message="Tipo de ministro no válido"), 400

            # Lógica para insertar un ministro en la base de datos
            insertar_ministro(nombre, nacimiento, ordenacion, actividades, id_tipoministro, id_sede, id_cargo)
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))

    # Procesar la eliminación de un ministro
    @app.route("/eliminar_ministro", methods=["POST"])
    def procesar_eliminar_ministro():
        data = request.get_json()
        try:
            eliminar_ministro(data['id'])
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))
