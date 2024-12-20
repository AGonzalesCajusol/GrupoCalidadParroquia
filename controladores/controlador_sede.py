from bd import obtener_conexion

def insertar_sede(nombre,direccion,creacion,telefono,correo,congregacion,diosesis):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO sede(nombre_sede,direccion,creacion,telefono,correo,id_congregacion,id_diosesis) VALUES (%s,%s,%s,%s,%s,%s,%s)", (nombre,direccion,creacion,telefono,correo,congregacion,diosesis))
    conexion.commit()
    conexion.close()

def obtener_sede():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_sede,nombre_sede,direccion,creacion,telefono,correo,id_congregacion,id_diosesis FROM sede")
        sede = cursor.fetchall()
    conexion.close()
    return sede

def obtener_sede_por_id(id):
    conexion = obtener_conexion()
    sede = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_sede,nombre_sede,direccion,creacion,telefono,correo,id_congregacion,id_diosesis FROM sede WHERE id_sede = %s", (id,))
        sede = cursor.fetchone()
    conexion.close()
    return sede

def actualizar_sede(nombre,direccion,creacion,telefono,correo,congregacion,diosesis, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE sede SET nombre_sede = %s, direccion = %s,  creacion = %s, telefono = %s, correo = %s, congregacion = %s, diosesis = %s WHERE id_sede = %s", (nombre,direccion,creacion,telefono,correo,congregacion,diosesis, id))
    conexion.commit()
    conexion.close()

def eliminar_sede(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM sede WHERE id_sede = %s", (id,))
    conexion.commit()
    conexion.close()
