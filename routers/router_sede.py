from flask import render_template, request, redirect, url_for, flash, jsonify
import traceback # Para capturar detalles del error
from datetime import datetime
from controladores.controlador_sede import (
    insertar_sede,
    insertar_sede_acto_liturgico,
    obtener_sede,
    obtener_sede_por_id,
    actualizar_sede,
    actualizar_estado_sede,
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
from routers.router_main import requerido_login

def registrar_rutas(app):
    # Ruta para gestionar sede
    @app.route("/gestionar_sede", methods=["GET"])
    @requerido_login
    def gestionar_sede():
        sede = obtener_sede()
        congregacion = obtener_congregacion()
        diosesis = obtener_diocesis() 
        actoliturgico = listar_actosLit()
        return render_template("sede/gestionar_sede.html", sede=sede, congregacion = congregacion,  diosesis = diosesis, actoliturgico = actoliturgico)

    # Ruta para mostrar el formulario de registro de una nueva sede
    @app.route("/registrar_sede", methods=["GET"])
    @requerido_login
    def formulario_registrar_sede():
        return render_template("sede/registrar_sede.html", )

    # Ruta para insertar una nueva sede
    @app.route("/insertar_sede", methods=["POST"])
    @requerido_login
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
            monto_traslado = request.form["monto_traslado"]

            # Capturamos todos los actos litúrgicos seleccionados
            actoliturgico = []
            for key in request.form:
                if key.startswith("estado-"):  # Captura los checkbox de actos litúrgicos
                    actoliturgico.append(key.split("-")[1])  # Extrae el ID del acto litúrgico
            
            # Insertar la sede una sola vez
            id_sede = insertar_sede(nombre, direccion, creacion, telefono, correo, monto, id_congregacion, id_diosesis, monto_traslado)
            
            if id_sede:  # Si la inserción fue exitosa y tenemos el id_sede
                for acto_id in actoliturgico:
                    estado_acto = request.form.get(f'estado-{acto_id}') == 'on'  # Obtener el estado del checkbox (on o off)
                    insertar_sede_acto_liturgico(id_sede, acto_id, estado_acto)  # Insertar en la tabla sede_acto_liturgico

                #flash("La sede fue agregada exitosamente", "success")
            #else:
                #flash("Hubo un error al agregar la sede.", "danger")

        except Exception as e:
            error_message = str(e)
            #flash(f"Hubo un error al procesar la solicitud: {error_message}", "danger")
            traceback.print_exc()

        return redirect(url_for("gestionar_sede"))

    # Ruta para mostrar el formulario de edición de una sede
    @app.route("/editar_sede/<int:id>", methods=["GET"])
    @requerido_login
    def formulario_editar_sede(id):
        sede = obtener_sede_por_id(id)
        return render_template("sede/editar_sede.html", sede=sede)

    # Ruta para manejar la actualización de una sede
    @app.route("/actualizar_sede", methods=["POST"])
    @requerido_login
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
            monto_traslado = request.form["monto_traslado"]
            actualizar_sede(nombre, direccion, creacion, telefono, correo, monto, estado, congregacion, diosesis, monto_traslado, id)
            
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

            # Obtener las sedes actualizadas
            sedes = obtener_sede()

            # Devuelve una respuesta JSON
            return jsonify({"success": True, "sedes": [
                {
                    "id": s[0],
                    "nombre_sede": s[1],
                    "direccion": s[2],
                    "creacion": str(s[3]),
                    "telefono": s[4],
                    "correo": s[5],
                    "monto": s[6],
                    "estado": s[7],
                    "id_congregacion": s[8],
                    "id_diosesis": s[9],
                    "monto_traslado": s[10]
                } for s in sedes
            ]})

        except Exception as e:
            error_message = str(e)
            print(f"Error al actualizar la sede: {error_message}")
            return jsonify({"success": False, "message": "Error al actualizar la sede"})
        

    # **Ruta para eliminar una sede**
    @app.route("/eliminar_sede", methods=["POST"])
    @requerido_login
    def procesar_eliminar_sede():
        id = request.form["id"]  # Captura el ID desde el formulario
        resultado = eliminar_sede(id)  # Llama a la función que elimina en la base de datos
        return jsonify(resultado)

    @app.route("/cambiar_estado_sede", methods=["POST"])
    @requerido_login
    def cambiar_estado_sede():
        id = request.form.get('id')
        nuevo_estado = int(request.form.get('estado'))  # Convertir el estado a entero (1 o 0)

        try:
            # Llama a la función que actualiza el estado en la base de datos
            actualizar_estado_sede(id, nuevo_estado)

            # Obtener todas las sedes actualizadas
            sedes = obtener_sede()
            return jsonify({
                "success": True,
                "sedes": [
                    {
                        "id": s[0],
                        "nombre_sede": s[1],
                        "direccion": s[2],
                        "telefono": s[4],
                        "correo": s[5],
                        "estado": s[7],
                    }
                    for s in sedes
                ],
            })
        except Exception as e:
            print(f"Error al cambiar el estado de la sede: {e}")
            return jsonify({"success": False, "message": "Error al cambiar el estado de la sede"})

    @app.route('/obtener_actos_por_sede', methods=['GET'])
    @requerido_login
    def obtener_actos_por_sede():
        id_sede = request.args.get('id_sede')
        _, actos_liturgicos = obtener_sede_por_id(id_sede)  # Llamar a la función que devuelve los actos litúrgicos
        return {"actos": actos_liturgicos}
