from bd import obtener_conexion

def insertar_congregacion(nombre):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO congregacion(nombre_congregacion) VALUES (%s)", (nombre,))
    conexion.commit()
    conexion.close()

def obtener_congregacion():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_congregacion, nombre_congregacion FROM congregacion")
        congregacion = cursor.fetchall()
    conexion.close()
    return congregacion

def obtener_congregacion_por_id(id):
    conexion = obtener_conexion()
    congregacion = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_congregacion, nombre_congregacion FROM congregacion WHERE id_congregacion = %s", (id,))
        congregacion = cursor.fetchone()
    conexion.close()
    return congregacion

def actualizar_congregacion(nombre, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE congregacion SET nombre_congregacion = %s WHERE id_congregacion = %s", (nombre, id))
    conexion.commit()
    conexion.close()

def eliminar_congregacion(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM congregacion WHERE id_congregacion = %s", (id,))
    conexion.commit()
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