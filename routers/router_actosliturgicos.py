from flask import render_template, request, redirect, url_for, flash
import controladores.controlador_actosliturgicos as cal

def registrar_rutas(app):
    @app.route("/gestionar_actosliturgicos", methods=["GET"])
    def gestionar_actosliturgicos():
        lista_actosliturgicos = cal.obtener_actosliturgicos() # Asegúrate de que esta función esté devolviendo los datos correctamente
        return render_template("/actos_liturgicos/gestionar_actoliturgico.html", lista_actosliturgicos= lista_actosliturgicos)
