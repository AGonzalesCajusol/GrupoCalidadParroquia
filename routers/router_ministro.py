from flask import render_template, request, redirect, url_for, flash
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
        sedes= obtener_sede()
        cargos=obtener_cargo()
        return render_template("ministro/gestionar_ministro.html", ministros=ministros,tipos = tipos, cargos=cargos,sedes=sedes)

    # Ruta para mostrar el formulario de registro de un nuevo ministro
    @app.route("/registrar_ministro", methods=["GET"])
    def formulario_registrar_ministro():
        return render_template("ministro/registrar_ministro.html", )

    # Ruta para insertar un nuevo ministro
    @app.route("/insertar_ministro", methods=["POST"])
    def procesar_insertar_ministro():
        nombre = request.form["nombre"]
        nacimiento = request.form["nacimiento"]
        ordenacion = request.form["ordenacion"]
        actividades = request.form["actividades"]
        id_tipoministro = request.form["id_tipoministro"]
        id_sede = request.form["id_sede"]
        id_cargo = request.form["id_cargo"]
        insertar_ministro(nombre,nacimiento,ordenacion,actividades,id_tipoministro,id_sede,id_cargo)
        flash("El ministro fue agregado exitosamente")
        return redirect(url_for("gestionar_ministro"))

    # Ruta para mostrar el formulario de edición de un ministro
    @app.route("/editar_ministro/<int:id>", methods=["GET"])
    def formulario_editar_ministro(id):
        ministro = obtener_ministro_por_id(id)
        return render_template("ministro/editar_ministro.html", ministro=ministro)

    # Ruta para manejar la actualización de un ministro
    @app.route("/actualizar_ministro", methods=["POST"])
    def procesar_actualizar_ministro():
        id = request.form["id"]  # Captura el ID desde el formulario
        nombre = request.form["nombre"]  # Captura el nombre actualizado
        nacimiento = request.form["nacimiento"]
        ordenacion = request.form["ordenacion"]
        actividades = request.form["actividades"]
        tipoministro = request.form["id_tipoministro"]
        id_tipoministro= obtener_id_tipoMinistro_por_nombre(tipoministro)
        sede = request.form["id_sede"]
        id_sede= obtener_id_sede_por_nombre(sede)
        cargo = request.form["id_cargo"]
        id_cargo= obtener_id_cargo_por_nombre(cargo)

        actualizar_ministro(nombre,nacimiento,ordenacion,actividades,id_tipoministro,id_sede,id_cargo, id)  # Llama a la función que actualiza en la base de datos
        flash("El ministro fue actualizado exitosamente")
        return redirect(url_for("gestionar_ministro"))


    # **Ruta para eliminar un ministro**
    @app.route("/eliminar_ministro", methods=["POST"])
    def procesar_eliminar_ministro():
        id = request.form["id"]  # Captura el ID desde el formulario
        eliminar_ministro(id)  # Llama a la función que elimina en la base de datos
        flash("El ministro fue eliminado exitosamente")
        return redirect(url_for("gestionar_ministro"))
