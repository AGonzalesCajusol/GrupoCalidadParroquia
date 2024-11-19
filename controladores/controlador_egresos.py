from datetime import datetime
from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion

#Para agregar un nuevo egreso
def insertar_egreso(monto, descripcion, id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            #Obtener el siguiente ID de egreso
            cursor.execute("SELECT COALESCE(MAX(id_egreso) + 1, 1) as siguiente_id FROM egreso")
            siguiente_id = cursor.fetchone()[0]

            #Establecer la fecha y hora actuales
            fecha_actual = datetime.now().strftime('%Y-%m-%d')
            hora_actual = datetime.now().strftime('%H:%M:%S')

            #Inserción del nuevo egreso(sin el campo 'estado')
            cursor.execute("""
                INSERT INTO egreso (id_egreso, id_sede, descripcion, fecha, hora, monto)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (siguiente_id, id_sede, descripcion, fecha_actual, hora_actual, monto))
    
        # Confirmar los cambios en la base de datos
        conexion.commit()
        return siguiente_id
    except Exception as e:
        print(f"Error al insertar recaudación: {e}")
        conexion.rollback()
        return None
    finally:
        conexion.close()

#Para listar un nuevo egreso
def obtener_egresos():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT e.id_egreso, s.nombre_sede, e.descripcion, e.fecha, e.hora, e.monto
                FROM egreso e
                JOIN sede s ON e.id_sede = s.id_sede
                """)
            egresos = cursor.fetchall()
        return egresos
    except Exception as e:
        print(f"Error al obtener egresos: {e}")
        return[]
    finally:
        conexion.close()

def obtener_egreso_por_id(id_egreso):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_egreso, id_sede, descripcion ,  fecha, hora, monto
                FROM egreso
                WHERE id_egreso = %s
            """, (id_egreso,))
            egreso= cursor.fetchone()
        return egreso
    except Exception as e:
        print(f"Error al obtener egreso por id: {e}")
        return None
    finally:
        conexion.close()

#Para actualizar el egreso
def actualizar_egreso(monto, descripcion, id_egreso,id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            #Actualizacion sin modificar la fecha y hora, y con sede inmutable
            cursor.execute("""
                UPDATE egreso
                SET monto = %s, descripcion = %s
                WHERE id_egreso = %s AND id_sede = %s
            """, (monto, descripcion, id_egreso,id_sede))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al actualizar egreso: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

#Para obtener el nombre de la sede
def obtener_nombre_sede(id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT nombre_sede FROM sede WHERE id_sede = %s", (id_sede,))
            result = cursor.fetchone()
            if result:
                return result[0] #Devuelve sede nombre
            else:
                return None
    except Exception as e:
        print(f"Error al obtener nombre de la sede: {e}")
        return None
    finally:
        conexion.close()

def obtener_nombre_sede(sede_id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT nombre_sede FROM sede WHERE id_sede = %s", (sede_id,))
            resultado = cursor.fetchone()
            if resultado:
                return resultado[0]  # Retorna solo el nombre de la sede
            else:
                return None  # Retorna None si no encuentra la sede
    except Exception as e:
        print(f"Error al obtener el nombre de la sede: {e}")
        return None
    finally:
        conexion.close()

#Para obtener el id de la sede
def obtener_id_sede_por_nombre(nombre_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Ejecuta la consulta para obtener el ID en base al nombre de la sede
            cursor.execute("SELECT id_sede FROM sede WHERE nombre_sede = %s", (nombre_sede,))
            resultado = cursor.fetchone()
            if resultado:
                return resultado[0]  # Devuelve el id_sede
            else:
                return None  # Retorna None si no encuentra el nombre de la sede
    except Exception as e:
        print(f"Error al obtener el ID de la sede: {e}")
        return None
    finally:
        conexion.close

#Para obtener egresos según el año
def obtener_egresos_por_año(año):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT e.id_egreso, s.nombre_sede, e.descripcion, e.fecha, e.hora, e.monto 
                FROM egreso e
                JOIN sede s ON e.id_sede = s.id_sede
                WHERE YEAR(e.fecha) = %s
            """, (año,))
            egresos = cursor.fetchall()
        return egresos
    except Exception as e:
        print(f"Error al obtener egresos por año: {e}")
        return[]
    finally:
        conexion.close()

#Para obtener egresos por año EXPORTAR
def obtener_egresos_por_año(año):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT 
                e.id_egreso AS id,
                s.nombre_sede AS sede,
                e.descripcion,
                e.fecha,
                e.hora,
                e.monto,
            FROM 
                egreso e
            JOIN 
                sede s ON e.id_sede = s.id_sede 
            WHERE 
                YEAR(e.fecha) = %s
        """, (año,))
        egresos = cursor.fetchall()

    return egresos

def obtener_rango_de_años():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT YEAR(fecha) as año
                FROM egreso
                ORDER BY año DESC;
            """)
            rango_años = cursor.fetchall()  # Devuelve algo como [(2021,), (2022,), ...]
        return rango_años
    except Exception as e:
        print(f"Error al obtener rango de años: {e}")
        return []
    finally:
        conexion.close()


