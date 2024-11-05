from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion
from datetime import datetime

from datetime import datetime
from bd import obtener_conexion

def insertar_recaudacion(monto, observacion, id_sede, id_tipo_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Obtener el siguiente ID de recaudación
            cursor.execute("SELECT COALESCE(MAX(id_recaudacion) + 1, 1) as siguiente_id FROM recaudacion")
            siguiente_id = cursor.fetchone()[0]

            # Establecer la fecha y hora actuales
            fecha_actual = datetime.now().strftime('%Y-%m-%d')
            hora_actual = datetime.now().strftime('%H:%M:%S')

            # Inserción de la nueva recaudación (sin el campo 'estado')
            cursor.execute("""
                INSERT INTO recaudacion (id_recaudacion, fecha, hora, monto, observacion, id_sede, id_tipo_recaudacion)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (siguiente_id, fecha_actual, hora_actual, monto, observacion, id_sede, id_tipo_recaudacion))

        # Confirmar los cambios en la base de datos
        conexion.commit()
        return siguiente_id
    except Exception as e:
        print(f"Error al insertar recaudación: {e}")
        conexion.rollback()
        return None
    finally:
        conexion.close()
def obtener_recaudaciones():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
            SELECT 
                r.id_recaudacion,
                r.fecha,
                r.hora,
                r.monto,
                r.observacion,
                s.nombre_sede,
                tr.nombre_recaudacion
            FROM 
                recaudacion r
            JOIN 
                sede s ON r.id_sede = s.id_sede
            JOIN 
                tipo_recaudacion tr ON r.id_tipo_recaudacion = tr.id_tipo_recaudacion

            UNION ALL

            SELECT 
                c.id_comprobante AS id_recaudacion,
                DATE(c.fecha_hora) AS fecha,
                TIME(c.fecha_hora) AS hora,
                c.total AS monto,
                'Celebración de Acto Litúrgico' AS observacion,
                s.nombre_sede,
                tr.nombre_recaudacion
            FROM 
                comprobante c
            JOIN 
                sede s ON c.id_sede = s.id_sede
            JOIN 
                tipo_recaudacion tr ON tr.id_tipo_recaudacion = 34;
            """)
            recaudaciones = cursor.fetchall()
        return recaudaciones
    except Exception as e:
        print(f"Error al obtener recaudaciones: {e}")
        return []
    finally:
        conexion.close()


        
def obtener_recaudacion_por_id(id_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_recaudacion, fecha, hora, monto, observacion, id_sede, id_tipo_recaudacion 
                FROM recaudacion 
                WHERE id_recaudacion = %s
            """, (id_recaudacion,))
            recaudacion = cursor.fetchone()
        return recaudacion
    except Exception as e:
        print(f"Error al obtener recaudación por id: {e}")
        return None
    finally:
        conexion.close()

def dar_baja_recaudacion(id_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE recaudacion 
                SET estado = %s 
                WHERE id_recaudacion = %s
            """, (False, id_recaudacion))  # False para marcar como inactivo
        conexion.commit()
    except Exception as e:
        print(f"Error al dar de baja la recaudación: {e}")
        conexion.rollback()
    finally:
        conexion.close()


def actualizar_recaudacion(monto, observacion, id_tipo_recaudacion, id_recaudacion, id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Actualización sin modificar la fecha y hora, y con sede inmutable
            cursor.execute("""
                UPDATE recaudacion
                SET monto = %s, observacion = %s, id_tipo_recaudacion = %s
                WHERE id_recaudacion = %s AND id_sede = %s
            """, (monto, observacion, id_tipo_recaudacion, id_recaudacion, id_sede))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al actualizar recaudación: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def obtener_nombre_sede(id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT nombre_sede FROM sede WHERE id_sede = %s", (id_sede,))
            result = cursor.fetchone()
            if result:
                return result[0]  # Devuelve el nombre de la sede
            else:
                return None
    except Exception as e:
        print(f"Error al obtener nombre de la sede: {e}")
        return None
    finally:
        conexion.close()

def eliminar_recaudacion(id_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM recaudacion WHERE id_recaudacion = %s", (id_recaudacion,))
        conexion.commit()
    except Exception as e:
        print(f"Error al eliminar recaudación: {e}")
        conexion.rollback()
    finally:
        conexion.close()
        
def obtener_tipos_recaudacion():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Solo selecciona los tipos de recaudación donde estado = 1
            cursor.execute("SELECT id_tipo_recaudacion, nombre_recaudacion FROM tipo_recaudacion WHERE estado = 1")
            tipos_recaudacion = cursor.fetchall()
        return tipos_recaudacion
    except Exception as e:
        print(f"Error al obtener tipos de recaudación: {e}")
        return []
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

def obtener_recaudaciones_por_año(año):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT r.id_recaudacion, r.fecha, r.monto, r.observacion, s.nombre_sede, tr.nombre_recaudacion
                FROM recaudacion r
                JOIN sede s ON r.id_sede = s.id_sede
                JOIN tipo_recaudacion tr ON r.id_tipo_recaudacion = tr.id_tipo_recaudacion
                WHERE YEAR(r.fecha) = %s
            """, (año,))
            recaudaciones = cursor.fetchall()
        return recaudaciones
    except Exception as e:
        print(f"Error al obtener recaudaciones por año: {e}")
        return []
    finally:
        conexion.close()
        
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
        
def obtener_id_tipoR_por_nombre(nombre_recaudacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Ejecuta la consulta para obtener el ID en base al nombre de la sede
            cursor.execute("SELECT id_tipo_recaudacion FROM tipo_recaudacion WHERE nombre_recaudacion = %s", (nombre_recaudacion,))
            resultado = cursor.fetchone()
            if resultado:
                return resultado[0]  # Devuelve el id_sede
            else:
                return None  # Retorna None si no encuentra el nombre de la sede
    except Exception as e:
        print(f"Error al obtener el ID del tipo recaudacion: {e}")
        return None
    finally:
        conexion.close




# Obtener recaudaciones por año Exportar###
def obtener_recaudaciones_por_año(año):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT 
                r.id_recaudacion AS id,
                r.fecha,
                r.monto,
                r.observacion,
                s.nombre_sede AS sede,
                t.nombre_recaudacion AS tipo_recaudacion,
                CASE
                    WHEN t.tipo = 1 THEN 'Monetaria'
                    WHEN t.tipo = 0 THEN 'No Monetaria'
                    ELSE 'Desconocido'
                END AS tipo
            FROM 
                recaudacion r
            JOIN 
                sede s ON r.id_sede = s.id_sede
            JOIN 
                tipo_recaudacion t ON r.id_tipo_recaudacion = t.id_tipo_recaudacion
            WHERE 
                YEAR(r.fecha) = %s
        """, (año,))
        recaudaciones = cursor.fetchall()
    
    return recaudaciones


def obtener_rango_de_años():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT DISTINCT YEAR(fecha) as año
            FROM recaudacion
            ORDER BY año DESC;
        """)
        rango_años = cursor.fetchall()
    
    # Convertimos la lista de tuplas en una lista simple de años
    return rango_años

# def obtener_rango_de_años():
#     conexion = obtener_conexion()
#     with conexion.cursor() as cursor:
#         cursor.execute("""
#             SELECT MIN(YEAR(fecha)) as año_minimo, MAX(YEAR(fecha)) as año_maximo
#             FROM recaudacion;
#         """)
#         rango_años = cursor.fetchone()
        
#     # Verifica que el rango de años sea válido
#     if rango_años:
#         año_minimo, año_maximo = rango_años
#         return list(range(año_minimo, año_maximo + 1))
#     return []
