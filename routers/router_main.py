from flask import render_template, request, redirect, url_for, make_response, flash
import controladores.controlador_feligres as cfel
import controladores.controlador_ministro as cmin
import random
from hashlib import sha256
from functools import wraps

from functools import wraps
from flask import request, redirect, url_for

def requerido_login(f):
    @wraps(f)
    def decorador_ministro(*args, **kwargs):
        print("El decorador ha sido ejecutado") 
        dni = request.cookies.get('dni')
        token = request.cookies.get('token')
        print(f"DNI: {dni}, Token: {token}")
        
        if not dni or not token:
            print("No se encontraron cookies")
            return redirect(url_for('raiz'))

        valor = cmin.verificar_ministro(token, dni)
        print(f"Valor de verificación: {valor}")

        if valor == 1:
            return f(*args, **kwargs)
        else:
            print("Redirigiendo a raiz")
            return redirect(url_for('raiz'))
        
    return decorador_ministro


def registrar_rutas(app):

    @app.route('/inicio')
    @requerido_login
    def inicio():
        return render_template('index.html')
    
    @app.route('/verificarusuario', methods=['POST'])
    def verificarusuario():
        
        request.cookies.get('dni')
        request.cookies.get('token')

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
