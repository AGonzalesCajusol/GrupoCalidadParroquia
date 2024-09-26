from bd import obtener_conexion

def insertar_cargo(nombre):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        # Obtener el siguiente id_cargo disponible
        cursor.execute("SELECT COALESCE(MAX(id_cargo) + 1, 1) as siguiente_id FROM cargo")
        siguiente_id = cursor.fetchone()[0]

        # Insertar el nuevo cargo con el ID calculado
        cursor.execute("INSERT INTO cargo(id_cargo, cargo) VALUES (%s, %s)", (siguiente_id, nombre))

    conexion.commit()
    conexion.close()


def obtener_cargo():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_cargo, cargo FROM cargo")
        cargos = cursor.fetchall()
    conexion.close()
    return cargos

def obtener_cargo_por_id(id):
    conexion = obtener_conexion()
    cargo = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_cargo, cargo FROM cargo WHERE id_cargo = %s", (id,))
        cargo = cursor.fetchone()
    conexion.close()
    return cargo

def actualizar_cargo(nombre, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE cargo SET cargo = %s WHERE id_cargo = %s", (nombre, id))
    conexion.commit()
    conexion.close()

def eliminar_cargo(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM cargo WHERE id_cargo = %s", (id,))
    conexion.commit()
    conexion.close()


def obtener_id_cargo_por_nombre(nombre):
        conexion = obtener_conexion()
        id_cargo = None
        with conexion.cursor() as cursor:
            cursor.execute("select id_cargo from cargo WHERE cargo = %s", (nombre,))
            resultado = cursor.fetchone()
            if resultado:
                id_cargo = resultado[0]
        conexion.close()
        return id_cargo