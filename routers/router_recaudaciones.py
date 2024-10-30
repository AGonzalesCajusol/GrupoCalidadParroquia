from flask import jsonify, render_template, request, redirect, url_for, flash, send_file
import traceback
from io import BytesIO, StringIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
import csv
import os
import re

from controladores.controlador_recaudaciones import (
    insertar_recaudacion,
    obtener_recaudaciones,
    obtener_rango_de_años,
    obtener_tipos_recaudacion,
    obtener_id_sede_por_nombre,
    obtener_recaudaciones_por_año,
    obtener_id_tipoR_por_nombre,
    actualizar_recaudacion,
    eliminar_recaudacion
)

def registrar_rutas(app):
    # Ruta para gestionar recaudaciones
    @app.route("/gestionar_recaudaciones", methods=["GET"])
    def gestionar_recaudaciones():
        recaudaciones = obtener_recaudaciones()
        tipos = obtener_tipos_recaudacion()  # Obtén los tipos de recaudación
        años = obtener_rango_de_años()  # Obtenemos el rango de años disponibles en la BD
        return render_template("tipo_financiero/gestionar_recaudaciones.html", recaudaciones=recaudaciones, tipos=tipos, años=años)


    # Procesar la actualización de una recaudación
    @app.route("/procesar_actualizar_recaudacion", methods=["POST"])
    def procesar_actualizar_recaudacion():
        try:
            # Obtén los datos del formulario
            id_recaudacion = request.form["id"]
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            nombre_tipo_recaudacion = request.form["id_tipo_recaudacion"]

            
            id_tipo_recaudacion = obtener_id_tipoR_por_nombre(nombre_tipo_recaudacion)

            
            # Obtén el nombre de la sede desde las cookies
            nombre_sede = request.cookies.get("sede")


            if not nombre_sede:
                return jsonify(success=False, message="No se pudo obtener el nombre de la sede del usuario.")

            # Obtén el ID de la sede usando el nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)

            if not id_sede:
                return jsonify(success=False, message="La sede especificada no se encuentra en la base de datos.")

            # Llama a la función que procesa la actualización
            success = actualizar_recaudacion(monto, observacion, id_tipo_recaudacion, id_recaudacion, id_sede)
            if success:
                # Recupera las recaudaciones actualizadas
                recaudaciones = obtener_recaudaciones()
                recaudaciones_data = [
                    {
                        "id": rec[0],
                        "monto": rec[3],
                        "observacion": rec[4],
                        "sede": rec[5],
                        "tipo_recaudacion": rec[6]
                    }
                    for rec in recaudaciones
                ]

                return jsonify(success=True, recaudaciones=recaudaciones_data, message="Recaudación actualizada exitosamente")
            else:
                return jsonify(success=False, message="Error al actualizar la recaudación")

        except Exception as e:
            print("Error:", e)
            return jsonify(success=False, message="Error al actualizar la recaudación"), 400

    @app.route("/insertar_recaudacion", methods=["POST"])
    def procesar_insertar_recaudacion():
        try:
            # Obtener los datos del formulario
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]
            
            # Obtener el nombre de la sede desde las cookies
            nombre_sede = request.cookies.get("sede")

            if not nombre_sede:
                flash("No se pudo obtener el nombre de la sede del usuario.", "error")
                return redirect(url_for("gestionar_recaudaciones"))

            # Obtener el ID de la sede a partir del nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)
            if not id_sede:
                flash("La sede especificada no se encuentra en la base de datos.", "error")
                return redirect(url_for("gestionar_recaudaciones"))

            # Insertar la recaudación en la base de datos
            insertar_recaudacion(monto, observacion, id_sede, id_tipo_recaudacion)
            
            # Obtener las recaudaciones actualizadas después de la inserción
            recaudaciones = obtener_recaudaciones()
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "fecha": rec[1].strftime('%Y-%m-%d'),
                    "hora": rec[2].strftime('%H:%M'),
                    "monto": rec[3],
                    "observacion": rec[4],
                    "sede": rec[5],
                    "tipo_recaudacion": rec[6]
                }
                for rec in recaudaciones
            ]

            # Devuelve la respuesta con los datos actualizados
            return jsonify({
                "success": True,
                "message": "Recaudación agregada exitosamente.",
                "recaudaciones": recaudaciones_data
            })
        except Exception as e:
            traceback.print_exc()
            return jsonify(success=False, message=f"Error al insertar recaudación: {str(e)}"), 400


    @app.route("/eliminar_recaudacion", methods=["POST"])
    def procesar_eliminar_recaudacion():
        try:
            # Obtener el ID de la recaudación a eliminar
            data = request.get_json()
            id_recaudacion = data["id"]
            
            # Eliminar la recaudación
            eliminar_recaudacion(id_recaudacion)
            
            # Obtener las recaudaciones actualizadas
            recaudaciones = obtener_recaudaciones()
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "fecha": rec[1].strftime('%Y-%m-%d'),
                    "hora": rec[2].strftime('%H:%M'),
                    "monto": rec[3],
                    "observacion": rec[4],
                    "sede": rec[5],
                    "tipo_recaudacion": rec[6]
                }
                for rec in recaudaciones
            ]

            return jsonify(success=True, recaudaciones=recaudaciones_data, message="Recaudación eliminada exitosamente")
        except Exception as e:
            traceback.print_exc()
            return jsonify(success=False, message=f"Error al eliminar recaudación: {str(e)}"), 400

    # Ruta para exportar recaudaciones en CSV
    @app.route('/exportar_recaudaciones_csv', methods=['POST'])
    def exportar_recaudaciones_csv():
        try:
            año = request.form['año']
            recaudaciones = obtener_recaudaciones_por_año(año)

            # Crear un archivo CSV en memoria
            si = StringIO()
            cw = csv.writer(si, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            
            # Escribir BOM al principio del archivo para que Excel lo reconozca correctamente
            si.write('\ufeff')

            # Escribir el encabezado
            cw.writerow(['ID', 'Fecha', 'Monto', 'Descripción', 'Sede', 'Tipo de Recaudación', 'Monetaria/No Monetaria'])

            # Escribir las recaudaciones
            for rec in recaudaciones:
                cw.writerow([rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6]])

            # Preparar el archivo CSV para la descarga
            output = BytesIO()
            output.write(si.getvalue().encode('utf-8'))
            output.seek(0)

            return send_file(output, mimetype='text/csv', as_attachment=True, download_name=f'recaudaciones_{año}.csv')

        except Exception as e:
            print(f"Error al exportar recaudaciones en CSV: {e}")
            return redirect(url_for('exportar_recaudaciones'))

    # Ruta para exportar recaudaciones en PDF
    @app.route('/exportar_recaudaciones_pdf', methods=['POST'])
    def exportar_recaudaciones_pdf():
        año = request.form['año']
        recaudaciones = obtener_recaudaciones_por_año(año)
        sede = "Sede Central"  # Puedes cambiar esta parte si el valor es dinámico

        # Crear un archivo PDF en memoria
        output = BytesIO()
        pdf = SimpleDocTemplate(output, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)

        # Crear un estilo de texto para los títulos
        styles = getSampleStyleSheet()
        title = Paragraph(f"Recaudaciones de la Sede Central del año {año}", styles['Title'])
        
        # Agregar un subtítulo para la tabla
        subtitulo = Paragraph(f"Exportación recaudación del año {año} - {sede}", styles['Heading2'])

        # Crear una lista para la tabla con el orden de columnas solicitado
        data = [['ID', 'Sede', 'Tipo', 'Descripción', 'Fecha', 'Monto']]  # Encabezado de la tabla

        # Añadir las filas de las recaudaciones en el orden solicitado
        for rec in recaudaciones:

            fecha_formateada = rec[1].strftime('%d-%m-%Y')
            data.append([rec[0], rec[4], rec[5], rec[3], fecha_formateada, rec[2]])

        # Configurar los anchos de columna (ajústalos según tu necesidad)
        colWidths = [0.6 * inch, 1.5 * inch, 1.5 * inch, 1.8 * inch, 1 * inch, 1 * inch]

        # Crear la tabla con los datos y los anchos de columna personalizados
        table = Table(data, colWidths=colWidths, repeatRows=1)

        # Aplicar estilo a la tabla con colores personalizados
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f5f5dc")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#274e77")),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('ALIGN', (3, 1), (3, -1), 'LEFT'),
            ('ALIGN', (2, 1), (2, -1), 'LEFT')
        ])
        table.setStyle(style)


        elements = [title, Spacer(1, 12), subtitulo, Spacer(1, 12), table]
        pdf.build(elements)

        # Preparar el archivo PDF para la descarga
        output.seek(0)
        return send_file(output, mimetype='application/pdf', as_attachment=True, download_name=f'recaudaciones_{año}.pdf')




