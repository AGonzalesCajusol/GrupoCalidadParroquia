from flask import render_template, request, redirect, url_for, flash
from controladores.controlador_tema import (
    insertar_tema,
    obtener_temas,
    obtener_tema_por_id,
    actualizar_tema,
    eliminar_tema
)

def registrar_rutas(app):
    # Ruta para gestionar temas
    @app.route("/gestionar_tema", methods=["GET"])
    def gestionar_tema():
        temas = obtener_temas()
        return render_template("tema/gestionar_tema.html", temas=temas)

    # Ruta para mostrar el formulario de registro de un nuevo tema
    @app.route("/registrar_tema", methods=["GET"])
    def formulario_registrar_tema():
        return render_template("tema/registrar_tema.html")

    # Ruta para insertar un nuevo tema
    @app.route("/insertar_tema", methods=["POST"])
    def procesar_insertar_tema():
        descripcion = request.form["descripcion"]
        id_actoliturgico = request.form["id_actoliturgico"]
        insertar_tema(descripcion, id_actoliturgico)
        flash("El tema fue agregado exitosamente")
        return redirect(url_for("gestionar_tema"))

    # Ruta para mostrar el formulario de edición de un tema
    @app.route("/editar_tema/<int:id>", methods=["GET"])
    def formulario_editar_tema(id):
        tema = obtener_tema_por_id(id)
        return render_template("tema/editar_tema.html", tema=tema)

    # Ruta para manejar la actualización de un tema
    @app.route("/actualizar_tema", methods=["POST"])
    def procesar_actualizar_tema():
        id_tema = request.form["id"]
        descripcion = request.form["descripcion"]
        id_actoliturgico = request.form["id_actoliturgico"]
        actualizar_tema(descripcion, id_actoliturgico, id_tema)
        flash("El tema fue actualizado exitosamente")
        return redirect(url_for("gestionar_tema"))

    # Ruta para eliminar un tema
    @app.route("/eliminar_tema", methods=["POST"])
    def procesar_eliminar_tema():
        id_tema = request.form["id"]
        eliminar_tema(id_tema)
        flash("El tema fue eliminado exitosamente")
        return redirect(url_for("gestionar_tema"))