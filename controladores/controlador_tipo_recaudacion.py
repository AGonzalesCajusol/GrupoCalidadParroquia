from bd import obtener_conexion

# Función para insertar un nuevo tipo de recaudación
def insertar_tipo_recaudacion(nombre, tipo, estado):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Verificar si el nombre ya existe
            cursor.execute("SELECT COUNT(*) FROM tipo_recaudacion WHERE nombre_recaudacion = %s", (nombre,))
            if cursor.fetchone()[0] > 0:
                return {"success": False, "message": "Este nombre de recaudación ya existe. Por favor, elige otro nombre."}

            # Si no existe, inserta el tipo de recaudación
            cursor.execute("""
                INSERT INTO tipo_recaudacion (nombre_recaudacion, tipo, estado)
                VALUES (%s, %s, %s)
            """, (nombre, tipo, estado))
            conexion.commit()
            return {"success": True, "message": "Tipo de recaudación agregado exitosamente."}
    except Exception as e:
        conexion.rollback()
        print("Error:", e)
        return {"success": False, "message": "Error al insertar el tipo de recaudación."}
    finally:
        conexion.close()
        
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

def verificar_nombre_recaudacion_existe(nombre_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Consulta para contar cuántos registros tienen el mismo nombre de recaudación
            cursor.execute("SELECT COUNT(*) FROM tipo_recaudacion WHERE nombre_recaudacion = %s", (nombre_recaudacion,))
            resultado = cursor.fetchone()[0]
            return resultado > 0  # Retorna True si ya existe, False en caso contrario
    except Exception as e:
        print(f"Error al verificar el nombre de recaudación: {e}")
        return False  # En caso de error, retornar False para evitar problemas en el flujo
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
