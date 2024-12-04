from flask import jsonify, render_template, send_file, request
from controladores.controlador_secretaria import obtener_solicitudes_matrimonio
from controladores.controlador_certificado import generar_acta_matrimonio_pdf
from controladores.controlador_ministro import obtener_ministros

def registrar_rutas(app):
    @app.route('/gestionar_actas')
    def gestionar_actas():
        ministros = obtener_ministros()
        return render_template('secretaria/gestionar_actas.html', 
                             ministros=ministros)

    @app.route('/generar_acta_matrimonio', methods=['POST'])
    def generar_acta():
        try:
            datos = request.get_json()
            pdf_path = generar_acta_matrimonio_pdf(datos)
            return send_file(pdf_path, 
                           as_attachment=True,
                           download_name=f'acta_matrimonio.pdf')
        except Exception as e:
            print(f"Error al generar el acta: {str(e)}")
            return jsonify({'error': str(e)}), 500