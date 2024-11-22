from flask import render_template, request, redirect, url_for, flash, jsonify
import traceback
from controladores.controlador_congregacion import (
    insertar_congregacion,  
    obtener_congregacion,
    obtener_congregacion_por_id,
    actualizar_congregacion,
    eliminar_congregacion,
    actualizar_estado_congregacion
)
from routers.router_main import requerido_login

def registrar_rutas(app):
    # Ruta para gestionar congregación
    @app.route("/gestionar_congregacion", methods=["GET"])
    @requerido_login
    def gestionar_congregacion():
        congregacion = obtener_congregacion()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        return render_template("congregacion/gestionar_congregacion.html", congregacion=congregacion)

    # Ruta para mostrar el formulario de registro de una nueva congregación
    @app.route("/registrar_congregacion", methods=["GET"])
    @requerido_login
    def formulario_registrar_congregacion():
        return render_template("congregacion/registrar_congregacion.html")

    # Ruta para insertar una nueva congregación
    @app.route("/insertar_congregacion", methods=["POST"])
    @requerido_login
    def procesar_insertar_congregacion():
        try:
            nombre = request.form["nombre_congregacion"]
            id_congregacion = insertar_congregacion(nombre)

            #if id_congregacion:  # Si la inserción fue exitosa y tenemos el id_congregacion
                #flash("La congregación fue agregada exitosamente", "success")
            #else:
                #flash("Hubo un error al agregar la congregación.", "danger")
            
        except Exception as e:
            error_message = str(e)
            #flash(f"Hubo un error al procesar la solicitud: {error_message}", "danger")
            traceback.print_exc()

        return redirect(url_for("gestionar_congregacion"))

    # Ruta para mostrar el formulario de edición de una congregación
    @app.route("/editar_congregacion/<int:id>", methods=["GET"])
    @requerido_login
    def formulario_editar_congregacion(id):
        congregacion = obtener_congregacion_por_id(id)
        return render_template("congregacion/editar_congregacion.html", congregacion=congregacion)

    # Ruta para manejar la actualización de una congregación
    @app.route("/actualizar_congregacion", methods=["POST"])
    @requerido_login
    def procesar_actualizar_congregacion():
        try:
            id = request.form["id"]  # Captura el ID desde el formulario
            nombre = request.form["nombre_congregacion"]  # Captura el nombre actualizado
            estado = request.form.get('estado') == 'on' 
            actualizar_congregacion(nombre,estado, id)  # Llama a la función que actualiza en la base de datos

            congregacion = obtener_congregacion()

            return jsonify({"success": True, "congregacion": [
                    {
                        "id": c[0],
                        "nombre_congregacion": c[1],
                        "estado": c[2]
                    } for c in congregacion
            ]})
        
        except Exception as e:
            error_message = str(e)
            print(f"Error al actualizar la congregación: {error_message}")
            return jsonify({"success": False, "message": "Error al actualizar la congregación"})


    # **Ruta para eliminar una congregación**
    @app.route("/eliminar_congregacion", methods=["POST"])
    @requerido_login
    def procesar_eliminar_congregacion():
        id = request.form["id"]  # Captura el ID desde el formulario
        resultado = eliminar_congregacion(id)  # Llama a la función que elimina en la base de datos
        return jsonify(resultado)

    @app.route("/cambiar_estado_congregacion", methods=["POST"])
    @requerido_login
    def cambiar_estado_congregacion():
        id = request.form.get('id')
        nuevo_estado = int(request.form.get('estado'))  # Convertir el estado a entero (1 o 0)

        try:
            # Llama a la función que actualiza el estado en la base de datos
            actualizar_estado_congregacion(id, nuevo_estado)

            # Obtener todas las congregaciones actualizadas
            congregacion = obtener_congregacion()
            return jsonify({
                "success": True,
                "congregacion": [
                    {
                        "id": c[0],
                        "nombre_congregacion": c[1],
                        "estado": c[2],
                    }
                    for c in congregacion
                ],
            })
        except Exception as e:
            print(f"Error al cambiar el estado de la congregación: {e}")
            return jsonify({"success": False, "message": "Error al cambiar el estado de la congregación"})


    