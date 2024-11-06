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
            "select ds.id_diosesis ,ds.nombre_diosesis, dp.nombre_departamento, pr.nombre_provincia from diosesis ds inner join departamento dp on ds.id_departamento = dp.id_departamento inner join provincia pr on ds.id_provincia = pr.id_provincia"
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

def obtener_id_departamento_por_nombre(nombre_departamento):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                "SELECT id_departamento FROM departamento WHERE nombre_departamento = %s",
                (nombre_departamento,)
            )
            resultado = cursor.fetchone()
            return resultado[0] if resultado else None
    finally:
        conexion.close()

def obtener_id_provincia_por_nombre(nombre_provincia):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                "SELECT id_provincia FROM provincia WHERE nombre_provincia = %s",
                (nombre_provincia,)
            )
            resultado = cursor.fetchone()
            return resultado[0] if resultado else None
    finally:
        conexion.close()
