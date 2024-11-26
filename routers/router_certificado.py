
from flask import render_template, request, jsonify
from flask import send_file
from controladores.controlador_celebracion import *
from controladores.controlador_actosliturgicos import *
from controladores.controlador_certificado import *

def registrar_rutas(app):


    @app.route("/gestionar_certificado", methods=["GET"])
    def gestionar_certificado():
        try:
            # Obtener las celebraciones con estado 'R'
            celebraciones = obtener_solicitudes_asistidas()
            # Obtener los actos litúrgicos
            actos_liturgicos = obtener_acto()  # Devuelve una lista [(id, nombre), ...]
            return render_template(
                "celebracion/gestionar_certificados.html",
                celebraciones=celebraciones,
                actos_liturgicos=[{"id": a[0], "nombre": a[1]} for a in actos_liturgicos],
            )
        except Exception as e:
            print(f"Error al obtener certificados o actos litúrgicos: {str(e)}")
            return jsonify(success=False, message="Error al cargar los datos"), 500

        


    
    @app.route('/certificado', methods=['POST'])
    def generar_certificado_post():
        try:
            data = request.get_json()
            id_solicitud = data.get('id_solicitud')

            if not id_solicitud:
                return jsonify(success=False, message="ID de solicitud no proporcionado"), 400

            # Generar el certificado PDF
            pdf_path = generar_certificado_pdf(id_solicitud)

            # Enviar el archivo con nombre y tipo MIME
            return send_file(pdf_path, as_attachment=True, download_name=f"certificado_{id_solicitud}.pdf", mimetype='application/pdf')

        except Exception as e:
            print(f"Error al generar el certificado: {e}")
            return jsonify(success=False, message="Error al generar el certificado."), 500
