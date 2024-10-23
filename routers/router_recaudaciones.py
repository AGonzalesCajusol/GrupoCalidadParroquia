from flask import jsonify, render_template, request, redirect, url_for, flash,send_file
from controladores.controlador_recaudaciones import *
from io import * 
from reportlab.lib.pagesizes import *  # Importa todo relacionado con tamaños de página
from reportlab.lib import colors  # Importa solo colors
from reportlab.platypus import *  # Importa todas las herramientas de ReportLab para tablas y plantillas
from reportlab.lib.units import *  # Importa todas las unidades de medida, como inch
import csv  # Este lo dejamos como está, ya que no tiene tantas funciones y no es necesario usar *


def registrar_rutas(app):
    # Ruta para gestionar recaudaciones
    @app.route("/gestionar_recaudaciones", methods=["GET"])
    def gestionar_recaudaciones():
        recaudaciones = obtener_recaudaciones()
        id_sede_central = obtener_id_sede_por_nombre("Sede Central")  # Obtén el ID de "Sede Central"
        tipos = obtener_tipos_recaudacion()  # Obtén los tipos de recaudación
        años = obtener_rango_de_años()  # Obtenemos el rango de años disponibles en la BD
        return render_template("tipo_financiero/gestionar_recaudaciones.html", recaudaciones=recaudaciones, tipos=tipos, años=años)



    # Ruta para mostrar el formulario de registro de una nueva recaudación
    @app.route("/registrar_recaudacion", methods=["GET"])
    def formulario_registrar_recaudacion():
        return render_template("recaudaciones/registrar_recaudacion.html")

    # Ruta para mostrar el formulario de edición de una recaudación
    @app.route("/editar_recaudacion/<int:id>", methods=["GET"])
    def formulario_editar_recaudacion(id):
        recaudacion = obtener_recaudacion_por_id(id)
        return render_template("recaudaciones/editar_recaudacion.html", recaudacion=recaudacion)

    # Procesar la actualización de una recaudación
    @app.route("/procesar_actualizar_recaudacion", methods=["POST"])
    def procesar_actualizar_recaudacion():
        try:
            id_recaudacion = request.form["id"]
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]

            # Aquí puedes obtener el ID de la sede por nombre o pasar directamente si ya lo tienes en el formulario
            nombre_sede = "Sede Central"  # Nombre de la sede que estás mostrando
            id_sede = obtener_id_sede_por_nombre(nombre_sede)

            if not id_sede:
                return jsonify(success=False, message="No se pudo obtener el ID de la sede")

            # Llamamos a la función para actualizar la recaudación
            success = actualizar_recaudacion(id_recaudacion, monto, observacion, id_sede, id_tipo_recaudacion)
            
            if success:
                return jsonify(success=True)
            else:
                return jsonify(success=False, message="Error al actualizar la recaudación")
        except Exception as e:
            return jsonify(success=False, message=str(e))

    # Procesar la inserción de una recaudación
    @app.route("/insertar_recaudacion", methods=["POST"])
    def procesar_insertar_recaudacion():
        try:
            monto = request.form["monto"]
            observacion = request.form["observacion"]
            nombre_sede = "Sede Central"  # Puedes cambiar esto por cualquier sede que quieras obtener
            id_tipo_recaudacion = request.form["id_tipo_recaudacion"]

            # Obtener el ID de la sede por su nombre
            id_sede = obtener_id_sede_por_nombre(nombre_sede)

            # Verificar si se obtuvo un ID válido para la sede
            if not id_sede:
                return jsonify(success=False, message="No se pudo obtener el ID de la sede")

            # Llamamos a la función para insertar la recaudación
            success = insertar_recaudacion(monto, observacion, id_sede, id_tipo_recaudacion)
        
            if success:
                flash("Recaudación agregada exitosamente", "success")
                return redirect(url_for("gestionar_recaudaciones"))  # Redirige a la página principal
            else:
                flash("Error al agregar la recaudación", "danger")
                return redirect(url_for("gestionar_recaudaciones"))
        except Exception as e:
            flash(f"Error: {str(e)}", "danger")
            return redirect(url_for("gestionar_recaudaciones"))

    # procesar dar de baja
    @app.route("/dar_baja_recaudacion", methods=["POST"])
    def procesar_dar_baja_recaudacion():
        id = request.form.get('id')
        dar_baja_recaudacion(id)
        flash("La recaudación fue dada de baja exitosamente")
        return redirect(url_for("gestionar_recaudaciones"))

    # Procesar la eliminación de una recaudación
    @app.route("/eliminar_recaudacion", methods=["POST"])
    def procesar_eliminar_recaudacion():
        data = request.get_json()
        try:
            eliminar_recaudacion(data['id'])
            return jsonify(success=True)
        except Exception as e:
            return jsonify(success=False, message=str(e))

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


    @app.route('/exportar_recaudaciones_pdf', methods=['POST'])
    def exportar_recaudaciones_pdf():
        año = request.form['año']
        recaudaciones = obtener_recaudaciones_por_año(año)

        # Crear un archivo PDF en memoria
        output = BytesIO()
        pdf = SimpleDocTemplate(output, pagesize=letter)

        # Crear una lista para la tabla sin la columna de Monetario/No Monetario
        data = [['ID', 'Fecha', 'Monto', 'Descripción', 'Sede', 'Tipo de Recaudación']]  # Encabezado de la tabla

        # Añadir las filas de las recaudaciones
        for rec in recaudaciones:
            data.append([rec[0], rec[1].strftime('%Y-%m-%d'), rec[2], rec[3], rec[4], rec[5]])

        # Configurar los anchos de columna (ajústalos según tu necesidad)
        colWidths = [0.8 * inch, 1.2 * inch, 1 * inch, 1.8 * inch, 1.5 * inch, 1.5 * inch]

        # Crear la tabla con los datos y los anchos de columna personalizados
        table = Table(data, colWidths=colWidths)

        # Aplicar estilo a la tabla con colores personalizados: azul, blanco y beige
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#274e77")),  # Encabezado color azul (hex: #274e77)
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),  # Texto blanco en el encabezado
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#f5f5dc")),  # Fondo beige para las celdas (hex: #f5f5dc)
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),  # Texto negro para el contenido de las celdas
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black)  # Bordes de la tabla en negro
        ])
        table.setStyle(style)

        # Construir el PDF
        elements = []
        elements.append(table)
        pdf.build(elements)

        # Preparar el archivo PDF para la descarga
        output.seek(0)
        return send_file(output, mimetype='application/pdf', as_attachment=True, download_name=f'recaudaciones_{año}.pdf')
