from flask import render_template, redirect, jsonify
from bd import obtener_conexion 
import controladores.controlador_charla as cncha
import controladores.controlador_ministro as cmin

def registrar_rutas(app):
    @app.route("/gestionar_programacionActo", methods=["GET"])
    def gestionar_programacionActo():
        return render_template("charlas/charlas.html")
    
    @app.route("/ministros_registro", methods=["GET"])
    def ministros_registro():
        ministros = cmin.obtener_ministros()
        lista_ministro = []
        for ministro in ministros:
            lista_ministro.append({
                'numero_doc': ministro[2],
                'nombre_ministro': ministro[1],
                'sede': ministro[8]
            })
        return jsonify(lista_ministro)



