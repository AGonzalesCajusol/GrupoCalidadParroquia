from bd import obtener_conexion

def insertar_tipo_recaudacion(nombre_recaudacion, tipo):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Obtener el siguiente id_tipo_recaudacion disponible
            cursor.execute("SELECT COALESCE(MAX(id_tipo_recaudacion) + 1, 1) as siguiente_id FROM tipo_recaudacion")
            siguiente_id = cursor.fetchone()[0]

            # Inserción del nuevo tipo de recaudación
            cursor.execute("""
                INSERT INTO tipo_recaudacion (id_tipo_recaudacion, nombre_recaudacion, tipo) 
                VALUES (%s, %s, %s)
            """, (siguiente_id, nombre_recaudacion, tipo))
        
        # Confirmar la transacción
        conexion.commit()
        return siguiente_id  # Devuelve el ID del nuevo tipo de recaudación insertado
    except Exception as e:
        print(f"Error al insertar tipo de recaudación: {e}")
        conexion.rollback()  # Revertir la transacción en caso de error
        return None
    finally:
        conexion.close()  # Asegurarse de cerrar la conexión

def obtener_tipos_recaudacion():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_tipo_recaudacion, nombre_recaudacion, tipo 
                FROM tipo_recaudacion
            """)
            tipos_recaudacion = cursor.fetchall()
        return tipos_recaudacion
    except Exception as e:
        print(f"Error al obtener tipos de recaudación: {e}")
        return []
    finally:
        conexion.close()

def obtener_tipo_recaudacion_por_id(id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_tipo_recaudacion, nombre_recaudacion, tipo 
                FROM tipo_recaudacion 
                WHERE id_tipo_recaudacion = %s
            """, (id_tipo_recaudacion,))
            tipo_recaudacion = cursor.fetchone()
        return tipo_recaudacion
    except Exception as e:
        print(f"Error al obtener tipo de recaudación por id: {e}")
        return None
    finally:
        conexion.close()

def actualizar_tipo_recaudacion(nombre_recaudacion, tipo, id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE tipo_recaudacion 
                SET nombre_recaudacion = %s, tipo = %s 
                WHERE id_tipo_recaudacion = %s
            """, (nombre_recaudacion, tipo, id_tipo_recaudacion))
        conexion.commit()
    except Exception as e:
        print(f"Error al actualizar tipo de recaudación: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def eliminar_tipo_recaudacion(id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM tipo_recaudacion WHERE id_tipo_recaudacion = %s", (id_tipo_recaudacion,))
        conexion.commit()
    except Exception as e:
        print(f"Error al eliminar tipo de recaudación: {e}")
        conexion.rollback()
    finally:
        conexion.close()
