from bd import obtener_conexion

def insertar_congregacion(nombre):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                           INSERT INTO congregacion(nombre_congregacion) 
                           VALUES (%s)
                           ''', (nombre,))
        conexion.commit()
    except Exception as e:
        print(f"Error: {e}")
        conexion.rollback()
        return None
    finally:
        conexion.close()

def obtener_congregacion():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_congregacion, nombre_congregacion, estado FROM congregacion")
        congregacion = cursor.fetchall()
    conexion.close()
    return congregacion

def obtener_congregacion_por_id(id):
    conexion = obtener_conexion()
    congregacion = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_congregacion, nombre_congregacion, estado FROM congregacion WHERE id_congregacion = %s", (id,))
        congregacion = cursor.fetchone()
    conexion.close()
    return congregacion

def actualizar_congregacion(nombre,estado, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE congregacion SET nombre_congregacion = %s, estado = %s WHERE id_congregacion = %s", (nombre,estado, id))
    conexion.commit()
    conexion.close()

def eliminar_congregacion(id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Verificar si el id_sede está en uso en las diferentes tablas
            tablas_a_verificar = [
                ("sede", "id_congregacion")
            ]

            # Revisar cada tabla para ver si existe una referencia
            for tabla, columna in tablas_a_verificar:
                cursor.execute(f"SELECT COUNT(*) FROM {tabla} WHERE {columna} = %s", (id,))
                en_uso = cursor.fetchone()[0]
                if en_uso > 0:
                    mensaje_error = f"No se puede eliminar la congregación porque está en uso en la tabla '{tabla}'."
                    print(mensaje_error)
                    return {"success": False, "message": mensaje_error}
            
            # Si no hay dependencias, proceder con la eliminación
            cursor.execute("DELETE FROM congregacion WHERE id_congregacion = %s", (id,))
        conexion.commit()
        return {"success": True, "message": "Congregación eliminada correctamente."}
    except Exception as e:
        print(f"Error al eliminar la congregación: {e}")
        conexion.rollback()
        return {"success": False, "message": "Error al intentar eliminar la congregación."}
    finally:
        conexion.close()

def obtener_id_congregacion_por_nombre(nombre):
        conexion = obtener_conexion()
        id_congregacion = None
        with conexion.cursor() as cursor:
            cursor.execute("select id_congregacion from congregacion WHERE nombre_congregacion = %s", (nombre,))
            resultado = cursor.fetchone()
            if resultado:
                id_congregacion = resultado[0]
        conexion.close()
        return id_congregacion

def obtener_id_diosesis_por_nombre(nombre):
        conexion = obtener_conexion()
        id_diosesis = None
        with conexion.cursor() as cursor:
            cursor.execute("select id_diosesis from diosesis WHERE nombre_diosesis = %s", (nombre,))
            resultado = cursor.fetchone()
            if resultado:
                id_diosesis = resultado[0]
        conexion.close()
        return id_diosesis

def darBaja_congregacion(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE congregacion set estado = %s WHERE id_congregacion = %s", (0,id,))
    conexion.commit()
    conexion.close()