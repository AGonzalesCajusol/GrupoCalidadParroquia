from datetime import timedelta
from flask import jsonify
from bd import obtener_conexion
import traceback

def charlas_acto(id_acto):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('''
            SELECT pr.id_programacion, tm.descripcion, pr.fecha, pr.hora_inicio, pr.hora_fin
            FROM programacion_charlas AS pr inner join charlas as ch 
            on pr.id_charla = ch.id_charla inner join tema as tm
            on pr.id_tema = tm.id_tema where ch.id_charla = %s
                ''', (id_acto,))
        charlas = cursor.fetchall()
    conexion.close()
    return charlas 

def obtener_temas_por_acto(acto_id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Consulta SQL con LEFT JOIN para obtener temas junto con la programación, ministro y sede
            query_temas = """
                SELECT 
                    tm.id_tema,
                    tm.descripcion,
                    tm.duracion,
                    tm.orden,
                    COALESCE(pc.hora_inicio, '00:00'),
                    COALESCE(pc.dias_semana, ''),
                    COALESCE(m.nombre_ministro, 'N/A'),
                    COALESCE(s.nombre_sede, 'N/A')
                FROM tema tm
                LEFT JOIN programacion_charlas pc ON tm.id_tema = pc.id_tema
                LEFT JOIN ministro m ON pc.id_ministro = m.id_ministro
                LEFT JOIN sede s ON pc.id_sede = s.id_sede
                WHERE tm.id_actoliturgico = %s
                ORDER BY tm.orden ASC
            """
            cursor.execute(query_temas, (acto_id,))
            temas = cursor.fetchall()

            # Registro de depuración para verificar resultados
            print("Resultados obtenidos de la consulta SQL:")
            for tema in temas:
                print(tema)

            temas_serializable = [
                {
                    "id_tema": tema[0],
                    "descripcion": tema[1],
                    "duracion": str(tema[2]) if tema[2] else "",
                    "orden": tema[3],
                    "hora_inicio": tema[4],
                    "dias_semana": tema[5],
                    "ministro": tema[6],
                    "sede": tema[7]
                }
                for tema in temas
            ]
            
            return jsonify({"success": True, "temas": temas_serializable})

    except Exception as e:
        print(f"Error al obtener los temas: {e}")
        return jsonify({"success": False, "error": str(e)})
    finally:
        conexion.close()

def registrar_programacion(id_tema, hora_inicio, dia_semana, id_ministro, id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO programacion_charlas (id_tema, hora_inicio, dias_semana, id_ministro, id_sede)
                VALUES (%s, %s, %s, %s, %s)
            """, (id_tema, hora_inicio, dia_semana, id_ministro, id_sede))
        conexion.commit()
        return {"success": True, "message": "Programación registrada exitosamente"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al registrar la programación: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conexion.close()

def verificar_programacion(id_acto):
    conexion = obtener_conexion()
    try:
        print(f"Verificando programación para el acto: {id_acto}")
        with conexion.cursor() as cursor:
            # Realizar un JOIN para obtener los nombres del ministro y la sede
            cursor.execute("""
                SELECT 
                    pc.id_programacion,
                    pc.hora_inicio,
                    tm.descripcion,
                    pc.dias_semana,
                    m.nombre_ministro AS ministro,
                    s.nombre_sede AS sede
                FROM programacion_charlas pc
                JOIN tema tm ON pc.id_tema = tm.id_tema
                LEFT JOIN ministro m ON pc.id_ministro = m.id_ministro
                LEFT JOIN sede s ON pc.id_sede = s.id_sede
                WHERE tm.id_actoliturgico = %s
            """, (id_acto,))
            
            resultados = cursor.fetchall()
            print(f"Resultados obtenidos: {resultados}")
            
            if resultados:
                programaciones = []
                for resultado in resultados:
                    # Convertir 'hora_inicio' a 'HH:MM' si es un timedelta
                    hora_inicio = resultado[1]
                    if isinstance(hora_inicio, timedelta):
                        total_seconds = int(hora_inicio.total_seconds())
                        hora_inicio_str = f"{total_seconds // 3600:02}:{(total_seconds % 3600) // 60:02}"
                    else:
                        hora_inicio_str = hora_inicio.strftime('%H:%M') if hora_inicio else None
                    
                    programaciones.append({
                        "id_programacion": resultado[0],
                        "hora_inicio": hora_inicio_str,
                        "descripcion": resultado[2],
                        "dias_semana": resultado[3],
                        "ministro": resultado[4] if resultado[4] else 'N/A',
                        "sede": resultado[5] if resultado[5] else 'N/A'
                    })
                
                print("Programaciones procesadas:", programaciones)
                return {
                    "success": True,
                    "programaciones": programaciones
                }
            else:
                print("No se encontraron resultados")
                return {"success": False, "error": "No hay programación registrada"}
    except Exception as e:
        print("Error al verificar programación:")
        print(traceback.format_exc())
        return {"success": False, "error": str(e)}
    finally:
        conexion.close()

def obtener_ministro_y_sede_por_dni(dni):
    """Función para obtener el id_ministro y id_sede usando el DNI"""
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_ministro, id_sede 
                FROM ministro 
                WHERE numero_documento = %s AND estado = 1
            """, (dni,))
            resultado = cursor.fetchone()
            return resultado if resultado else None
    except Exception as e:
        print(f"Error al obtener datos del ministro y sede: {e}")
        return None
    finally:
        conexion.close()

def obtener_detalle_programacion(id_programacion):
    print(f"Conectando a la base de datos para el ID de programación: {id_programacion}")
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            print("Ejecutando la consulta SQL...")
            cursor.execute("""
                SELECT tm.descripcion, pc.hora_inicio, pc.dias_semana, m.nombre_ministro AS ministro, s.nombre_sede AS sede
                FROM programacion_charlas pc
                JOIN tema tm ON pc.id_tema = tm.id_tema
                JOIN ministro m ON pc.id_ministro = m.id_ministro
                JOIN sede s ON pc.id_sede = s.id_sede
                WHERE pc.id_programacion = %s
            """, (id_programacion,))
            
            resultado = cursor.fetchone()
            print(f"Resultado de la consulta: {resultado}")

            if resultado:
                # Convertir timedelta a 'HH:MM'
                hora_inicio = resultado[1]
                if isinstance(hora_inicio, timedelta):
                    total_seconds = int(hora_inicio.total_seconds())
                    hora_formateada = f"{total_seconds // 3600:02}:{(total_seconds % 3600) // 60:02}"
                else:
                    hora_formateada = hora_inicio.strftime('%H:%M') if hora_inicio else None

                return {
                    "descripcion": resultado[0],
                    "hora_inicio": hora_formateada,
                    "dias_semana": resultado[2],
                    "ministro": resultado[3],
                    "sede": resultado[4]
                }
            else:
                print("No se encontró programación para el ID proporcionado.")
                return {"success": False, "error": "No se encontró la programación"}
    except Exception as e:
        print(f"Error en la consulta a la base de datos: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conexion.close()
        print("Conexión a la base de datos cerrada.")
    
    return None

def listar_ministros_programacion():
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        query = """
            SELECT 
                m.id_ministro, 
                m.nombre_ministro, 
                m.numero_documento, 
                s.nombre_sede 
            FROM ministro m 
            INNER JOIN sede s ON m.id_sede = s.id_sede
            WHERE m.estado = 1;
        """
        cursor.execute(query)
        resultados = cursor.fetchall()

        ministros = [
            {
                "id": row[0],
                "nombre": row[1],
                "documento": row[2],
                "sede": row[3]
            }
            for row in resultados
        ]

        cursor.close()
        conexion.close()
        return jsonify({"success": True, "ministros": ministros})

    except Exception as e:
        print(f"Error al obtener ministros: {e}")
        return jsonify({"success": False, "error": "Error al obtener los ministros"}), 500

def listar_sedes_programacion():    
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        query = """
            SELECT 
                id_sede, 
                nombre_sede, 
                direccion 
            FROM sede
            WHERE estado = 1;
        """
        cursor.execute(query)
        resultados = cursor.fetchall()

        sedes = [
            {
                "id": row[0],
                "nombre": row[1],
                "direccion": row[2]
            }
            for row in resultados
        ]

        cursor.close()
        conexion.close()
        return jsonify({"success": True, "sedes": sedes})

    except Exception as e:
        print(f"Error al obtener sedes: {e}")
        return jsonify({"success": False, "error": "Error al obtener las sedes"}), 500

def actualizar_programacion(id_programacion, hora_inicio, dia_semana, id_ministro, id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:            
            cursor.execute("""
                UPDATE programacion_charlas
                SET hora_inicio = %s, dias_semana = %s, id_ministro = %s, id_sede = %s
                WHERE id_programacion = %s
            """, (hora_inicio, dia_semana, id_ministro, id_sede, id_programacion))
        conexion.commit()
        return {"success": True, "message": "Programación actualizada correctamente"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al actualizar la programación: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conexion.close()

def eliminar_programacion(id_programacion):    
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM programacion_charlas WHERE id_programacion = %s", (id_programacion,))
        conexion.commit()
        return {"success": True, "message": "Programación eliminada correctamente"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al eliminar la programación: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conexion.close()



