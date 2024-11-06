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
        'si el usuario existe sino le mandamos un mensaje que tiene que registrarse'
        dni = request.form['dni22']
        password = request.form['password22']
        'me retornará 4 estados 0, significa que no existe esa cuenta; 1 que los datos son incorrectos; 2 ministro y 3 feligres'
        valor = cfel.iniciosesion(dni,password)
        print(valor)
        #en casos 1 y 2 se crea otro token y se remplaza por el anterior ademas retornas su usuario
        token = str(random.randint(1,1024))
        token_h = sha256(token.encode('utf-8')).hexdigest()

        if valor == 1:
            #Falta actualizar tokeeeen
            dn, nom, tk, tp, sd = cmin.retornar_datos_ministro(dni)
            response = make_response(redirect(url_for('inicio')))   
            response.set_cookie('dni', dn)
            response.set_cookie('nombre', nom)
            response.set_cookie('token', tk)
            response.set_cookie('tipo',tp)
            response.set_cookie('sede',sd)
            return response
        elif valor == 2:
            #actualizar token del feligres y extraer nombre
            nombre = cfel.actualizarTokenFeligres(dni,token_h)
            response = make_response(redirect(url_for('principal')))

            # Establecer cookies con la información del feligres
            response.set_cookie('dni', dni)
            response.set_cookie('token', token_h)
            response.set_cookie('tipo', 'feligres')

            # Verificar y establecer el nombre
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
