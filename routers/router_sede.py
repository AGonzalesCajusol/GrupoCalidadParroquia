from flask import render_template, request, redirect, url_for, flash
from controladores.controlador_sede import (
    insertar_sede,  
    obtener_sede,
    obtener_sede_por_id,
    actualizar_sede,
    eliminar_sede  
)
from controladores.controlador_congregacion import ( 
     obtener_congregacion,
     obtener_congregacion_por_id,
)
from controladores.controlador_diocesis import ( 
     obtener_diocesis,
    obtener_diocesis_por_id,
)

def registrar_rutas(app):
    # Ruta para gestionar sede
    @app.route("/gestionar_sede", methods=["GET"])
    def gestionar_sede():
        sede = obtener_sede()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        congregacion = obtener_congregacion()
        diosesis = obtener_diocesis() 
        return render_template("sede/gestionar_sede.html", sede=sede,congregacion = congregacion,  diosesis = diosesis)

    # Ruta para mostrar el formulario de registro de una nueva sede
    @app.route("/registrar_sede", methods=["GET"])
    def formulario_registrar_sede():
        return render_template("sede/registrar_sede.html", )

    # Ruta para insertar una nueva sede
    @app.route("/insertar_sede", methods=["POST"])
    def procesar_insertar_sede():
        nombre = request.form["nombre"]
        direccion = request.form["direccion"]
        creacion = request.form["creacion"]
        telefono = request.form["telefono"]
        correo = request.form["correo"]
        id_congregacion = request.form["id_congregacion"]
        id_diosesis = request.form["id_diosesis"]
        insertar_sede(nombre,direccion,creacion,telefono,correo,id_congregacion,id_diosesis)
        flash("La sede fue agregada exitosamente")
        return redirect(url_for("gestionar_sede"))

    # Ruta para mostrar el formulario de edición de una sede
    @app.route("/editar_sede/<int:id>", methods=["GET"])
    def formulario_editar_sede(id):
        sede = obtener_sede_por_id(id)
        return render_template("sede/editar_sede.html", sede=sede)

    # Ruta para manejar la actualización de una sede
    @app.route("/actualizar_sede", methods=["POST"])
    def procesar_actualizar_sede():
        id = request.form["id"]  # Captura el ID desde el formulario
        nombre = request.form["nombre"]  # Captura el nombre actualizado
        direccion = request.form["direccion"]
        creacion = request.form["creacion"]
        telefono = request.form["telefono"]
        correo = request.form["correo"]
        id_congregacion = request.form["id_congregacion"]
        id_diosesis = request.form["id_diosesis"]
        actualizar_sede(nombre,direccion,creacion,telefono,correo,id_congregacion,id_diosesis, id)  # Llama a la función que actualiza en la base de datos
        flash("La sede fue actualizada exitosamente")
        return redirect(url_for("gestionar_sede"))


    # **Ruta para eliminar una sede**
    @app.route("/eliminar_sede", methods=["POST"])
    def procesar_eliminar_sede():
        id = request.form["id"]  # Captura el ID desde el formulario
        eliminar_sede(id)  # Llama a la función que elimina en la base de datos
        flash("La sede fue eliminada exitosamente")
        return redirect(url_for("gestionar_sede"))
