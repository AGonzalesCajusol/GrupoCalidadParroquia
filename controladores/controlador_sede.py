from bd import obtener_conexion

def insertar_sede(nombre_sede, direccion, creacion, telefono, correo, monto, congregacion, diosis, monto_traslado):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Insertar en la tabla sede (dejando que el estado tome su valor por defecto)
            cursor.execute('''
                INSERT INTO sede(nombre_sede, direccion, creacion, telefono, correo, monto, id_congregacion, id_diosesis, monto_traslado) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (nombre_sede, direccion, creacion, telefono, correo, monto, congregacion, diosis, monto_traslado))
            
            id_sede = cursor.lastrowid  # Obtener el id de la sede recién insertada

        conexion.commit()
        return id_sede  # Retornar el id de la sede
    except Exception as e:
        print(f"Error: {e}")
        conexion.rollback()
        return None
    finally:
        conexion.close()

def insertar_sede_acto_liturgico(id_sede, id_actoliturgico, estado_acto):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Insertar en la tabla sede_acto_liturgico
            cursor.execute('''
                INSERT INTO sede_acto_liturgico (id_sede, id_actoliturgico, estadoActoL) 
                VALUES (%s, %s, %s)
            ''', (id_sede, id_actoliturgico, int(estado_acto)))  # Convertir el estado a entero (1 o 0)

        conexion.commit()
    except Exception as e:
        print(f"Error: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def obtener_sede():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT sd.id_sede,sd.nombre_sede,sd.direccion,sd.creacion,sd.telefono,sd.correo,sd.monto,sd.estado,co.nombre_congregacion,ds.nombre_diosesis,sd.monto_traslado FROM sede sd inner join congregacion co on sd.id_congregacion = co.id_congregacion inner join diosesis ds on sd.id_diosesis= ds.id_diosesis order by 1 asc")
        sede = cursor.fetchall()
    conexion.close()
    return sede


def obtener_sedes_celebracion():
    """Obtiene todas las sedes con su ID y nombre."""
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT id_sede, nombre_sede FROM sede")
            sedes = cursor.fetchall()            
            return sedes
    except Exception as e:
        print(f"Error al obtener sedes: {e}")
        return []
    finally:
        conexion.close()


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
    actos_liturgicos = []  # Lista para almacenar los actos litúrgicos
    try:
        with conexion.cursor() as cursor:
            # Obtener los datos de la sede
            cursor.execute("SELECT id_sede, nombre_sede, direccion, creacion, telefono, correo, monto, estado, id_congregacion, id_diosesis, monto_traslado FROM sede WHERE id_sede = %s", (id,))
            sede = cursor.fetchone()

            # Obtener los actos litúrgicos asociados a la sede
            cursor.execute("SELECT id_actoliturgico FROM sede_acto_liturgico WHERE id_sede = %s", (id,))
            actos_liturgicos = cursor.fetchall()

    finally:
        conexion.close()

    return sede, [acto[0] for acto in actos_liturgicos]  # Devuelve la sede y los IDs de los actos litúrgicos

def actualizar_sede(nombre_sede,direccion,creacion,telefono,correo,monto,estado,congregacion,diosesis,monto_traslado, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE sede SET nombre_sede = %s, direccion = %s,  creacion = %s, telefono = %s, correo = %s, monto = %s, estado = %s, id_congregacion = %s, id_diosesis = %s, monto_traslado = %s WHERE id_sede = %s", (nombre_sede,direccion,creacion,telefono,correo,monto,estado,congregacion,diosesis,monto_traslado, id))
    conexion.commit()
    conexion.close()

def eliminar_sede(id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Verificar si el id_sede está en uso en las diferentes tablas
            tablas_a_verificar = [
                ("sede_acto_liturgico", "id_sede"),
                ("programacion_charlas", "id_sede"),
                ("celebracion", "id_sede"),
                ("comprobante", "id_sede"),
                ("egreso", "id_sede"),
                ("feligres", "id_sede"),
                ("ministro", "id_sede"),
                ("recaudacion", "id_sede"),
                ("solicitud", "id_sede")
            ]

            # Revisar cada tabla para ver si existe una referencia
            for tabla, columna in tablas_a_verificar:
                cursor.execute(f"SELECT COUNT(*) FROM {tabla} WHERE {columna} = %s", (id,))
                en_uso = cursor.fetchone()[0]
                if en_uso > 0:
                    mensaje_error = f"No se puede eliminar la sede porque está en uso en la tabla '{tabla}'."
                    print(mensaje_error)
                    return {"success": False, "message": mensaje_error}
            
            # Si no hay dependencias, proceder con la eliminación
            cursor.execute("DELETE FROM sede WHERE id_sede = %s", (id,))
        conexion.commit()
        return {"success": True, "message": "Sede eliminada correctamente."}
    except Exception as e:
        print(f"Error al eliminar la sede: {e}")
        conexion.rollback()
        return {"success": False, "message": "Error al intentar eliminar la sede."}
    finally:
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

# charlaaaa
def obtener_sedes_charla(): 
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT s.id_sede, s.nombre_sede, s.direccion, s.telefono, s.correo 
                FROM sede s
            """)
            sedes = cursor.fetchall()
        return sedes
    except Exception as e:
        print(f"Error al obtener sedes: {e}")
        return []
    finally:
        conexion.close()


def eliminar_sede_acto_liturgico(id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM sede_acto_liturgico WHERE id_sede = %s", (id_sede,))
        conexion.commit()
    except Exception as e:
        print(f"Error: {e}")
        conexion.rollback()
    finally:
        conexion.close()

# anggelooo
def obtener_todas_sedes(termino_busqueda="", limite=10, offset=0):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_sede, nombre_sede, direccion
                FROM sede
                WHERE estado = 1 
                  AND nombre_sede LIKE %s
                LIMIT %s OFFSET %s
            """, (f"%{termino_busqueda}%", limite, offset))
            sedes = cursor.fetchall()
            sedes_list = [{"id_sede": sede[0], "nombre": sede[1], "direccion": sede[2]} for sede in sedes]
        return sedes_list
    except Exception as e:
        print(f"Error al obtener sedes: {e}")
        return []
    finally:
        conexion.close()

