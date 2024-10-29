from flask import render_template, request, redirect, url_for, flash
from controladores.controlador_congregacion import (
    insertar_congregacion,  
    obtener_congregacion,
    obtener_congregacion_por_id,
    actualizar_congregacion,
    eliminar_congregacion,
    darBaja_congregacion
)

def registrar_rutas(app):
    # Ruta para gestionar congregación
    @app.route("/gestionar_congregacion", methods=["GET"])
    def gestionar_congregacion():
        congregacion = obtener_congregacion()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        return render_template("congregacion/gestionar_congregacion.html", congregacion=congregacion)

    # Ruta para mostrar el formulario de registro de una nueva congregación
    @app.route("/registrar_congregacion", methods=["GET"])
    def formulario_registrar_congregacion():
        return render_template("congregacion/registrar_congregacion.html")

    # Ruta para insertar una nueva congregación
    @app.route("/insertar_congregacion", methods=["POST"])
    def procesar_insertar_congregacion():
        nombre = request.form["nombre_congregacion"]
        insertar_congregacion(nombre)
        flash("La congregación fue agregada exitosamente")
        return redirect(url_for("gestionar_congregacion"))

    # Ruta para mostrar el formulario de edición de una congregación
    @app.route("/editar_congregacion/<int:id>", methods=["GET"])
    def formulario_editar_congregacion(id):
        congregacion = obtener_congregacion_por_id(id)
        return render_template("congregacion/editar_congregacion.html", congregacion=congregacion)

    # Ruta para manejar la actualización de una congregación
    @app.route("/actualizar_congregacion", methods=["POST"])
    def procesar_actualizar_congregacion():
        id = request.form["id"]  # Captura el ID desde el formulario
        nombre = request.form["nombre_congregacion"]  # Captura el nombre actualizado
        estado = request.form.get('estado') == 'on' 
        actualizar_congregacion(nombre,estado, id)  # Llama a la función que actualiza en la base de datos
        flash("La congregación fue actualizada exitosamente")
        return redirect(url_for("gestionar_congregacion"))


    # **Ruta para eliminar una congregación**
    @app.route("/eliminar_congregacion", methods=["POST"])
    def procesar_eliminar_congregacion():
        id = request.form["id"]  # Captura el ID desde el formulario
        eliminar_congregacion(id)  # Llama a la función que elimina en la base de datos
        flash("La congregación fue eliminada exitosamente")
        return redirect(url_for("gestionar_congregacion"))

    @app.route("/darBaja_congregacion", methods=["POST"])
    def procesar_darBaja_congregacion():
        id = request.form.get('id')  
        darBaja_congregacion(id)  
        flash("La congregacion fue dada de baja exitosamente")
        return redirect(url_for("gestionar_congregacion"))
    