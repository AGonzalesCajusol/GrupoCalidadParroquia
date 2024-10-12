from flask import render_template, request, redirect, url_for, flash, jsonify, send_file
from bd import obtener_conexion 
from io import StringIO, BytesIO
import csv
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle

from controladores.controlador_recaudaciones import (
    listar_recaudaciones,
    agregar_recaudacion,
    actualizar_recaudacion,
    eliminar_recaudacion,
    obtener_recaudaciones_por_año,
    obtener_rango_de_años
)
def registrar_rutas(app):

    # Ruta para gestionar recaudaciones
    @app.route('/gestionar_recaudaciones', methods=['GET'])
    def gestionar_recaudaciones():
        recaudaciones = listar_recaudaciones()
        return render_template('tipo_financiero/gestionar_recaudaciones.html', recaudaciones=recaudaciones)

    # Ruta para agregar una nueva recaudación
    @app.route('/insertar_recaudacion', methods=['POST'])
    def insertar_recaudacion():
        agregar_recaudacion()
        return redirect(url_for('gestionar_recaudaciones'))

    # Ruta para actualizar una recaudación existente
    @app.route('/actualizar_recaudacion', methods=['POST'])
    def actualizar_recaudacion():
        actualizar_recaudacion()
        return redirect(url_for('gestionar_recaudaciones'))

    # Ruta para eliminar una recaudación
    @app.route('/eliminar_recaudacion', methods=['POST'])
    def eliminar_recaudacion():
        eliminar_recaudacion()
        return redirect(url_for('gestionar_recaudaciones'))


    ##NOO BORRAR####
    @app.route('/exportar_recaudaciones_csv', methods=['POST'])
    def exportar_recaudaciones_csv():
        año = request.form['año']
        recaudaciones = obtener_recaudaciones_por_año(año)

        # Crear un archivo CSV en memoria con UTF-8 BOM
        si = StringIO()
        cw = csv.writer(si, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        
        # Escribir BOM al principio del archivo para que Excel lo reconozca correctamente
        si.write('\ufeff')

        # Escribir el encabezado
        cw.writerow(['ID', 'Fecha', 'Monto', 'Descripción', 'Sede', 'Tipo de Recaudación', 'Monetaria/No Monetaria'])

        # Escribir los datos de las recaudaciones
        for recaudacion in recaudaciones:
            cw.writerow([recaudacion[0], recaudacion[1], recaudacion[2], recaudacion[3], recaudacion[4], recaudacion[5], recaudacion[6]])

        # Preparar el archivo CSV para la descarga
        output = BytesIO()
        output.write(si.getvalue().encode('utf-8'))
        output.seek(0)

        return send_file(output, mimetype='text/csv', as_attachment=True, download_name=f'recaudaciones_{año}.csv')


    # Ruta para exportar recaudaciones en formato PDF
    @app.route('/exportar_recaudaciones_pdf', methods=['POST'])
    def exportar_recaudaciones_pdf():
        año = request.form['año']
        recaudaciones = obtener_recaudaciones_por_año(año)

        # Crear un archivo PDF en memoria
        output = BytesIO()
        pdf = SimpleDocTemplate(output, pagesize=letter)

        # Crear una lista para la tabla
        data = [['ID', 'Fecha', 'Monto', 'Descripción', 'Sede', 'Tipo de Recaudación', 'Monetaria/No Monetaria']]  # Encabezado de la tabla

        # Añadir las filas de las recaudaciones
        for recaudacion in recaudaciones:
            data.append([recaudacion[0], recaudacion[1], recaudacion[2], recaudacion[3], recaudacion[4], recaudacion[5], recaudacion[6]])

        # Crear la tabla
        table = Table(data)

        # Aplicar estilo a la tabla
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),  # Encabezado de color gris
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),  # Fondo de las celdas de datos
            ('GRID', (0, 0), (-1, -1), 1, colors.black)  # Bordes de la tabla
        ])
        table.setStyle(style)

        # Construir el PDF
        elements = []
        elements.append(table)
        pdf.build(elements)

        # Preparar el archivo PDF para la descarga
        output.seek(0)
        return send_file(output, mimetype='application/pdf', as_attachment=True, download_name=f'recaudaciones_{año}.pdf')


    # Ruta para exportar recaudaciones - Página de exportación
    @app.route('/exportar_recaudaciones', methods=['GET'])
    def exportar_recaudaciones():
        años = obtener_rango_de_años()  # Función que devuelve el rango de años
        return render_template('tipo_financiero/ExportarRecaudaciones.html', años=años)
    
    @app.route('/obtener_recaudaciones_por_anio', methods=['POST'])
    def obtener_recaudaciones_por_anio():
        try:
            # Obtener el dato JSON enviado por el cliente
            data = request.get_json()
            año = data.get('año')

            if not año:
                return jsonify({'error': 'Año no proporcionado'}), 400

            # Llamar a la función para obtener las recaudaciones
            recaudaciones = obtener_recaudaciones_por_año(año)

            # Procesar las recaudaciones y devolver el JSON correcto
            recaudaciones_json = []
            for rec in recaudaciones:
                recaudaciones_json.append({
                    'id': rec[0],
                    'fecha': rec[1].strftime('%Y-%m-%d'),
                    'monto': rec[2],
                    'observacion': rec[3],
                    'sede': rec[4],
                    'tipo_recaudacion': rec[5],
                    'tipo': rec[6]
                })

            return jsonify({'recaudaciones': recaudaciones_json})

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'error': 'Error al obtener las recaudaciones'}), 500


    


    
