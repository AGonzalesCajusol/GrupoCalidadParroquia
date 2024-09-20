from flask import render_template, request, redirect, url_for, flash


def registrar_rutas(app):
    # Ruta para gestionar tipos de ministro
    @app.route('/solicitudes')
    def solicitudes():
        return render_template('solicitudes/solicitudes_actoliturgico.html')
