from bd import obtener_conexion

def insertar_tipo_ministro(nombre, estado=1): 
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT COALESCE(MAX(id_tipoministro) + 1, 1) as siguiente_id FROM tipo_ministro")
        siguiente_id = cursor.fetchone()[0]

        cursor.execute(
            "INSERT INTO tipo_ministro(id_tipoministro, tipo_ministro, estado) VALUES (%s, %s, %s)",
            (siguiente_id, nombre, estado)
        )

    conexion.commit()
    conexion.close()



def obtener_tipos_ministro():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_tipoministro, tipo_ministro, estado FROM tipo_ministro")
        tipos_ministro = cursor.fetchall()
    conexion.close()
    return tipos_ministro

def obtener_tipo_ministro_por_id(id):
    conexion = obtener_conexion()
    tipo_ministro = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_tipoministro, tipo_ministro FROM tipo_ministro WHERE id_tipoministro = %s", (id,))
        tipo_ministro = cursor.fetchone()
    conexion.close()
    return tipo_ministro

def actualizar_tipo_ministro(nombre, estado, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            "UPDATE tipo_ministro SET tipo_ministro = %s, estado = %s WHERE id_tipoministro = %s",
            (nombre, estado, id)
        )
    conexion.commit()
    conexion.close()


def eliminar_tipo_ministro(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM tipo_ministro WHERE id_tipoministro = %s", (id,))
    conexion.commit()
    conexion.close()


def cambiar_estado_tipo_ministro(id_tipoministro, nuevo_estado):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Actualizar el estado del tipo de ministro
            cursor.execute("""
                UPDATE tipo_ministro 
                SET estado = %s 
                WHERE id_tipoministro = %s
            """, (nuevo_estado, id_tipoministro))
        conexion.commit()
        return True, "El estado del tipo de ministro fue actualizado exitosamente."
    except Exception as e:
        conexion.rollback()
        print(f"Error al cambiar el estado del tipo de ministro: {e}")
        return False, f"Error: {str(e)}"
    finally:
        conexion.close()


def obtener_id_tipoMinistro_por_nombre(nombre):
        conexion = obtener_conexion()
        id_tipoministro = None
        with conexion.cursor() as cursor:
            cursor.execute("select id_tipoministro from tipo_ministro WHERE tipo_ministro = %s", (nombre,))
            resultado = cursor.fetchone()
            if resultado:
                id_tipoministro = resultado[0]
        conexion.close()
        return id_tipoministro
