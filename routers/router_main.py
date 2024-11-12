from flask import render_template, request, redirect, url_for, make_response, flash
import controladores.controlador_feligres as cfel
import controladores.controlador_ministro as cmin
import random
from hashlib import sha256

def registrar_rutas(app):
    # Ruta para la página principal (Dashboard) después de iniciar sesión
    @app.route('/inicio')
    def inicio():
        return render_template('index.html')
    
    @app.route('/verificarusuario', methods=['POST'])
    def verificarusuario():
        dni = request.form['dni22']
        password = request.form['password22']

        valor = cfel.iniciosesion(dni,password)
        token = str(random.randint(1,1024))
        token_h = sha256(token.encode('utf-8')).hexdigest()

        if valor == 1:
            cmin.actualizar_token(token_h,dni)
            dn, nom, tk, tp, sd = cmin.retornar_datos_ministro(dni)
            print(dn)
            print(tk)
            response = make_response(redirect(url_for('inicio')))   
            response.set_cookie('dni', dn)
            response.set_cookie('nombre', nom)
            response.set_cookie('token', tk)
            response.set_cookie('tipo',tp)
            response.set_cookie('sede',sd)
            return response
        elif valor == 2:
            nombre = cfel.actualizarTokenFeligres(dni,token_h)
            response = make_response(redirect(url_for('principal')))
            response.set_cookie('dni', dni)
            response.set_cookie('token', token_h)
            response.set_cookie('tipo', 'feligres')
            if nombre:
                response.set_cookie('nombre', nombre)
            else:
                response.set_cookie('nombre', '')  # Manejo si no se encuentra el nombre

            return response
        else:
            flash("Verifique su usuario o contraseña")
            return redirect(url_for('raiz'))
           
    # Aquí puedes agregar otras rutas generales
    # @app.route('/about')
    # def about():
    #     return render_template('about.html')
