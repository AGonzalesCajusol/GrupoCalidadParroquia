from bd import obtener_conexion

def insertar_diocesis(nombre, id_departamento, id_provincia):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            "INSERT INTO diosesis (nombre_diosesis, id_departamento, id_provincia) VALUES (%s, %s, %s)",
            (nombre, id_departamento, id_provincia)
        )
    conexion.commit()
    conexion.close()

def obtener_diocesis():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT id_diosesis, nombre_diosesis, id_departamento, id_provincia FROM diosesis"
        )
        diosesis = cursor.fetchall()
    conexion.close()
    return diosesis

def obtener_departamento():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT id_departamento, nombre_departamento FROM departamento"
        )
        diosesis = cursor.fetchall()
    conexion.close()
    return diosesis

def obtener_provincia():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT id_provincia, nombre_provincia, id_departamento FROM provincia"
        )
        diosesis = cursor.fetchall()
    conexion.close()
    return diosesis

def obtener_diocesis_por_id(id):
    conexion = obtener_conexion()
    diosesis = None
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT id_diosesis, nombre_diosesis, id_departamento, id_provincia FROM diosesis WHERE id_diosesis = %s",
            (id,)
        )
        diosesis = cursor.fetchone()
    conexion.close()
    return diosesis

def actualizar_diocesis(nombre, id_departamento, id_provincia, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute(
            "UPDATE diosesis SET nombre_diosesis = %s, id_departamento = %s, id_provincia = %s WHERE id_diosesis = %s",
            (nombre, id_departamento, id_provincia, id)
        )
    conexion.commit()
    conexion.close()

def eliminar_diocesis(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM diosesis WHERE id_diosesis = %s", (id,))
    conexion.commit()
    conexion.close()
