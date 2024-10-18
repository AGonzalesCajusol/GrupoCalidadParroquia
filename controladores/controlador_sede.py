from bd import obtener_conexion

def insertar_sede(nombre_sede,direccion,creacion,telefono,correo,monto,congregacion,diosesis):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO sede(nombre_sede,direccion,creacion,telefono,correo,monto,id_congregacion,id_diosesis) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)", (nombre_sede,direccion,creacion,telefono,correo,monto,congregacion,diosesis))
    conexion.commit()
    conexion.close()

def obtener_sede():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT sd.id_sede,sd.nombre_sede,sd.direccion,sd.creacion,sd.telefono,sd.correo,sd.monto,sd.estado,co.nombre_congregacion,ds.nombre_diosesis FROM sede sd inner join congregacion co on sd.id_congregacion = co.id_congregacion inner join diosesis ds on sd.id_diosesis= ds.id_diosesis order by 1 asc")
        sede = cursor.fetchall()
    conexion.close()
    return sede

def obtener_sedeparacuenta():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("select id_sede, nombre_sede from sede where estado= 1;")
        sede = cursor.fetchall()
    conexion.close()
    return sede

def obtener_sede_por_id(id):
    conexion = obtener_conexion()
    sede = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_sede,nombre_sede,direccion,creacion,telefono,correo,monto,estado,id_congregacion,id_diosesis FROM sede WHERE id_sede = %s", (id,))
        sede = cursor.fetchone()
    conexion.close()
    return sede

def actualizar_sede(nombre_sede,direccion,creacion,telefono,correo,monto,estado,congregacion,diosesis, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE sede SET nombre_sede = %s, direccion = %s,  creacion = %s, telefono = %s, correo = %s, monto = %s, estado = %s, id_congregacion = %s, id_diosesis = %s WHERE id_sede = %s", (nombre_sede,direccion,creacion,telefono,correo,monto,estado,congregacion,diosesis, id))
    conexion.commit()
    conexion.close()

def eliminar_sede(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM sede WHERE id_sede = %s", (id,))
    conexion.commit()
    conexion.close()

def darBaja_sede(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE sede set estado = %s WHERE id_sede = %s", (0,id,))
    conexion.commit()
    conexion.close()

def obtener_id_sede_por_nombre(nombre):
        conexion = obtener_conexion()
        id_sede = None
        with conexion.cursor() as cursor:
            cursor.execute("select id_sede from  sede WHERE nombre_sede = %s", (nombre,))
            resultado = cursor.fetchone()
            if resultado:
                id_sede = resultado[0]
        conexion.close()
        return id_sede