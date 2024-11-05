from flask import render_template, request, redirect, url_for, flash, make_response,jsonify
import random
from hashlib import sha256

from controladores.controlador_feligres import (
    insertar_feligres,
    obtener_feligreses,    
    actualizar_feligres,
    eliminar_feligres,
    verificarcuentaFeligres,
    obtener_feligres_por_dni
)
import controladores.controlador_sede as csede

def registrar_rutas(app):
    # Ruta para gestionar feligreses
    @app.route("/gestionar_feligres", methods=["GET"])
    def gestionar_feligres():
        feligreses = obtener_feligreses()
        sedes = csede.obtener_sede()
        return render_template("/feligres/gestionar_feligres.html", feligreses=feligreses, sedes = sedes )

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

    @app.route("/insertar_feligres", methods=["POST"])
    def procesar_insertar_feligres():
        dni = request.form["dni"]
        apellidos = request.form["apellidos"]
        nombres = request.form["nombres"]
        fecha_nacimiento = request.form["fecha_nacimiento"]
        estado_civil = request.form["estado_civil"]
        sexo = request.form["sexo"]
        id_sede = request.form["id_sede"]
        
        resultado = insertar_feligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede)
        
        # Verificar si la inserción fue exitosa y devolver el objeto feligrés
        if resultado["success"]:
            return jsonify({
                "success": True,
                "feligres": {
                    "dni": dni,  # Asegúrate de que dni tiene el valor correcto
                    "apellidos": apellidos,
                    "nombres": nombres,
                    "fecha_nacimiento": fecha_nacimiento,
                    "estado_civil": estado_civil,
                    "sexo": sexo,
                    "sede": id_sede  # o el nombre de la sede si prefieres mostrarlo directamente
                }
            })
        else:
            return jsonify({
                "success": False,
                "message": resultado["message"]
            }), 400

    @app.route("/obtener_feligres/<dni>", methods=["GET"])
    def obtener_feligres(dni):
        feligres = obtener_feligres_por_dni(dni)
        if feligres:
            return jsonify(feligres)
        else:
            return jsonify({"error": "Feligrés no encontrado"}), 404

    @app.route("/actualizar_feligres", methods=["POST"])
    def procesar_actualizar_feligres():
        dni = request.form["dni"]
        apellidos = request.form["apellidos"]
        nombres = request.form["nombres"]
        fecha_nacimiento = request.form["fecha_nacimiento"]
        estado_civil = request.form["estado_civil"]
        sexo = request.form["sexo"]
        id_sede = request.form["id_sede"]

        actualizar_feligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede)
        flash("El feligrés fue actualizado exitosamente")
        return redirect(url_for("gestionar_feligres"))

    @app.route("/eliminar_feligres", methods=["POST"])
    def procesar_eliminar_feligres():        
        dni = request.form["dni"]
        eliminar_feligres(dni)
        flash("El feligrés fue eliminado exitosamente")
        return redirect(url_for("gestionar_feligres"))
    
    