from flask import jsonify, render_template, send_file, request, redirect, url_for
from controladores.controlador_secretaria import obtener_solicitudes_matrimonio
from controladores.controlador_certificado import generar_acta_matrimonio_pdf
from controladores.controlador_ministro import obtener_ministros
from bd import obtener_conexion
from flask import render_template
from datetime import timedelta, datetime


from fpdf import FPDF
from flask import send_file
import os


def timedelta_to_str(td):
    if isinstance(td, timedelta):
        # Convertir a segundos o el formato que necesites
        return str(td)  # o td.total_seconds() si quieres en segundos

    # Si no es un timedelta, retorna como está (para casos de date o time)
    return td



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
        
    @app.route('/seleccionar_solicitud_matrimonio')
    def seleccionar_solicitud_matrimonio():
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Consulta para obtener las solicitudes de matrimonio con los nombres de los novios
        cursor.execute("""
            SELECT s.id_solicitud, 
                   MAX(CASE WHEN sf.rol = 'Novio' THEN CONCAT(f.nombres, ' ', f.apellidos) END) as novio,
                   MAX(CASE WHEN sf.rol = 'Novia' THEN CONCAT(f.nombres, ' ', f.apellidos) END) as novia,
                   c.fecha
            FROM solicitud s
            JOIN solicitud_feligres sf ON s.id_solicitud = sf.id_solicitud
            JOIN feligres f ON sf.dni_feligres = f.dni
            JOIN celebracion c ON s.id_celebracion = c.id_celebracion
            WHERE s.id_actoliturgico = 1
            GROUP BY s.id_solicitud, c.fecha
        """)
        solicitudes = cursor.fetchall()
        
        cursor.close()
        conexion.close()
        
        return render_template('reportes/seleccionar_solicitud.html', solicitudes=solicitudes)

    @app.route('/listar_solicitudessss')
    def listar_solicitudessss():
        id_solicitud = request.args.get('id_solicitud')
        if not id_solicitud:
            return redirect(url_for('seleccionar_solicitud_matrimonio'))

        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            SELECT s.*, a.nombre_liturgia 
            FROM solicitud s
            JOIN actoliturgico a ON s.id_actoliturgico = a.id_actoliturgico 
            WHERE s.id_solicitud = %s
        """, (id_solicitud,))
        solicitud = cursor.fetchone()

        if solicitud:
            cursor.execute("SELECT * FROM celebracion WHERE id_celebracion = %s", (solicitud[4],))
            celebracion = cursor.fetchone()

            cursor.execute("SELECT * FROM actoliturgico WHERE id_actoliturgico = %s", (solicitud[1],))
            actoliturgico = cursor.fetchone()

            cursor.execute("""
                SELECT f.nombres, f.apellidos, f.fecha_nacimiento, sf.rol
                FROM solicitud_feligres sf
                JOIN feligres f ON sf.dni_feligres = f.dni
                WHERE sf.id_solicitud = %s
            """, (solicitud[0],))
            solicitud_feligreses = cursor.fetchall()

        else:
            celebracion = None
            actoliturgico = None
            solicitud_feligreses = []

        cursor.close()
        conexion.close()

        return render_template('reportes/listar_solicitudes.html', 
                            solicitud=solicitud, 
                            celebracion=celebracion, 
                            actoliturgico=actoliturgico,
                            solicitud_feligreses=solicitud_feligreses)




    @app.route('/generar_pdfss', methods=['POST'])
    def generar_pdfss():
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        # Mantener las consultas existentes
        cursor.execute("SELECT * FROM solicitud WHERE id_solicitud = 48")
        solicitud = cursor.fetchone()

        cursor.execute("SELECT * FROM celebracion WHERE id_celebracion = %s", (solicitud[4],))
        celebracion = cursor.fetchone()

        # Consulta modificada para obtener todos los feligreses con sus roles
        cursor.execute("""
            SELECT f.nombres, f.apellidos, f.dni, f.fecha_nacimiento, sf.rol
            FROM solicitud_feligres sf
            JOIN feligres f ON sf.dni_feligres = f.dni
            WHERE sf.id_solicitud = %s
        """, (solicitud[0],))
        feligreses = cursor.fetchall()

        # Organizar feligreses por rol
        datos_pdf = {
            'novio': None, 'novia': None,
            'padre_novio': None, 'madre_novio': None,
            'padre_novia': None, 'madre_novia': None,
            'padrino': None, 'madrina': None,
            'testigos': [], 'sacerdote': None
        }

        for f in feligreses:
            if f[4] == 'Novio': datos_pdf['novio'] = f
            elif f[4] == 'Novia': datos_pdf['novia'] = f
            elif f[4] == 'Padre Novio': datos_pdf['padre_novio'] = f
            elif f[4] == 'Madre Novio': datos_pdf['madre_novio'] = f
            elif f[4] == 'Padre Novia': datos_pdf['padre_novia'] = f
            elif f[4] == 'Madre Novia': datos_pdf['madre_novia'] = f
            elif f[4] == 'Padrino': datos_pdf['padrino'] = f
            elif f[4] == 'Madrina': datos_pdf['madrina'] = f
            elif f[4] == 'Testigo': datos_pdf['testigos'].append(f)
            elif f[4] == 'Sacerdote': datos_pdf['sacerdote'] = f

        cursor.close()
        conexion.close()

        # Crear el PDF
        pdf = FPDF()
        pdf.add_page()
        
        # Imagen de fondo
        pdf.image("static/img/Diosesis-opaco3.png", x=0, y=0, w=210, h=297)
        
        # Logo en la esquina superior izquierda
        pdf.image("static/img/Diosesis.png", x=10, y=10, w=30)  # Ajusta w=30 según el tamaño que necesites

        # Título principal en negrita y más grande
        pdf.set_font("Arial", "B", 24)
        pdf.set_xy(0, 20)
        pdf.cell(210, 20, txt="OBISPADO DE CHICLAYO", ln=True, align='C')

        # Contenido del certificado
        pdf.set_font("Arial", "B", 16)
        pdf.cell(190, 20, txt="CONSTANCIA DE MATRIMONIO", ln=True, align='C')
        pdf.set_font("Arial", size=12)
        pdf.ln(10)
        pdf.multi_cell(190, 10, txt="Por la presente se CERTIFICA que en el Archivo de la Parroquia SANTA MARIA CATEDRAL se encuentra una partida en el libro de Matrimonio N° 12 Folio 12 Partida 12 cuyos datos son:", align='L')
        
        # Datos de los novios
        if datos_pdf['novio']:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Nombre del esposo:", ln=0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(130, 10, txt=f" {datos_pdf['novio'][0]} {datos_pdf['novio'][1]} (DNI: {datos_pdf['novio'][2]})", ln=1)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Edad:", ln=0)
            pdf.set_font("Arial", "", 12)
            edad_novio = calculate_age(datos_pdf['novio'][3])
            pdf.cell(130, 10, txt=f" {edad_novio} años", ln=1)

        if datos_pdf['novia']:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Nombre de la esposa:", ln=0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(130, 10, txt=f" {datos_pdf['novia'][0]} {datos_pdf['novia'][1]} (DNI: {datos_pdf['novia'][2]})", ln=1)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Edad:", ln=0)
            pdf.set_font("Arial", "", 12)
            edad_novia = calculate_age(datos_pdf['novia'][3])
            pdf.cell(130, 10, txt=f" {edad_novia} años", ln=1)

        # Fecha del matrimonio
        if celebracion:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Fecha del matrimonio:", ln=0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(130, 10, txt=f" {celebracion[2]}", ln=1)

        # Padres
        if datos_pdf['padre_novio'] and datos_pdf['madre_novio']:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Padres del esposo:", ln=0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(130, 10, txt=f" {datos_pdf['padre_novio'][0]} {datos_pdf['padre_novio'][1]} y {datos_pdf['madre_novio'][0]} {datos_pdf['madre_novio'][1]}", ln=1)

        if datos_pdf['padre_novia'] and datos_pdf['madre_novia']:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Padres de la esposa:", ln=0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(130, 10, txt=f" {datos_pdf['padre_novia'][0]} {datos_pdf['padre_novia'][1]} y {datos_pdf['madre_novia'][0]} {datos_pdf['madre_novia'][1]}", ln=1)

        # Padrino
        if datos_pdf['padrino']:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Padrino:", ln=0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(130, 10, txt=f" {datos_pdf['padrino'][0]} {datos_pdf['padrino'][1]}", ln=1)

        # Testigos
        pdf.set_font("Arial", "B", 12)
        pdf.cell(60, 10, txt="Testigos:", ln=1)
        pdf.set_font("Arial", "", 12)
        for i, testigo in enumerate(datos_pdf['testigos'], 1):
            pdf.cell(60, 10, txt="", ln=0)
            pdf.cell(130, 10, txt=f"{i}. {testigo[0]} {testigo[1]}", ln=1)

        # Sacerdote
        if datos_pdf['sacerdote']:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 10, txt="Sacerdote:", ln=0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(130, 10, txt=f" {datos_pdf['sacerdote'][0]} {datos_pdf['sacerdote'][1]}", ln=1)

        # Agregar espacio antes de la firma y legalización
        pdf.ln(15)

        # Sección izquierda (Legalización)
        pdf.set_font("Arial", "B", 10)
        pdf.cell(90, 10, "LEGALIZACIÓN", ln=0)
        # Espacio para la derecha (firma)
        pdf.cell(20, 10, "", ln=0)
        pdf.cell(70, 10, "_____________________", ln=1, align='C')

        # Texto de certificación y nombre del párroco
        pdf.set_font("Arial", "", 10)
        pdf.cell(90, 10, "El suscrito certifica la autenticidad", ln=0)
        pdf.cell(20, 10, "", ln=0)
        pdf.set_font("Arial", "B", 12)
        pdf.cell(70, 10, "JORGE CARRASCO FUENTES", ln=1, align='C')

        pdf.set_font("Arial", "", 10)
        pdf.cell(90, 10, "de la firma y sello de la presente", ln=0)
        pdf.cell(20, 10, "", ln=0)
        pdf.set_font("Arial", "", 12)
        pdf.cell(70, 10, "PÁRROCO", ln=1, align='C')
        pdf.set_font("Arial", "", 10)
        pdf.cell(90, 10, "Constancia de Matrimonio", ln=1)
        MESES = {
            'January': 'Enero',
            'February': 'Febrero',
            'March': 'Marzo',
            'April': 'Abril',
            'May': 'Mayo',
            'June': 'Junio',
            'July': 'Julio',
            'August': 'Agosto',
            'September': 'Septiembre',
            'October': 'Octubre',
            'November': 'Noviembre',
            'December': 'Diciembre'
        }
        # Fecha actual en español
        fecha_actual = datetime.now()
        dia = fecha_actual.day
        mes = MESES[fecha_actual.strftime('%B')]
        año = fecha_actual.year
        
        pdf.cell(90, 10, f"Chiclayo, {dia} de {mes} de {año}", ln=1)

        # Guardar el PDF
        pdf_output_path = "static/certificados/acta_solicitud.pdf"
        pdf.output(pdf_output_path)

        return send_file(pdf_output_path, as_attachment=True)

# Función auxiliar para calcular la edad
def calculate_age(birthdate):
    today = datetime.today()
    age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
    return age




   
