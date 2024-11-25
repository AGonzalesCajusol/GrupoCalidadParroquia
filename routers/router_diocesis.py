from flask import render_template, request, redirect, url_for, flash,jsonify
from controladores.controlador_diocesis import (
    insertar_diocesis,  
    obtener_diocesis,
    obtener_diocesis_por_id,
    actualizar_diocesis,
    eliminar_diocesis,
    obtener_departamento,
    obtener_provincia,
    obtener_id_departamento_por_nombre,
    obtener_id_provincia_por_nombre,
    buscar_provincias_por_departamento
)
from routers.router_main import requerido_login

def registrar_rutas(app):
    # Ruta para gestionar diócesis
    @app.route("/gestionar_diocesis", methods=["GET"])
    @requerido_login
    def gestionar_diocesis():
        diocesis = obtener_diocesis()
        departamento= obtener_departamento()
        provincia = obtener_provincia()
        return render_template("diocesis/gestionar_diocesis.html", diocesis=diocesis, departamento = departamento, provincia = provincia)
    
    @app.route("/insertar_diocesis", methods=["POST"])
    @requerido_login
    def procesar_insertar_diocesis():
        try:
            nombre = request.form["nombre"]
            nombre_departamento = request.form["id_departamento"]
            nombre_provincia = request.form["id_provincia"]

            # Obtener los IDs de departamento y provincia basados en sus nombres
            id_departamento = obtener_id_departamento_por_nombre(nombre_departamento)
            id_provincia = obtener_id_provincia_por_nombre(nombre_provincia)

            if id_departamento is None or id_provincia is None:
                return jsonify(success=False, message="Departamento o Provincia no encontrados")

            insertar_diocesis(nombre, id_departamento, id_provincia)

            # Obtener las diócesis actualizadas
            diocesis = obtener_diocesis()
            diocesis_data = [
                {
                    "id": dio[0],
                    "nombre": dio[1],
                    "departamento": dio[2],
                    "provincia": dio[3]
                }
                for dio in diocesis
            ]

            return jsonify(success=True, message="Diócesis agregada exitosamente", diocesis=diocesis_data)
        except Exception as e:
            print(f"Error al insertar diócesis: {e}")
            return jsonify(success=False, message=f"Error al insertar diócesis: {str(e)}"), 400

    # Ruta para actualizar una diócesis
    @app.route("/actualizar_diocesis", methods=["POST"])
    @requerido_login
    def procesar_actualizar_diocesis():
        try:
            id = request.form["id"]
            nombre = request.form["nombre"]
            nombre_departamento = request.form["id_departamento"]
            nombre_provincia = request.form["id_provincia"]

            # Obtener los IDs de departamento y provincia basados en sus nombres
            id_departamento = obtener_id_departamento_por_nombre(nombre_departamento)
            id_provincia = obtener_id_provincia_por_nombre(nombre_provincia)

            if id_departamento is None or id_provincia is None:
                return jsonify(success=False, message="Departamento o Provincia no encontrados")

            actualizar_diocesis(nombre, id_departamento, id_provincia, id)

            # Obtener las diócesis actualizadas
            diocesis = obtener_diocesis()
            diocesis_data = [
                {
                    "id": dio[0],
                    "nombre": dio[1],
                    "departamento": dio[2],
                    "provincia": dio[3]
                }
                for dio in diocesis
            ]

            return jsonify(success=True, message="Diócesis actualizada exitosamente", diocesis=diocesis_data)
        except Exception as e:
            print(f"Error al actualizar diócesis: {e}")
            return jsonify(success=False, message=f"Error al actualizar diócesis: {str(e)}"), 400
    
    @app.route("/eliminar_diocesis", methods=["POST"])
    @requerido_login
    def procesar_eliminar_diocesis():
        id = request.form["id"]
        resultado = eliminar_diocesis(id)
        if resultado["success"]:
            return jsonify(success=True, message=resultado["message"])
        else:
            return jsonify(success=False, message=resultado["message"]), 400

    
    @app.route("/obtener_provincias_por_departamento")
    @requerido_login
    def obtener_provincias_por_departamento():
        nombre_departamento = request.args.get("departamento")
        
        # Obtener el ID del departamento basado en el nombre
        id_departamento = obtener_id_departamento_por_nombre(nombre_departamento)

        # Si el departamento no existe, devolver un error
        if not id_departamento:
            return jsonify({"provincias": []})

        # Obtener las provincias del departamento
        provincias = buscar_provincias_por_departamento(id_departamento)
        provincias_data = [{"nombre": provincia[1]} for provincia in provincias]

        # Devolver las provincias en formato JSON
        return jsonify({"provincias": provincias_data})

