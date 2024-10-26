from bd import obtener_conexion

# Función para insertar un nuevo tipo de recaudación
def insertar_tipo_recaudacion(nombre_recaudacion, tipo, estado=True):  # El estado por defecto es 'Activo'
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Obtener el siguiente id_tipo_recaudacion disponible
            cursor.execute("SELECT COALESCE(MAX(id_tipo_recaudacion) + 1, 1) as siguiente_id FROM tipo_recaudacion")
            siguiente_id = cursor.fetchone()[0]

            # Inserción del nuevo tipo de recaudación con estado
            cursor.execute("""
                INSERT INTO tipo_recaudacion (id_tipo_recaudacion, nombre_recaudacion, tipo, estado) 
                VALUES (%s, %s, %s, %s)
            """, (siguiente_id, nombre_recaudacion, tipo, estado))
        
        # Confirmar la transacción
        conexion.commit()
        return siguiente_id  # Devuelve el ID del nuevo tipo de recaudación insertado
    except Exception as e:
        print(f"Error al insertar tipo de recaudación: {e}")
        conexion.rollback()  # Revertir la transacción en caso de error
        return None
    finally:
        conexion.close()  # Asegurarse de cerrar la conexión

# Función para obtener todos los tipos de recaudación
def obtener_tipos_recaudacion():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_tipo_recaudacion, nombre_recaudacion, tipo, estado 
                FROM tipo_recaudacion
            """)
            tipos_recaudacion = cursor.fetchall()
        return tipos_recaudacion
    except Exception as e:
        print(f"Error al obtener tipos de recaudación: {e}")
        return []
    finally:
        conexion.close()

# Función para obtener un tipo de recaudación por su ID
def obtener_tipo_recaudacion_por_id(id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_tipo_recaudacion, nombre_recaudacion, tipo, estado 
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

# Función para actualizar un tipo de recaudación
def actualizar_tipo_recaudacion(nombre_recaudacion, tipo, estado, id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE tipo_recaudacion 
                SET nombre_recaudacion = %s, tipo = %s, estado = %s
                WHERE id_tipo_recaudacion = %s
            """, (nombre_recaudacion, tipo, estado, id_tipo_recaudacion))
        conexion.commit()
    except Exception as e:
        print(f"Error al actualizar tipo de recaudación: {e}")
        conexion.rollback()
    finally:
        conexion.close()

# Función para eliminar un tipo de recaudación
def eliminar_tipo_recaudacion(id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Verificar si existen registros en recaudacion que usen este tipo de recaudación
            cursor.execute("SELECT COUNT(*) FROM recaudacion WHERE id_tipo_recaudacion = %s", (id_tipo_recaudacion,))
            count = cursor.fetchone()[0]
            
            if count > 0:
                # Retorna un mensaje específico si existen relaciones
                return "No se puede eliminar este tipo de recaudación porque está asociado con registros existentes."
            
            # Proceder con la eliminación si no existen relaciones
            cursor.execute("DELETE FROM tipo_recaudacion WHERE id_tipo_recaudacion = %s", (id_tipo_recaudacion,))
        conexion.commit()
    except Exception as e:
        print(f"Error al eliminar tipo de recaudación: {e}")
        conexion.rollback()
        return f"Error al eliminar tipo de recaudación: {e}"
    finally:
        conexion.close()
    
    return None 

# Función para dar de baja un tipo de recaudación (cambiar estado a "Inactivo")
def dar_baja_tipo_recaudacion(id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Cambiar el estado a inactivo (0)
            cursor.execute("""
                UPDATE tipo_recaudacion 
                SET estado = %s
                WHERE id_tipo_recaudacion = %s
            """, (False, id_tipo_recaudacion))  # False representa inactivo
        conexion.commit()
    except Exception as e:
        print(f"Error al dar de baja el tipo de recaudación: {e}")
        conexion.rollback()
    finally:
        conexion.close()
