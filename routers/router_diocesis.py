from flask import render_template, request, redirect, url_for, flash
from controladores.controlador_diocesis import (
    insertar_diocesis,  
    obtener_diocesis,
    obtener_diocesis_por_id,
    actualizar_diocesis,
    eliminar_diocesis,
    obtener_departamento,
    obtener_provincia
)

def registrar_rutas(app):
    # Ruta para gestionar diócesis
    @app.route("/gestionar_diocesis", methods=["GET"])
    def gestionar_diocesis():
        diocesis = obtener_diocesis()
        departamento= obtener_departamento()
        provincia = obtener_provincia()
        return render_template("diocesis/gestionar_diocesis.html", diocesis=diocesis, departamento = departamento, provincia = provincia)
    
    # Ruta para mostrar el formulario de registro de una nueva diócesis
    @app.route("/registrar_diocesis", methods=["GET"])
    def formulario_registrar_diocesis():
        return render_template("diocesis/registrar_diocesis.html")

    # Ruta para insertar una nueva diócesis
    @app.route("/insertar_diocesis", methods=["POST"])
    def procesar_insertar_diocesis():
        nombre = request.form["nombre"]
        id_departamento = request.form["id_departamento"]
        id_provincia = request.form["id_provincia"]
        insertar_diocesis(nombre, id_departamento, id_provincia)
        flash("La diócesis fue agregada exitosamente")
        return redirect(url_for("gestionar_diocesis"))

    # Ruta para mostrar el formulario de edición de una diócesis
    @app.route("/editar_diocesis/<int:id>", methods=["GET"])
    def formulario_editar_diocesis(id):
        diocesis = obtener_diocesis_por_id(id)
        return render_template("diocesis/editar_diocesis.html", diocesis=diocesis)

    # Ruta para manejar la actualización de una diócesis
    @app.route("/actualizar_diocesis", methods=["POST"])
    def procesar_actualizar_diocesis():
        id = request.form["id"]
        nombre = request.form["nombre"]
        id_departamento = request.form["id_departamentoEditar"]
        id_provincia = request.form["id_provinciaEditar"]
        actualizar_diocesis(nombre, id_departamento, id_provincia, id)
        flash("La diócesis fue actualizada exitosamente")
        return redirect(url_for("gestionar_diocesis"))

    # Ruta para eliminar una diócesis
    @app.route("/eliminar_diocesis", methods=["POST"])
    def procesar_eliminar_diocesis():
        id = request.form["id"]
        eliminar_diocesis(id)
        flash("La diócesis fue eliminada exitosamente")
        return redirect(url_for("gestionar_diocesis"))
