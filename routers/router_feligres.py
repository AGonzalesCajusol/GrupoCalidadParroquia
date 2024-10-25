from flask import render_template, request, redirect, url_for, flash, make_response,jsonify
 
import random
from hashlib import sha256


from controladores.controlador_feligres import (
    insertar_feligres,
    obtener_feligreses,
    obtener_feligres_por_id,
    actualizar_feligres,
    eliminar_feligres,
    verificarcuentaFeligres
)
import controladores.controlador_sede as csede

def registrar_rutas(app):
    # Ruta para gestionar feligreses
    @app.route("/gestionar_feligres", methods=["GET"])
    def gestionar_feligres():
        feligreses = obtener_feligreses()
        sedes = csede.obtener_sede()
        return render_template("/feligres/gestionar_feligres.html", feligreses=feligreses, sedes = sedes )


    # Ruta para mostrar el formulario de registro de un nuevo feligrés
    @app.route("/registrar_feligres", methods=["GET"])
    def formulario_registrar_feligres():
        return render_template("/feligres/registrar_feligres.html")
    
    @app.route('/crearcuenta')
    def crearcuenta():
        sedes = csede.obtener_sedeparacuenta()
        return render_template('crear_cuenta.html', sedes = sedes)
    
    @app.route("/registrar_feligresweb", methods=["POST"])
    def registrar_feligresweb():
        # Obtiene los datos del formulario
        dni = request.form['dni11']
        apellidos = request.form['apellidos11']
        nombres = request.form['nombres11']
        fecha_nacimiento = request.form['fecha_nacimiento11']
        estado_civil = request.form['estado_civil11'][0].lower()
        sexo = request.form['sexo11'][0].lower()
        contraseña = request.form['contraseña11']
        sede = request.form['sede11']

        valor = str(random.randint(1,1024))
        token = sha256(valor.encode('utf-8')).hexdigest()
        valor = verificarcuentaFeligres(dni,apellidos,nombres,fecha_nacimiento,estado_civil,sexo,token,contraseña,sede,estado='a')
        response = redirect(url_for('principal'))

        # Establecer las cookies
        response.set_cookie('dni', dni)
        response.set_cookie('token', token)
        response.set_cookie('tipo', 'feligres')
        response.set_cookie('nombre', f"{apellidos} {nombres}")

        return response

    @app.route("/principal", methods=["GET"])
    def principal():
        return render_template('/feligres/principal_feligres.html')


    # Ruta para insertar un nuevo feligrés
    @app.route("/insertar_feligres", methods=["POST"])
    def procesar_insertar_feligres():
        dni = request.form["dni"]
        apellidos = request.form["apellidos"]
        nombres = request.form["nombres"]
        fecha_nacimiento = request.form["fecha_nacimiento"]
        estado_civil = request.form["estado_civil"]
        sexo = request.form["sexo"]
        id_sede = request.form["id_sede"]
        insertar_feligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede)
        flash("El feligrés fue agregado exitosamente")
        return redirect(url_for("gestionar_feligres"))

    # Ruta para mostrar el formulario de edición de un feligrés
    @app.route("/editar_feligres/<int:id>", methods=["GET"])
    def formulario_editar_feligres(id):
        feligres = obtener_feligres_por_id(id)
        return render_template("feligres/editar_feligres.html", feligres=feligres)

    # Ruta para manejar la actualización de un feligrés
    @app.route("/actualizar_feligres", methods=["POST"])
    def procesar_actualizar_feligres():
        id_feligres = request.form["id"]
        dni = request.form["dni"]
        apellidos = request.form["apellidos"]
        nombres = request.form["nombres"]
        fecha_nacimiento = request.form["fecha_nacimiento"]
        estado_civil = request.form["estado_civil"]
        sexo = request.form["sexo"]
        id_sede = request.form["id_sede"]
        actualizar_feligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede, id_feligres)
        flash("El feligrés fue actualizado exitosamente")
        return redirect(url_for("gestionar_feligres"))

    # Ruta para eliminar un feligrés
    @app.route("/eliminar_feligres", methods=["POST"])
    def procesar_eliminar_feligres():
        id_feligres = request.form["id"]
        eliminar_feligres(id_feligres)
        flash("El feligrés fue eliminado exitosamente")
        return redirect(url_for("gestionar_feligres"))
    
