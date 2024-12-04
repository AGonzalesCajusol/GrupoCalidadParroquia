from flask import render_template, request
from controladores.controlador_reportes import obtener_bautizos_aptos

def registrar_rutas(app):
    @app.route('/reportes/bautizos_aptos')
    def bautizos_aptos():
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        bautizos = obtener_bautizos_aptos(fecha_inicio, fecha_fin)
        return render_template('reportes/bautizos_aptos.html', bautizos=bautizos) 