from flask import render_template, request, redirect, url_for, flash
from controladores.controlador_tipo_ministro import (
    insertar_tipo_ministro,  
    obtener_tipos_ministro,
    obtener_tipo_ministro_por_id,
    actualizar_tipo_ministro,
    eliminar_tipo_ministro  
)

def registrar_rutas(app):
    # Ruta para gestionar tipos de ministro
    @app.route("/gestionar_tipo_ministro", methods=["GET"])
    def gestionar_tipo_ministro():
        tipos_ministro = obtener_tipos_ministro()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        return render_template("tipo_ministro/gestionar_tipo_ministro.html", tipos_ministro=tipos_ministro)

    # Ruta para mostrar el formulario de registro de un nuevo tipo de ministro
    @app.route("/registrar_tipo_ministro", methods=["GET"])
    def formulario_registrar_tipo_ministro():
        return render_template("tipo_ministro/registrar_tipo_ministro.html")

    # Ruta para insertar un nuevo tipo de ministro
    @app.route("/insertar_tipo_ministro", methods=["POST"])
    def procesar_insertar_tipo_ministro():
        nombre = request.form["nombre"]
        insertar_tipo_ministro(nombre)
        flash("Tipo de ministro agregado exitosamente")
        return redirect(url_for("gestionar_tipo_ministro"))

    # Ruta para mostrar el formulario de edición de un tipo de ministro
    @app.route("/editar_tipo_ministro/<int:id>", methods=["GET"])
    def formulario_editar_tipo_ministro(id):
        tipo_ministro = obtener_tipo_ministro_por_id(id)
        return render_template("tipo_ministro/editar_tipo_ministro.html", tipo_ministro=tipo_ministro)

    # Ruta para manejar la actualización de un tipo de ministro
    @app.route("/actualizar_tipo_ministro", methods=["POST"])
    def procesar_actualizar_tipo_ministro():
        id = request.form["id"]  # Captura el ID desde el formulario
        nombre = request.form["nombre"]  # Captura el nombre actualizado
        actualizar_tipo_ministro(nombre, id)  # Llama a la función que actualiza en la base de datos
        flash("Tipo de ministro actualizado exitosamente")
        return redirect(url_for("gestionar_tipo_ministro"))


    # **Ruta para eliminar un tipo de ministro**
    @app.route("/eliminar_tipo_ministro", methods=["POST"])
    def procesar_eliminar_tipo_ministro():
        id = request.form["id"]  # Captura el ID desde el formulario
        eliminar_tipo_ministro(id)  # Llama a la función que elimina en la base de datos
        flash("Tipo de ministro eliminado exitosamente")
        return redirect(url_for("gestionar_tipo_ministro"))
