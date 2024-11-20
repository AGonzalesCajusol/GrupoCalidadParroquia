from flask import render_template, request, redirect, url_for, flash
from controladores.controlador_charlas import (
    insertar_charla,
    obtener_charlas,
    obtener_charla_por_id,
    actualizar_charla,
    eliminar_charla
)
from routers.router_main import requerido_login

import controladores.controlador_actosliturgicos as acto

def registrar_rutas(app):
    # Ruta para gestionar charlas
    @app.route("/gestionar_charlas", methods=["GET"])
    @requerido_login
    def gestionar_charlas():
        charlas = obtener_charlas()  
        actos = acto.listar_nombres_actos()
        return render_template("charlas/gestion_charlas.html", charlas=charlas, actos=actos)

    
    @app.route("/registrar_charla", methods=["GET"])
    @requerido_login
    def formulario_registrar_charla():
        actos = acto.listar_nombres_actos()
        return render_template("charlas/registrar_charla.html", actos=actos)

    # Ruta para insertar una nueva charla
    @app.route("/insertar_charla", methods=["POST"])
    @requerido_login
    def procesar_insertar_charla():
        estado = request.form["estado"]
        id_actoliturgico = request.form["id_actoliturgico"]
        fecha_inicio = request.form["fecha_inicio"]
        if insertar_charla(estado, id_actoliturgico, fecha_inicio):
            flash("La charla fue agregada exitosamente", "success")
        else:
            flash("Hubo un error al agregar la charla", "danger")
        return redirect(url_for("gestionar_charlas"))

    # Ruta para mostrar el formulario de edición de una charla
    @app.route("/editar_charla/<int:id>", methods=["GET"])
    @requerido_login
    def formulario_editar_charla(id):
        charla = obtener_charla_por_id(id)
        actos = acto.listar_nombres_actos()  # Obtener los nombres de los actos litúrgicos
        return render_template("charlas/editar_charla.html", charla=charla, actos=actos)

    # Ruta para manejar la actualización de una charla
    @app.route("/actualizar_charla", methods=["POST"])
    @requerido_login
    def procesar_actualizar_charla():
        id_charla = request.form["id_charla"]
        estado = request.form["estado"]
        id_actoliturgico = request.form["id_actoliturgico"]
        fecha_inicio = request.form["fecha_inicio"]
        if actualizar_charla(id_charla, estado, id_actoliturgico, fecha_inicio):
            flash("La charla fue actualizada exitosamente", "success")
        else:
            flash("Hubo un error al actualizar la charla", "danger")
        return redirect(url_for("gestionar_charlas"))

    # Ruta para eliminar una charla
    @app.route("/eliminar_charla", methods=["POST"])
    @requerido_login
    def procesar_eliminar_charla():
        id_charla = request.form["id_charla"]
        if eliminar_charla(id_charla):
            flash("La charla fue eliminada exitosamente", "success")
        else:
            flash("Hubo un error al eliminar la charla", "danger")
        return redirect(url_for("gestionar_charlas"))
