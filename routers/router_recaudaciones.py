from flask import jsonify, render_template, request, redirect, url_for, flash,send_file
import traceback
from controladores.controlador_recaudaciones import *
from io import * 
from reportlab.lib.pagesizes import *  # Importa todo relacionado con tamaños de página
from reportlab.lib import colors  # Importa solo colors
from reportlab.platypus import *  # Importa todas las herramientas de ReportLab para tablas y plantillas
from reportlab.lib.units import *  # Importa todas las unidades de medida, como inch
import csv  # Este lo dejamos como está, ya que no tiene tantas funciones y no es necesario usar *
from reportlab.lib.styles import getSampleStyleSheet

from controladores.controlador_recaudaciones import (
    insertar_recaudacion,
    obtener_recaudaciones,
    dar_baja_recaudacion,
    eliminar_recaudacion,
    obtener_tipos_recaudacion,
    obtener_id_sede_por_nombre,
    obtener_recaudaciones_por_año
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
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]
            estado = request.form.get("estado", "1") == "1"
            
            # Obtén el nombre de la sede desde las cookies
            nombre_sede = request.cookies.get("sede")
            print(f"Nombre de la sede obtenido: {nombre_sede}")  # Verificar el valor obtenido

            if not nombre_sede:
                return jsonify(success=False, message="No se pudo obtener el nombre de la sede del usuario.")

            # Obtén el ID de la sede usando el nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)
            print(f"ID de la sede obtenida: {id_sede}")  # Verificar que se obtiene el ID correcto
            if not id_sede:
                return jsonify(success=False, message="La sede especificada no se encuentra en la base de datos.")

            # Llama a la función que procesa la actualización
            success = actualizar_recaudacion(id_recaudacion, monto, observacion, id_tipo_recaudacion, estado, id_sede)
            print(f"Resultado de la actualización: {success}")  # Verificar si la actualización fue exitosa
            if success:
                # Recupera las recaudaciones actualizadas
                recaudaciones = obtener_recaudaciones()
                recaudaciones_data = [
                    {
                        "id": rec[0],
                        "monto": rec[3],
                        "observacion": rec[4],
                        "estado": "Activo" if rec[5] else "Inactivo",
                        "sede": rec[6],
                        "tipo_recaudacion": rec[7]
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
                    "hora": f"{rec[2].seconds // 3600:02}:{(rec[2].seconds % 3600) // 60:02}",  # Formato "HH:MM"
                    "monto": rec[3],
                    "observacion": rec[4],
                    "estado": "Activo" if rec[5] else "Inactivo",
                    "sede": rec[6],
                    "tipo_recaudacion": rec[7]
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
                    "hora": f"{rec[2].seconds // 3600:02}:{(rec[2].seconds % 3600) // 60:02}",
                    "monto": rec[3],
                    "observacion": rec[4],
                    "estado": "Activo" if rec[5] else "Inactivo",
                    "sede": rec[6],
                    "tipo_recaudacion": rec[7]
                }
                for rec in recaudaciones
            ]

            return jsonify(success=True, recaudaciones=recaudaciones_data, message="Recaudación eliminada exitosamente")
        except Exception as e:
            traceback.print_exc()
            return jsonify(success=False, message=f"Error al eliminar recaudación: {str(e)}"), 400

    # Cambia el nombre de la función para evitar conflicto con la función de base de datos
    @app.route('/obtener_id_sede_por_nombre/<sede_nombre>', methods=['GET'])
    def obtener_id_sede_por_nombre_route(sede_nombre):
        id_sede = obtener_id_sede_por_nombre(sede_nombre)  # Esta es la función de la base de datos
        if id_sede:
            return jsonify({"id": id_sede})
        else:
            return jsonify({"error": "Sede no encontrada"}), 404

    # Ruta para dar de baja una recaudación
    @app.route("/dar_baja_recaudacion", methods=["POST"])
    def procesar_dar_baja_recaudacion():
        try:
            id_recaudacion = request.json.get("id")  # Usamos request.json en lugar de request.form
            dar_baja_recaudacion(id_recaudacion)

            recaudaciones = obtener_recaudaciones()
            recaudaciones_data = [
                {
                    "id": rec[0],
                    "sede": rec[6],
                    "tipo_recaudacion": rec[7],
                    "observacion": rec[4],
                    "estado": "Activo" if rec[5] else "Inactivo",  # Cambiar estado a "Activo"/"Inactivo"
                    "monto": rec[3]
                }
                for rec in recaudaciones
            ]

            return jsonify(success=True, recaudaciones=recaudaciones_data, message="Recaudación dada de baja exitosamente")

        except Exception as e:
            return jsonify(success=False, message=f"Error al dar de baja: {str(e)}"), 400
###Exportar##
    @app.route('/obtener_recaudaciones_por_anio', methods=['POST'])
    def obtener_recaudaciones_por_anio():
        try:
            # Obtener el dato JSON enviado por el cliente
            data = request.get_json()
            año = data.get('año')

            if not año:
                return jsonify({'error': 'Año no proporcionado'}), 400

            # Llamar a la función para obtener las recaudaciones por año
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

    @app.route('/generar_pdf_previsualizacion', methods=['POST'])
    def generar_pdf_previsualizacion():
        año = request.form['año']
        recaudaciones = obtener_recaudaciones_por_año(año)
        sede = "Sede Central"  # Puedes cambiar esta parte si el valor es dinámico

        # Genera el PDF y guárdalo temporalmente en una ruta accesible
        output = BytesIO()
        pdf = SimpleDocTemplate(output, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)

        styles = getSampleStyleSheet()
        title = Paragraph(f"Recaudaciones de la Sede Central del año {año}", styles['Title'])
        subtitulo = Paragraph(f"Exportación recaudación del año {año} - {sede}", styles['Heading2'])

        data = [['ID', 'Sede', 'Tipo', 'Descripción', 'Fecha', 'Monto']]
        for rec in recaudaciones:
            fecha_formateada = rec[1].strftime('%d-%m-%Y')
            data.append([rec[0], rec[4], rec[5], rec[3], fecha_formateada, rec[2]])

        colWidths = [0.6 * inch, 1.5 * inch, 1.5 * inch, 1.8 * inch, 1 * inch, 1 * inch]
        table = Table(data, colWidths=colWidths, repeatRows=1)

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

        # Guardar el PDF en un archivo temporal en la carpeta estática
        with open("static/preview_recaudaciones.pdf", "wb") as f:
            f.write(output.getvalue())

        return jsonify({"success": True, "preview_url": "/static/preview_recaudaciones.pdf"})

    @app.route('/exportar_recaudaciones_pdf', methods=['POST'])
    def exportar_recaudaciones_pdf():
        año = request.form['año']
        recaudaciones = obtener_recaudaciones_por_año(año)
        sede = "Sede Central"  # Si la sede es fija, si es variable puedes ajustarlo

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
            # Convertir la fecha al formato día-mes-año
            fecha_formateada = rec[1].strftime('%d-%m-%Y')
            data.append([rec[0], rec[4], rec[5], rec[3], fecha_formateada, rec[2]])

        # Configurar los anchos de columna (ajústalos según tu necesidad)
        colWidths = [0.6 * inch, 1.5 * inch, 1.5 * inch, 1.8 * inch, 1 * inch, 1 * inch]

        # Crear la tabla con los datos y los anchos de columna personalizados
        table = Table(data, colWidths=colWidths, repeatRows=1)  # repeatRows=1 para que el encabezado se repita en cada página

        # Aplicar estilo a la tabla con colores personalizados: cabecera beige, letras azules
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f5f5dc")),  # Fondo beige para la cabecera
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#274e77")),  # Texto azul en la cabecera
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Alinear todo al centro inicialmente
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),  # Fondo blanco para las celdas de datos
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),  # Texto negro para el contenido de las celdas
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),  # Bordes de la tabla en negro

            # Alinear a la izquierda las columnas de "Descripción" y "Tipo de Recaudación"
            ('ALIGN', (3, 1), (3, -1), 'LEFT'),  # Alinear la columna de "Descripción" a la izquierda
            ('ALIGN', (2, 1), (2, -1), 'LEFT')   # Alinear la columna de "Tipo de Recaudación" a la izquierda
        ])
        table.setStyle(style)

        # Construir el PDF
        elements = [title, Spacer(1, 12), subtitulo, Spacer(1, 12), table]
        pdf.build(elements, onFirstPage=_add_page_number, onLaterPages=_add_page_number)

        # Preparar el archivo PDF para la descarga
        output.seek(0)
        return send_file(output, mimetype='application/pdf', as_attachment=True, download_name=f'recaudaciones_{año}.pdf')


def _add_page_number(canvas, doc):
    """Agregar números de página en el pie del PDF"""
    page_num = canvas.getPageNumber()
    text = f"Página {page_num}"
    canvas.drawRightString(200 * mm, 15 * mm, text)




