from flask import render_template, request, redirect, url_for, flash
import traceback # Para capturar detalles del error
from controladores.controlador_sede import (
    insertar_sede,
    insertar_sede_acto_liturgico,
    obtener_sede,
    obtener_sede_por_id,
    actualizar_sede,
    darBaja_sede,
    eliminar_sede,
    eliminar_sede_acto_liturgico
)
from controladores.controlador_congregacion import ( 
     obtener_congregacion,
     obtener_congregacion_por_id,
     obtener_id_congregacion_por_nombre,
     obtener_id_diosesis_por_nombre
)
from controladores.controlador_diocesis import ( 
     obtener_diocesis,
    obtener_diocesis_por_id,
)

from controladores.controlador_actosliturgicos import(
    listar_actosLit
)

def registrar_rutas(app):
    # Ruta para gestionar sede
    @app.route("/gestionar_sede", methods=["GET"])
    def gestionar_sede():
        sede = obtener_sede()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        congregacion = obtener_congregacion()
        diosesis = obtener_diocesis() 
        actoliturgico = listar_actosLit()
        return render_template("sede/gestionar_sede.html", sede=sede, congregacion = congregacion,  diosesis = diosesis, actoliturgico = actoliturgico)

    # Ruta para mostrar el formulario de registro de una nueva sede
    @app.route("/registrar_sede", methods=["GET"])
    def formulario_registrar_sede():
        return render_template("sede/registrar_sede.html", )

    # Ruta para insertar una nueva sede
    @app.route("/insertar_sede", methods=["POST"])
    def procesar_insertar_sede():
        try:
            nombre = request.form["nombre_sede"]
            direccion = request.form["direccion"]
            creacion = request.form["creacion"]
            telefono = request.form["telefono"]
            correo = request.form["correo"]
            monto = request.form["monto"]
            id_congregacion = request.form["id_congregacion"]
            id_diosesis = request.form["id_diosesis"]

            # Capturamos todos los actos litúrgicos seleccionados
            actoliturgico = []
            for key in request.form:
                if key.startswith("estado-"):  # Captura los checkbox de actos litúrgicos
                    actoliturgico.append(key.split("-")[1])  # Extrae el ID del acto litúrgico
            
            # Insertar la sede una sola vez
            id_sede = insertar_sede(nombre, direccion, creacion, telefono, correo, monto, id_congregacion, id_diosesis)
            
            if id_sede:  # Si la inserción fue exitosa y tenemos el id_sede
                for acto_id in actoliturgico:
                    estado_acto = request.form.get(f'estado-{acto_id}') == 'on'  # Obtener el estado del checkbox (on o off)
                    insertar_sede_acto_liturgico(id_sede, acto_id, estado_acto)  # Insertar en la tabla sede_acto_liturgico

                flash("La sede fue agregada exitosamente", "success")
            else:
                flash("Hubo un error al agregar la sede.", "danger")

        except Exception as e:
            error_message = str(e)
            flash(f"Hubo un error al procesar la solicitud: {error_message}", "danger")
            traceback.print_exc()

        return redirect(url_for("gestionar_sede"))

    # Ruta para mostrar el formulario de edición de una sede
    @app.route("/editar_sede/<int:id>", methods=["GET"])
    def formulario_editar_sede(id):
        sede = obtener_sede_por_id(id)
        return render_template("sede/editar_sede.html", sede=sede)

    # Ruta para manejar la actualización de una sede
    @app.route("/actualizar_sede", methods=["POST"])
    def procesar_actualizar_sede():
        try:
            # Captura los datos del formulario
            id = request.form["id"]
            nombre = request.form["nombre_sede"]
            direccion = request.form["direccion"]
            creacion = request.form["creacion"]
            telefono = request.form["telefono"]
            correo = request.form["correo"]
            monto = request.form["monto"]
            estado = request.form.get('estado') == 'on' 
            congregacion = request.form["id_congregacion"]
            diosesis = request.form["id_diosesis"]
            actualizar_sede(nombre, direccion, creacion, telefono, correo, monto, estado, congregacion, diosesis, id)
            
            # Obtener los actos litúrgicos seleccionados
            actoliturgico = []
            for key in request.form:
                if key.startswith("estado-"):
                    actoliturgico.append(key.split("-")[1])
            
            # Primero eliminar las asignaciones actuales
            eliminar_sede_acto_liturgico(id)
            
            # Luego insertar las nuevas asignaciones
            for acto_id in actoliturgico:
                estado_acto = request.form.get(f'estado-{acto_id}') == 'on'
                insertar_sede_acto_liturgico(id, acto_id, estado_acto)
            
            flash("La sede fue actualizada exitosamente", "success")
            return redirect(url_for("gestionar_sede"))

        except Exception as e:
            error_message = str(e)
            flash(f"Hubo un error al actualizar la sede: {error_message}", "danger")
            traceback.print_exc()
            return redirect(url_for("gestionar_sede"))

    # **Ruta para eliminar una sede**
    @app.route("/eliminar_sede", methods=["POST"])
    def procesar_eliminar_sede():
        id = request.form["id"]  # Captura el ID desde el formulario
        eliminar_sede(id)  # Llama a la función que elimina en la base de datos
        flash("La sede fue eliminada exitosamente")
        return redirect(url_for("gestionar_sede"))

    @app.route("/darBaja_sede", methods=["POST"])
    def procesar_darBaja_sede():
        id = request.form.get('id')  
        darBaja_sede(id)  
        flash("La sede fue dada de baja exitosamente")
        return redirect(url_for("gestionar_sede"))
    
    @app.route('/obtener_actos_por_sede', methods=['GET'])
    def obtener_actos_por_sede():
        id_sede = request.args.get('id_sede')
        _, actos_liturgicos = obtener_sede_por_id(id_sede)  # Llamar a la función que devuelve los actos litúrgicos
        return {"actos": actos_liturgicos}
