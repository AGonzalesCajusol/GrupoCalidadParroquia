from bd import obtener_conexion

def insertar_tema(descripcion, id_actoliturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO Tema (descripcion, id_actoliturgico)
                VALUES (%s, %s)
            """, (descripcion, id_actoliturgico))
        conexion.commit()
    except Exception as e:
        print(f"Error al insertar tema: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def obtener_temas():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT t.id_tema, t.descripcion, a.nombre_liturgia 
                FROM Tema t
                INNER JOIN ActoLiturgico a ON t.id_actoliturgico = a.id_actoliturgico
            """)
            temas = cursor.fetchall()
        return temas
    except Exception as e:
        print(f"Error al obtener temas: {e}")
        return []
    finally:
        conexion.close()

def obtener_tema_por_id(id_tema):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_tema, descripcion, id_actoliturgico 
                FROM Tema 
                WHERE id_tema = %s
            """, (id_tema,))
            tema = cursor.fetchone()
        return tema
    except Exception as e:
        print(f"Error al obtener tema por id: {e}")
        return None
    finally:
        conexion.close()

def actualizar_tema(descripcion, id_actoliturgico, id_tema):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE Tema 
                SET descripcion = %s, id_actoliturgico = %s 
                WHERE id_tema = %s
            """, (descripcion, id_actoliturgico, id_tema))
        conexion.commit()
    except Exception as e:
        print(f"Error al actualizar tema: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def eliminar_tema(id_tema):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM Tema WHERE id_tema = %s", (id_tema,))
        conexion.commit()
    except Exception as e:
        print(f"Error al eliminar tema: {e}")
        conexion.rollback()
    finally:
        conexion.close()
