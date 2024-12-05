from fpdf import FPDF
import os
from bd import obtener_conexion  # Importa tu función de conexión a la base de datos.
from datetime import datetime

def calcular_edad(fecha_nacimiento, fecha_actual):
    fecha_nac = datetime.strptime(fecha_nacimiento, '%Y-%m-%d')
    fecha_act = datetime.strptime(fecha_actual, '%Y-%m-%d')
    edad = fecha_act.year - fecha_nac.year
    if (fecha_act.month, fecha_act.day) < (fecha_nac.month, fecha_nac.day):
        edad -= 1
    return edad

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

def generar_acta_matrimonio_pdf(datos):
    conexion = obtener_conexion()
    try:
        # 1. Registrar novios como feligreses si no existen
        with conexion.cursor() as cursor:
            cursor.execute("SELECT dni FROM feligres WHERE dni = %s", (datos['dni_novio'],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO feligres 
                    (dni, nombres, apellidos, fecha_nacimiento, estado_civil, sexo, id_sede, correo)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (datos['dni_novio'], '', '', datos['fecha_nacimiento_novio'], 
                      'S', 'M', 1, ''))

            cursor.execute("SELECT dni FROM feligres WHERE dni = %s", (datos['dni_novia'],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO feligres 
                    (dni, nombres, apellidos, fecha_nacimiento, estado_civil, sexo, id_sede, correo)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (datos['dni_novia'], '', '', datos['fecha_nacimiento_novia'], 
                      'S', 'F', 1, ''))

            # 2. Registrar la celebración
            cursor.execute("""
                INSERT INTO celebracion 
                (id_actoliturgico, id_sede, fecha, hora_inicio, hora_fin, estado)
                VALUES (%s, %s, %s, '08:00:00', '09:00:00', 'P')
            """, (1, 1, datos['fecha_matrimonio']))
            
            id_celebracion = cursor.lastrowid
            
            # 3. Registrar la solicitud
            cursor.execute("""
                INSERT INTO solicitud 
                (id_actoliturgico, id_sede, estado, id_celebracion, monto_total, fecha_registro)
                VALUES (%s, %s, %s, %s, %s, CURRENT_DATE())
            """, (1, 1, 'P', id_celebracion, 10))
            
            id_solicitud = cursor.lastrowid
            
            # 4. Registrar solicitud_feligres para novio y novia
            cursor.execute("""
                INSERT INTO solicitud_feligres (dni_feligres, id_solicitud, rol)
                VALUES (%s, %s, 'Novio')
            """, (datos['dni_novio'], id_solicitud))
            
            cursor.execute("""
                INSERT INTO solicitud_feligres (dni_feligres, id_solicitud, rol)
                VALUES (%s, %s, 'Novia')
            """, (datos['dni_novia'], id_solicitud))
            
            # 5. Registrar el certificado
            cursor.execute("""
                INSERT INTO certificado 
                (id_solicitud)
                VALUES (%s)
            """, (id_solicitud,))
            
            conexion.commit()
            
            # 6. Generar el PDF con estilo
            os.makedirs("static/actas", exist_ok=True)
            pdf_path = f"static/actas/acta_matrimonio_{datos['dni_novio']}_{datos['dni_novia']}.pdf"
            
            pdf = FPDF()
            pdf.add_page()
            
            # Agregar imagen en la esquina superior izquierda
            try:
                pdf.image('static/img/Diosesis.png', x=10, y=10, w=30)
            except Exception as e:
                print(f"Error al cargar la imagen: {e}")

            # Título principal
            pdf.set_font("Arial", "B", 16)
            pdf.cell(0, 10, "DIÓCESIS DE CHICLAYO", ln=True, align='C')
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, "PARROQUIA SANTA MARIA CATEDRAL", ln=True, align='C')
            pdf.set_font("Arial", "B", 16)
            pdf.cell(0, 15, "ACTA DE MATRIMONIO", ln=True, align='C')
            
            # Texto introductorio
            pdf.set_font("Arial", "", 12)
            pdf.multi_cell(0, 10, 
                f"Por la presente se CERTIFICA que en el Archivo de la Parroquia SANTA MARIA CATEDRAL "
                f"se encuentra una partida en el libro de Matrimonio N° {datos['libro']} "
                f"Folio {datos['folio']} Partida {datos['partida']} cuyos datos son:", 
                align='J')
            pdf.ln(5)
            
            # Datos del matrimonio
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Nombre del esposo:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"{datos['nombre_novio']} (DNI: {datos['dni_novio']})", ln=True)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Edad:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"{calcular_edad(datos['fecha_nacimiento_novio'], datos['fecha_matrimonio'])} años", ln=True)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Nombre de la esposa:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"{datos['nombre_novia']} (DNI: {datos['dni_novia']})", ln=True)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Edad:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"{calcular_edad(datos['fecha_nacimiento_novia'], datos['fecha_matrimonio'])} años", ln=True)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Fecha del matrimonio:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, datos['fecha_matrimonio'], ln=True)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Padres del esposo:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"{datos['padre_novio']} y {datos['madre_novio']}", ln=True)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Padres de la esposa:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"{datos['padre_novia']} y {datos['madre_novia']}", ln=True)
            
            # Padrinos y testigos (ahora con los datos ingresados)
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Padrino:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, datos['nombre_padrino'], ln=True)
            
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Testigos:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"1. {datos['nombre_testigo1']}", ln=True)
            pdf.cell(60, 8, "", 0)
            pdf.cell(0, 8, f"2. {datos['nombre_testigo2']}", ln=True)
            
            # Obtener el nombre del sacerdote usando su ID
            with conexion.cursor() as cursor:
                cursor.execute("""
                    SELECT nombre_ministro
                    FROM ministro 
                    WHERE id_ministro = %s
                """, (datos['id_ministro'],))
                nombre_sacerdote = cursor.fetchone()[0]
            
            # Sacerdote (ahora usando el nombre en lugar del ID)
            pdf.set_font("Arial", "B", 12)
            pdf.cell(60, 8, "Sacerdote:", 0)
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, nombre_sacerdote, ln=True)
            
            # Nota marginal
            if datos['nota_marginal']:
                pdf.ln(5)
                pdf.set_font("Arial", "B", 12)
                pdf.cell(60, 8, "Nota marginal:", 0)
                pdf.set_font("Arial", "", 12)
                pdf.multi_cell(0, 8, datos['nota_marginal'])
            
            # Fecha de emisión y firma
            pdf.ln(20)
            pdf.set_font("Arial", "", 12)
            from datetime import datetime
            fecha_actual = datetime.now().strftime("%d de %B del %Y")
            pdf.cell(0, 10, f"Chiclayo, {fecha_actual}", ln=True, align='R')
            
            # Espacio para firma
            pdf.ln(30)
            pdf.line(70, pdf.get_y(), 140, pdf.get_y())
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 10, "Párroco", ln=True, align='C')
            
            pdf.output(pdf_path)
            return pdf_path
            
    except Exception as e:
        conexion.rollback()
        print(f"Error al registrar los datos: {e}")
        raise Exception(f"Error al registrar los datos: {str(e)}")
    finally:
        conexion.close()
