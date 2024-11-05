from bd import obtener_conexion

# Función para insertar una nueva charla
def insertar_charla(estado, id_actoliturgico, fecha_inicio):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                INSERT INTO charlas (estado, id_actoliturgico, fecha_inicio) 
                VALUES (%s, %s, %s)
            ''', (estado, id_actoliturgico, fecha_inicio))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al insertar charla: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

# Función para obtener todas las charlas
def obtener_charlas():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT ch.id_charla, ch.estado, ch.fecha_inicio, al.nombre_liturgia, al.id_actoliturgico
                FROM charlas AS ch
                INNER JOIN actoliturgico AS al ON ch.id_actoliturgico = al.id_actoliturgico
            ''')
            charlas = cursor.fetchall()
        return charlas
    except Exception as e:
        print(f"Error al obtener las charlas: {e}")
        return []
    finally:
        conexion.close()


# Función para obtener una charla específica por su ID
def obtener_charla_por_id(id_charla):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT ch.id_charla, ch.estado, ch.fecha_inicio, al.nombre_liturgia, al.id_actoliturgico 
                FROM charlas AS ch
                INNER JOIN actoliturgico AS al ON ch.id_actoliturgico = al.id_actoliturgico
                WHERE ch.id_charla = %s
            ''', (id_charla,))
            charla = cursor.fetchone()
        return charla
    except Exception as e:
        print(f"Error al obtener la charla: {e}")
        return None
    finally:
        conexion.close()

# Función para actualizar una charla
def actualizar_charla(id_charla, estado, id_actoliturgico, fecha_inicio):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                UPDATE charlas 
                SET estado = %s, id_actoliturgico = %s, fecha_inicio = %s 
                WHERE id_charla = %s
            ''', (estado, id_actoliturgico, fecha_inicio, id_charla))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al actualizar la charla: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

# Función para eliminar una charla por su ID
def eliminar_charla(id_charla):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                DELETE FROM charlas WHERE id_charla = %s
            ''', (id_charla,))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al eliminar la charla: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

