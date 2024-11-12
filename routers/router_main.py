from flask import render_template, request, redirect, url_for, make_response, flash
import controladores.controlador_feligres as cfel
import controladores.controlador_ministro as cmin
import random
from hashlib import sha256
from functools import wraps

def requerido_login(f):
    @wraps(f)
    def decorador_ministro(*args, **kwargs):
        print("El decorador ha sido ejecutado")  # Depuración
        dni = request.cookies.get('dni')
        token = request.cookies.get('token')
        print(f"DNI: {dni}, Token: {token}")  # Depuración
        if not dni or not token:
            print("No se encontraron cookies")
            return redirect(url_for('raiz'))  # Si no hay cookies, redirigir
        
        # Verificar token (asumir que cmin.verificar_ministro es correcto)
        valor = cmin.verificar_ministro(token, dni)
        print(f"Valor de verificación: {valor}")  # Depuración
        if valor == 1:
            # Aquí es donde obtenemos la respuesta real
            response = f(*args, **kwargs)  # Ejecuta la función decorada y obtiene la respuesta
            # Si la respuesta es un string (como el contenido HTML), conviértelo a un objeto Response
            if isinstance(response, str):
                response = make_response(response)
            # Manipular las cabeceras de la respuesta
            response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
            return response
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
