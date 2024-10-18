import pymysql
from bd import obtener_conexion
from flask import jsonify, request

def obtener_celebraciones():
    conexion = obtener_conexion()
    try:
        start = request.args.get('start')
        end = request.args.get('end')
        print(f"Start: {start}, End: {end}")
        # Usar DictCursor para devolver los resultados como diccionarios
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT id_celebracion, fecha, hora_inicio, hora_fin, id_sede
                FROM celebracion
                WHERE fecha >= %s AND fecha <= %s
            """, (start, end))
            celebraciones = cursor.fetchall()

        eventos = []
        for celebracion in celebraciones:
            eventos.append({
                'id': celebracion['id_celebracion'],  # Ahora accedemos por nombre de columna
                'title': f"Celebración en Sede {celebracion['id_sede']}",
                'start': f"{celebracion['fecha']}T{celebracion['hora_inicio']}",  # Combina fecha y hora_inicio
                'end': f"{celebracion['fecha']}T{celebracion['hora_fin']}" if celebracion['hora_fin'] else None,  # Hora_fin es opcional
                'extendedProps': {
                    'sede': celebracion['id_sede']
                }
            })

        return jsonify(eventos)
    except Exception as e:
        print(f"Error al obtener celebraciones: {e}")
        return jsonify([]), 500
    finally:
        conexion.close()
    

def insertar_celebracion(titulo, fecha_inicio, hora_inicio, fecha_fin, hora_fin, sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO celebracion (titulo, fecha_inicio, hora_inicio, fecha_fin, hora_fin, sede)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (titulo, fecha_inicio, hora_inicio, fecha_fin, hora_fin, sede))
        conexion.commit()
        return jsonify(success=True)
    except Exception as e:
        print(f"Error al insertar celebración: {e}")
        conexion.rollback()
        return jsonify(success=False), 500
    finally:
        conexion.close()

def actualizar_celebracion(id_celebracion, titulo, fecha_inicio, hora_inicio, fecha_fin, hora_fin, sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE celebracion
                SET titulo = %s, fecha_inicio = %s, hora_inicio = %s, fecha_fin = %s, hora_fin = %s, sede = %s
                WHERE id_celebracion = %s
            """, (titulo, fecha_inicio, hora_inicio, fecha_fin, hora_fin, sede, id_celebracion))
        conexion.commit()
        return jsonify(success=True)
    except Exception as e:
        print(f"Error al actualizar celebración: {e}")
        conexion.rollback()
        return jsonify(success=False), 500
    finally:
        conexion.close()

def eliminar_celebracion(id_celebracion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM celebracion WHERE id_celebracion = %s", (id_celebracion,))
        conexion.commit()
        return jsonify(success=True)
    except Exception as e:
        print(f"Error al eliminar celebración: {e}")
        conexion.rollback()
        return jsonify(success=False), 500
    finally:
        conexion.close()
