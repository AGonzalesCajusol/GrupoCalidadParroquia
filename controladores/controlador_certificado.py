from fpdf import FPDF
import os
from bd import obtener_conexion  # Importa tu función de conexión a la base de datos.

def generar_certificado_pdf(id_solicitud):
    conexion = obtener_conexion()
    try:
        # Crear la carpeta 'static/certificados' si no existe
        os.makedirs("static/certificados", exist_ok=True)

        # Ruta para guardar el PDF
        pdf_path = f"static/certificados/certificado_{id_solicitud}.pdf"

        with conexion.cursor() as cursor:
            # Ejecutar el procedimiento almacenado
            cursor.execute("CALL obtener_datos_certificado(%s)", (id_solicitud,))
            datos = cursor.fetchall()

        if not datos:
            raise Exception("No se encontraron datos para la solicitud.")

        # Crear el PDF
        pdf = FPDF()
        pdf.add_page()

        # Encabezado
        pdf.set_font("Arial", "B", 20)
        pdf.cell(0, 10, str(datos[0][7]).upper(), ln=True, align='C')  # nombre_sede
        pdf.ln(10)
        pdf.cell(0, 10, f"CERTIFICADO DE {str(datos[0][2]).upper()}", ln=True, align='C')  # nombre_liturgia
        pdf.ln(20)

        # Cuerpo principal
        pdf.set_font("Arial", size=14)
        pdf.multi_cell(0, 10, f"Por la presente se certifica que, en la parroquia {str(datos[0][7])}, "
                              f"se aprobó y realizó el acto litúrgico de {str(datos[0][2])}, "
                              f"celebración número {datos[0][0]}, con solicitud número {datos[0][1]}.",
                      align='J')
        pdf.ln(10)

        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "Cuyos datos son:", ln=True, align='C')
        pdf.ln(10)

        # Roles y nombres
        pdf.set_font("Arial", size=12)
        for fila in datos:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(50, 10, f"{fila[4]}:", align='R')  # Rol en negrita
            pdf.set_font("Arial", size=12)
            pdf.cell(0, 10, f" {fila[3]}", ln=True)  # Nombre asociado

        pdf.ln(10)

        # Fecha de la celebración
        pdf.set_font("Arial", size=14)
        pdf.cell(0, 10, f"Fecha de {str(datos[0][2])}: {fila[8]}", ln=True, align='C')  # nombre_liturgia, fecha

        # Guardar el PDF
        pdf.output(pdf_path)
        return pdf_path

    except Exception as e:
        print(f"Error al generar el PDF: {e}")
        raise

    finally:
        conexion.close()
