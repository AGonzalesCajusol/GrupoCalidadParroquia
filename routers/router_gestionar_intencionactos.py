from flask import Blueprint, request, jsonify, render_template, redirect, url_for, flash
from controladores.controlador_gestionar_intencionactos import (
    obtener_intenciones,
    insertar_intencion,
    actualizar_intencion,
    eliminar_intencion
)
from controladores.controlador_actosliturgicos import obtener_actos_liturgicos  # Asegúrate de tener esta función
#router_intencion = Blueprint("router_intencion", __name__)
def registrar_rutas(app):
    @app.route("/gestionar_intencionactos", methods=["GET"])
    def gestionar_intenciones():
        intenciones = obtener_intenciones()
        return render_template("actos_liturgicos/gestionar_intencionactos.html", intenciones=intenciones)

    @app.route("/procesar_insertar_intencion", methods=["POST"])
    def procesar_insertar_intencion():
        nombre_intencion = request.form.get("nombre_intencion")
        descripcion = request.form.get("descripcion")
        id_actoliturgico = request.form.get("id_actoliturgico")
        
        if insertar_intencion(nombre_intencion, descripcion, id_actoliturgico):
            flash("Intención insertada con éxito", "success")
        else:
            flash("Error al insertar intención", "danger")
        return redirect(url_for("router_intencion.gestionar_intenciones"))

    @app.route("/procesar_actualizar_intencion", methods=["POST"])
    def procesar_actualizar_intencion():
        id_intencion = request.form.get("id")
        nombre_intencion = request.form.get("nombre_intencion")
        descripcion = request.form.get("descripcion")
        id_actoliturgico = request.form.get("id_actoliturgico")
        
        if actualizar_intencion(id_intencion, nombre_intencion, descripcion, id_actoliturgico):
            flash("Intención actualizada con éxito", "success")
        else:
            flash("Error al actualizar intención", "danger")
        return redirect(url_for("router_intencion.gestionar_intenciones"))

    @app.route("/eliminar_intencion/<int:id_intencion>", methods=["POST"])
    def procesar_eliminar_intencion(id_intencion):
        if eliminar_intencion(id_intencion):
            flash("Intención eliminada con éxito", "success")
        else:
            flash("Error al eliminar intención", "danger")
        return redirect(url_for("router_intencion.gestionar_intenciones"))
