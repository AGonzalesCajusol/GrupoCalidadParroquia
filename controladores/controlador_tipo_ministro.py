from bd import obtener_conexion

def insertar_tipo_ministro(nombre):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        # Obtener el siguiente id_tipoministro disponible
        cursor.execute("SELECT COALESCE(MAX(id_tipoministro) + 1, 1) as siguiente_id FROM tipo_ministro")
        siguiente_id = cursor.fetchone()[0]

        # Insertar el nuevo tipo de ministro con el ID calculado
        cursor.execute("INSERT INTO tipo_ministro(id_tipoministro, tipo_ministro) VALUES (%s, %s)", (siguiente_id, nombre))

    conexion.commit()
    conexion.close()


def obtener_tipos_ministro():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_tipoministro, tipo_ministro FROM tipo_ministro")
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

def actualizar_tipo_ministro(nombre, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE tipo_ministro SET tipo_ministro = %s WHERE id_tipoministro = %s", (nombre, id))
    conexion.commit()
    conexion.close()

def eliminar_tipo_ministro(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM tipo_ministro WHERE id_tipoministro = %s", (id,))
    conexion.commit()
    conexion.close()
