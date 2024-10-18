from flask import render_template, request, redirect, url_for
import controladores.controlador_feligres as cfel

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

        if valor == 1:
            return redirect(url_for('inicio'))
        elif valor == 2:
            return redirect(url_for('principal'))
        else:
            return redirect(url_for('raiz'))
           
    


    # Aquí puedes agregar otras rutas generales
    # @app.route('/about')
    # def about():
    #     return render_template('about.html')
