from flask import render_template

def registrar_rutas(app):
    # Ruta para la página principal (Dashboard) después de iniciar sesión
    @app.route('/inicio')
    def inicio():
        return render_template('index.html')
    


    # Aquí puedes agregar otras rutas generales
    # @app.route('/about')
    # def about():
    #     return render_template('about.html')
