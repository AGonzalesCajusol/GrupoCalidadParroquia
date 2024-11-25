from flask import jsonify
from bd import obtener_conexion
from datetime import timedelta

def obtener_todos_los_temas():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT t.id_tema, a.nombre_liturgia, t.descripcion, t.duracion, t.orden   
                FROM tema t
                INNER JOIN actoliturgico a ON t.id_actoliturgico = a.id_actoliturgico
            """)
            temas = cursor.fetchall()        
        temas_formateados = [
            {
                "id_tema": tema[0],
                "nombre_actoliturgico": tema[1],
                "descripcion": tema[2],                                
                "duracion": str(tema[3]),  
                "orden": tema[4]
            }
            for tema in temas
        ]
        return temas_formateados
    except Exception as e:
        print(f"Error al obtener temas: {e}")
        return []
    finally:
        conexion.close()

def insertar_tema(id_actoliturgico, descripcion, duracion, orden):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO tema (id_actoliturgico, descripcion, duracion, orden)
                VALUES (%s, %s, %s, %s)
            """, (id_actoliturgico, descripcion, duracion, orden))
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
                SELECT id_tema, id_actoliturgico, descripcion, duracion, orden
                FROM tema
                WHERE id_tema = %s
            """, (id_tema,))
            tema = cursor.fetchone()
        if tema:
            return {
                "id_tema": tema[0],
                "id_actoliturgico": tema[1],
                "descripcion": tema[2],                                
                "duracion": str(tema[3]),
                "orden": tema[4]
            }
        return None
    except Exception as e:
        print(f"Error al obtener tema por ID: {e}")
        return None
    finally:
        conexion.close()

def actualizar_tema(id_tema, id_actoliturgico, descripcion, duracion, orden):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE tema
                SET id_actoliturgico = %s, descripcion = %s, duracion = %s, orden = %s
                WHERE id_tema = %s
            """, (id_actoliturgico, descripcion, duracion, orden, id_tema))
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
        return {"success": True, "message": "El tema fue eliminado correctamente"}
    except Exception as e:
        print(f"Error al eliminar el tema: {e}") 
        
        if "1451" in str(e): 
            return {
                "success": False,
                "message": "No se puede eliminar el tema porque tiene registros asociados"
            }
        else:
            return {
                "success": False,
                "message": "Ha ocurrido un error inesperado al intentar eliminar el tema"
            }
    finally:
        conexion.close()

def obtener_temas_por_acto(acto):
    conexion = obtener_conexion()
    temas = []
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT t.id_tema, t.id_actoliturgico, t.descripcion 
                FROM tema t INNER JOIN actoliturgico al ON al.id_actoliturgico = t.id_actoliturgico
                WHERE al.id_actoliturgico = %s
            """, (acto,))
            temas = cursor.fetchall()
                
        temas_formateados = [{"id_tema": tema[0], "id_actoliturgico": tema[1], "descripcion": tema[2]} for tema in temas]        
        return temas_formateados

    except Exception as e:
        print(f"Error al obtener temas por acto: {e}")
        return None

    finally:
        conexion.close()