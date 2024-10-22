from flask import jsonify, render_template, request, redirect, url_for, flash
from controladores.controlador_recaudaciones import *

def registrar_rutas(app):
    # Ruta para gestionar recaudaciones
    @app.route("/gestionar_recaudaciones", methods=["GET"])
    def gestionar_recaudaciones():
        recaudaciones = obtener_recaudaciones()
        id_sede_central = obtener_id_sede_por_nombre("Sede Central")  # Obtén el ID de "Sede Central"
        tipos = obtener_tipos_recaudacion()  # Obtén los tipos de recaudación
        return render_template("tipo_financiero/gestionar_recaudaciones.html", recaudaciones=recaudaciones, tipos=tipos)


    # Ruta para mostrar el formulario de registro de una nueva recaudación
    @app.route("/registrar_recaudacion", methods=["GET"])
    def formulario_registrar_recaudacion():
        return render_template("recaudaciones/registrar_recaudacion.html")

    # Ruta para mostrar el formulario de edición de una recaudación
    @app.route("/editar_recaudacion/<int:id>", methods=["GET"])
    def formulario_editar_recaudacion(id):
        recaudacion = obtener_recaudacion_por_id(id)
        return render_template("recaudaciones/editar_recaudacion.html", recaudacion=recaudacion)

    # Procesar la actualización de una recaudación
    @app.route("/procesar_actualizar_recaudacion", methods=["POST"])
    def procesar_actualizar_recaudacion():
        try:
            id_recaudacion = request.form["id"]
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]

            # Aquí puedes obtener el ID de la sede por nombre o pasar directamente si ya lo tienes en el formulario
            nombre_sede = "Sede Central"  # Nombre de la sede que estás mostrando
            id_sede = obtener_id_sede_por_nombre(nombre_sede)

            if not id_sede:
                return jsonify(success=False, message="No se pudo obtener el ID de la sede")

            # Llamamos a la función para actualizar la recaudación
            success = actualizar_recaudacion(id_recaudacion, monto, observacion, id_sede, id_tipo_recaudacion)
            
            if success:
                return jsonify(success=True)
            else:
                return jsonify(success=False, message="Error al actualizar la recaudación")
        except Exception as e:
            return jsonify(success=False, message=str(e))

    # Procesar la inserción de una recaudación
    @app.route("/insertar_recaudacion", methods=["POST"])
    def procesar_insertar_recaudacion():
        try:
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            nombre_sede = "Sede Central"  # Puedes cambiar esto por cualquier sede que quieras obtener
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]

            # Obtener el ID de la sede por su nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)

            # Verificar si se obtuvo un ID válido para la sede
            if not id_sede:
                return jsonify(success=False, message="No se pudo obtener el ID de la sede")

            # Llamamos a la función para insertar la recaudación
            success = insertar_recaudacion(monto, observacion, id_sede, id_tipo_recaudacion)
        
            if success:
                flash("Recaudación agregada exitosamente", "success")
                return redirect(url_for("gestionar_recaudaciones"))  # Redirige a la página principal
            else:
                flash("Error al agregar la recaudación", "danger")
                return redirect(url_for("gestionar_recaudaciones"))
        except Exception as e:
            flash(f"Error: {str(e)}", "danger")
            return redirect(url_for("gestionar_recaudaciones"))

    # procesar dar de baja
    @app.route("/dar_baja_recaudacion", methods=["POST"])
    def procesar_dar_baja_recaudacion():
        id = request.form.get('id')
        dar_baja_recaudacion(id)
        flash("La recaudación fue dada de baja exitosamente")
        return redirect(url_for("gestionar_recaudaciones"))

    # Procesar la eliminación de una recaudación
    @app.route("/eliminar_recaudacion", methods=["POST"])
    def procesar_eliminar_recaudacion():
        data = request.get_json()
        try:
            eliminar_recaudacion(data['id'])
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))
