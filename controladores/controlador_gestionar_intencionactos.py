from flask import request, jsonify
from bd import obtener_conexion



# Función para insertar una nueva intención
def insertar_intencion(nombre_intencion, descripcion, id_actoliturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Insertar la nueva intención en la base de datos
            cursor.execute("""
                INSERT INTO intencion (nombre_intencion, descripcion, id_actoliturgico)
                VALUES (%s, %s, %s)
            """, (nombre_intencion, descripcion, id_actoliturgico))
        
        # Confirmar los cambios en la base de datos
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al insertar intención: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

# Función para obtener todas las intenciones
def obtener_intenciones():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT i.id_intencion, i.nombre_intencion, i.descripcion, a.nombre_liturgia
                FROM intencion i
                JOIN actoliturgico a ON i.id_actoliturgico = a.id_actoliturgico
            """)
            intenciones = cursor.fetchall()
        return intenciones
    except Exception as e:
        print(f"Error al obtener intenciones: {e}")
        return []
    finally:
        conexion.close()

# Función para obtener una intención por su ID
def obtener_intencion_por_id(id_intencion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_intencion, nombre_intencion, descripcion, id_actoliturgico
                FROM intencion
                WHERE id_intencion = %s
            """, (id_intencion,))
            intencion = cursor.fetchone()
        return intencion
    except Exception as e:
        print(f"Error al obtener intención por ID: {e}")
        return None
    finally:
        conexion.close()

# Función para actualizar una intención
def actualizar_intencion(id_intencion, nombre_intencion, descripcion, id_actoliturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE intencion
                SET nombre_intencion = %s, descripcion = %s, id_actoliturgico = %s
                WHERE id_intencion = %s
            """, (nombre_intencion, descripcion, id_actoliturgico, id_intencion))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al actualizar intención: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

# Función para eliminar una intención por su ID
def eliminar_intencion(id_intencion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM intencion WHERE id_intencion = %s", (id_intencion,))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al eliminar intención: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

# Función para obtener los actos litúrgicos (para el combo de selección)
def obtener_actos_liturgicos():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT id_actoliturgico, nombre_liturgia FROM actoliturgico WHERE estado = 'A'")
            actos_liturgicos = cursor.fetchall()
        return actos_liturgicos
    except Exception as e:
        print(f"Error al obtener actos litúrgicos: {e}")
        return []
    finally:
        conexion.close()
