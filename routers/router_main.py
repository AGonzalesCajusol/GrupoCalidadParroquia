from flask import render_template, request, redirect, url_for, make_response
import controladores.controlador_feligres as cfel
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
        #en casos 1 y 2 se crea otro token y se remplaza por el anterior ademas retornas su usuario
        token = str(random.randint(1,1024))
        token_h = sha256(token.encode('utf-8')).hexdigest()

        if valor == 1:
            

            response = make_response(redirect(url_for('inicio')))   
            response.set_cookie('dni', dni)
            response.set_cookie('nombre', "Erick tu papi")
            response.set_cookie('token', token_h)
            response.set_cookie('tipo',"Muy bueno" )

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
            return redirect(url_for('raiz'))
           
    


    # Aquí puedes agregar otras rutas generales
    # @app.route('/about')
    # def about():
    #     return render_template('about.html')
