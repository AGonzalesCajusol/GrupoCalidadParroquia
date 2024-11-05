from bd import obtener_conexion
from datetime import timedelta

def obtener_todos_los_temas():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT t.id_tema, t.descripcion, a.nombre_liturgia, t.dias_semana, t.hora_inicio, t.duracion, t.orden   
                FROM tema t
                INNER JOIN actoliturgico a ON t.id_actoliturgico = a.id_actoliturgico
            """)
            temas = cursor.fetchall()        
        temas_formateados = [
            {
                "id_tema": tema[0],
                "descripcion": tema[1],
                "nombre_actoliturgico": tema[2],
                "dias_semana": tema[3],
                "hora_inicio": str(tema[4]), 
                "duracion": str(tema[5]),  
                "orden": tema[6]
            }
            for tema in temas
        ]
        return temas_formateados
    except Exception as e:
        print(f"Error al obtener temas: {e}")
        return []
    finally:
        conexion.close()

def insertar_tema(descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO tema (descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al insertar tema: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def obtener_tema_por_id(id_tema):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_tema, descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden
                FROM tema
                WHERE id_tema = %s
            """, (id_tema,))
            tema = cursor.fetchone()
        if tema:
            return {
                "id_tema": tema[0],
                "descripcion": tema[1],
                "id_actoliturgico": tema[2],
                "dias_semana": tema[3],
                "hora_inicio": str(tema[4]),
                "duracion": str(tema[5]),
                "orden": tema[6]
            }
        return None
    except Exception as e:
        print(f"Error al obtener tema por ID: {e}")
        return None
    finally:
        conexion.close()

def actualizar_tema(id_tema, descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE tema
                SET descripcion = %s, id_actoliturgico = %s, dias_semana = %s, hora_inicio = %s, duracion = %s, orden = %s
                WHERE id_tema = %s
            """, (descripcion, id_actoliturgico, dias_semana, hora_inicio, duracion, orden, id_tema))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al actualizar tema: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def eliminar_tema_por_id(id_tema):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM tema WHERE id_tema = %s", (id_tema,))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al eliminar el tema: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()


def obtener_temas_por_acto(acto):
    conexion = obtener_conexion()
    temas = []
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT t.id_tema, t.descripcion, t.id_actoliturgico 
                FROM tema t INNER JOIN actoliturgico al ON al.id_actoliturgico = t.id_actoliturgico
                WHERE al.id_actoliturgico = %s
            """, (acto,))
            temas = cursor.fetchall()
        
        # Formatear los resultados como una lista de diccionarios
        temas_formateados = [{"id_tema": tema[0], "descripcion": tema[1], "id_actoliturgico": tema[2]} for tema in temas]        
        return temas_formateados

    except Exception as e:
        print(f"Error al obtener temas por acto: {e}")
        return None

    finally:
        conexion.close()


def obtener_programacion_por_acto_y_charla(acto_id, charla_id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    p.id_programacion, 
                    t.descripcion, 
                    p.fecha, 
                    p.hora_inicio, 
                    p.hora_fin, 
                    p.estado, 
                    m.nombre_ministro AS nombre_ministro, 
                    s.nombre_sede AS nombre_sede
                FROM 
                    programacion_charlas p
                JOIN 
                    tema t ON p.id_tema = t.id_tema
                LEFT JOIN 
                    ministro m ON p.id_ministro = m.id_ministro
                LEFT JOIN 
                    sede s ON p.id_sede = s.id_sede
                WHERE 
                    p.id_charla = %s AND 
                    p.id_charla IN (
                        SELECT id_charla 
                        FROM charlas 
                        WHERE id_actoliturgico = %s
                    )
            ''', (charla_id, acto_id))
            programaciones = cursor.fetchall()
            
            programaciones_serializables = []
            for programacion in programaciones:
                programacion = list(programacion)
                programacion[3] = str(programacion[3])  # Convertir hora_inicio a string
                programacion[4] = str(programacion[4])  # Convertir hora_fin a string
                programacion[2] = str(programacion[2])  # Convertir fecha a string
                programaciones_serializables.append(programacion)
            
            return programaciones_serializables
    except Exception as e:
        print(f"Error al obtener la programación de charlas: {e}")
        return []
    finally:
        conexion.close()


    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                SELECT id_tema, descripcion
                FROM tema
                WHERE id_actoliturgico = %s
            """
            cursor.execute(query, (id_actoliturgico,))
            temas = cursor.fetchall()  # Esto devuelve una lista de tuplas
            temas_dict = [{"id_tema": tema[0], "descripcion": tema[1]} for tema in temas]  # Convertir a diccionarios para facilitar el uso en el frontend
            return temas_dict

    except Exception as e:
        print(f"Error al obtener los temas: {e}")
        return []
    finally:
        conexion.close()