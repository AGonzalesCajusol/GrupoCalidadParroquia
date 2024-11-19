from flask import jsonify, render_template, request, redirect, url_for, flash
from controladores.controlador_sede import *
from controladores.controlador_ministro import *
from controladores.controlador_cargo import *
from controladores.controlador_tipo_ministro import *
import hashlib

# Función para encriptar contraseñas usando SHA-256
def encriptar_contraseña(contraseña):
    """Encripta una contraseña usando SHA-256."""
    sha_signature = hashlib.sha256(contraseña.encode()).hexdigest()
    return sha_signature

def registrar_rutas(app):
    # Ruta para gestionar ministros
    @app.route("/gestionar_ministro", methods=["GET"])
    def gestionar_ministro():
        try:
            ministros = obtener_ministros()  
            tipos = obtener_tipos_ministro()
            sedes = obtener_sede()
            cargos = obtener_cargo()
            return render_template("ministro/gestionar_ministro.html", ministros=ministros, tipos=tipos, cargos=cargos, sedes=sedes)
        except Exception as e:
            return jsonify(success=False, message="Error al cargar la página: " + str(e))

    @app.route("/insertar_ministro", methods=["POST"])
    def procesar_insertar_ministro():
        try:
            # Capturar y validar los datos del formulario
            nombre = request.form.get("nombre")
            documento = request.form.get("documento")
            nacimiento = request.form.get("nacimiento")
            ordenacion = request.form.get("ordenacion")
            actividades = request.form.get("actividades")
            tipo_ministro_nombre = request.form.get("id_tipoministro")
            sede_nombre = request.form.get("id_sede")
            cargo_nombre = request.form.get("id_cargo")
            contraseña = request.form.get("password")
            confirmar_contraseña = request.form.get("confirmPassword")

            # Validación básica de los campos requeridos
            if not all([nombre, documento, nacimiento, ordenacion, tipo_ministro_nombre, sede_nombre, cargo_nombre, contraseña, confirmar_contraseña]):
                return jsonify(success=False, message="Todos los campos son obligatorios"), 400

            # Validar que las contraseñas coinciden
            if contraseña != confirmar_contraseña:
                return jsonify(success=False, message="Las contraseñas no coinciden"), 400

            # Encriptar la contraseña antes de almacenarla
            contraseña_encriptada = encriptar_contraseña(contraseña)

            # Obtener los IDs a partir de los nombres proporcionados
            id_tipoministro = obtener_id_tipoMinistro_por_nombre(tipo_ministro_nombre)
            id_sede = obtener_id_sede_por_nombre(sede_nombre)
            id_cargo = obtener_id_cargo_por_nombre(cargo_nombre)

            # Validar que los IDs se obtuvieron correctamente
            if not id_tipoministro:
                return jsonify(success=False, message="Tipo de ministro no válido"), 400
            if not id_sede:
                return jsonify(success=False, message="Sede no válida"), 400
            if not id_cargo:
                return jsonify(success=False, message="Cargo no válido"), 400

            # Insertar el ministro en la base de datos
            insertar_ministro(
                nombre, documento, nacimiento, ordenacion, actividades,
                id_tipoministro, id_sede, id_cargo, contraseña_encriptada
            )

            # Responder con éxito
            return jsonify(success=True, message="Ministro registrado exitosamente")
        except Exception as e:
            print(f"Error al insertar ministro: {str(e)}")
            return jsonify(success=False, message=f"Error al procesar el ministro: {str(e)}"), 500


    @app.route("/procesar_actualizar_ministro", methods=["POST"])
    def procesar_actualizar_ministro():
        try:
            # Obtener los datos del formulario
            id = request.form["id"]
            nombre = request.form["nombre"]
            documento = request.form["documento"]
            nacimiento = request.form["nacimiento"]
            ordenacion = request.form["ordenacion"]
            actividades = request.form["actividades"]
            tipo_ministro_nombre = request.form["id_tipoministro"]
            sede_nombre = request.form["id_sede"]
            cargo_nombre = request.form["id_cargo"]

            # Obtener la nueva contraseña y la confirmación
            nueva_contraseña = request.form.get("password")
            confirmar_contraseña = request.form.get("confirmPassword")

            # Obtener el id_tipoministro, id_sede y id_cargo a partir del nombre
            id_tipoministro = obtener_id_tipoMinistro_por_nombre(tipo_ministro_nombre)
            id_sede = obtener_id_sede_por_nombre(sede_nombre)
            id_cargo = obtener_id_cargo_por_nombre(cargo_nombre)

            # Validar que los IDs se obtuvieron correctamente
            if not id_tipoministro or not id_sede or not id_cargo:
                return jsonify(success=False, message="Datos no válidos para el tipo de ministro, sede o cargo"), 400

            # Si se proporciona una nueva contraseña, validar y encriptarla
            contraseña_encriptada = None
            if nueva_contraseña or confirmar_contraseña:
                if nueva_contraseña != confirmar_contraseña:
                    return jsonify(success=False, message="Las contraseñas no coinciden"), 400
                if nueva_contraseña:
                    contraseña_encriptada = encriptar_contraseña(nueva_contraseña)

            # Actualizar el ministro en la base de datos
            actualizar_ministro(
                nombre,
                documento,
                nacimiento,
                ordenacion,
                actividades,
                id_tipoministro,
                id_sede,
                id_cargo,
                id,
                contraseña_encriptada  # Solo se actualizará si se proporcionó una nueva contraseña
            )
            return jsonify(success=True)
        except Exception as e:
            print(f"Error al actualizar ministro: {str(e)}")
            return jsonify(success=False, message=str(e)), 500


    # Procesar la eliminación de un ministro
    @app.route("/eliminar_ministro", methods=["POST"])
    def procesar_eliminar_ministro():
        data = request.get_json()
        try:
            eliminar_ministro(data['id'])
            return jsonify(success=True)
        except Exception as e:
            print(f"Error al eliminar ministro: {str(e)}")
            return jsonify(success=False, message="Error interno del servidor: " + str(e)), 500


    @app.route("/procesar_dar_baja_ministro", methods=["POST"])
    def procesar_dar_baja_ministro():
            try:
                data = request.json
                id = data.get("id")
                estado = data.get("estado", 0)  # Estado del tipo de ministro (1: activo, 0: inactivo)
                dar_baja_ministro(id,estado)
                return jsonify(success=True)
            except Exception as e:
                return jsonify(success=False, message="Error al actualizar el tipo de ministro: " + str(e))

