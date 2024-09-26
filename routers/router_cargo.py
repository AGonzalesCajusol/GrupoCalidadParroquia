from flask import render_template, request, redirect, url_for, flash
from controladores.controlador_cargo import (
    insertar_cargo,  
    obtener_cargo,
    obtener_cargo_por_id,
    actualizar_cargo,
    eliminar_cargo 
)

def registrar_rutas(app):
    # Ruta para gestionar cargo
    @app.route("/gestionar_cargo", methods=["GET"])
    def gestionar_cargo():
        cargos = obtener_cargo()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        return render_template("ministro/gestionar_cargo.html", cargos=cargos)

    # Ruta para mostrar el formulario de registro de un nuevo cargo
    @app.route("/registrar_cargo", methods=["GET"])
    def formulario_registrar_cargo():
        return render_template("ministro/registrar_cargo.html")

    # Ruta para insertar un nuevo cargo
    @app.route("/insertar_cargo", methods=["POST"])
    def procesar_insertar_cargo():
        nombre = request.form["nombre"]
        insertar_cargo(nombre)
        flash("Cargo agregado exitosamente")
        return redirect(url_for("gestionar_cargo"))

    # Ruta para mostrar el formulario de edición de un cargo
    @app.route("/editar_cargo/<int:id>", methods=["GET"])
    def formulario_editar_cargo(id):
        cargo = obtener_cargo_por_id(id)
        return render_template("ministro/editar_cargo.html", cargo=cargo)

    # Ruta para manejar la actualización de un cargo
    @app.route("/actualizar_cargo", methods=["POST"])
    def procesar_actualizar_cargo():
        id = request.form["id"]  # Captura el ID desde el formulario
        nombre = request.form["nombre"]  # Captura el nombre actualizado
        actualizar_cargo(nombre, id)  # Llama a la función que actualiza en la base de datos
        flash("Cargo actualizado exitosamente")
        return redirect(url_for("gestionar_cargo"))


    # **Ruta para eliminar un cargo**
    @app.route("/eliminar_cargo", methods=["POST"])
    def procesar_eliminar_cargo():
        id = request.form["id"]  # Captura el ID desde el formulario
        eliminar_cargo(id)  # Llama a la función que elimina en la base de datos
        flash("Cargo eliminado exitosamente")
        return redirect(url_for("gestionar_cargo"))
