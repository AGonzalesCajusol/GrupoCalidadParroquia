import pymysql
from bd import obtener_conexion
from flask import jsonify, request
from datetime import datetime
from fpdf import FPDF


def obtener_celebraciones():
    conexion = obtener_conexion()
    try:
        start = request.args.get('start')
        end = request.args.get('end')
        start_date = datetime.fromisoformat(start).date()  
        end_date = datetime.fromisoformat(end).date()  
        print(f"Start: {start}, End: {end}")        
        with conexion.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT id_celebracion, fecha, hora_inicio, hora_fin, id_sede
                FROM celebracion
                WHERE fecha >= %s AND fecha <= %s
            """, (start_date, end_date))
            celebraciones = cursor.fetchall()

        eventos = []
        for celebracion in celebraciones:
            eventos.append({
                'id': celebracion['id_celebracion'],  # Ahora accedemos por nombre de columna
                'title': f"Celebración en Sede {celebracion['id_sede']}",
                'start': f"{celebracion['fecha']}T{formatear_hora(celebracion['hora_inicio'])}",  # Combina fecha y hora_inicio
                'end': f"{celebracion['fecha']}T{formatear_hora(celebracion['hora_fin'])}" if celebracion['hora_fin'] else None,  # Hora_fin es opcional
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
        
def formatear_hora(hora):
    hora_str = str(hora)
    partes = hora_str.split(":")
    if len(partes[0]) == 1:
        nueva_hora = "0"+partes[0]+":"+partes[1]+":"+partes[2]
        return nueva_hora
    else:
        return hora_str
    

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

def obtener_celebraciones_desde_bd():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("""
        SELECT c.id_celebracion, c.fecha, c.hora_inicio, c.hora_fin, c.estado, s.nombre_sede, at.nombre_liturgia 
        FROM celebracion c inner join sede s on s.id_sede=c.id_sede inner join actoliturgico at on at.id_actoliturgico=c.id_actoliturgico
        WHERE c.estado = 'R' 
                   
    """)
    celebraciones = cursor.fetchall()
    conexion.close()
    return [
        {
            'id_celebracion': c[0],
            'fecha': c[1],
            'hora_inicio': c[2],
            'hora_fin': c[3],
            'estado': c[4],
            'id_sede': c[5],
            'id_actoliturgico': c[6]
        }
        for c in celebraciones
    ]




def obtener_solicitudes_por_celebracion(id_celebracion):
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("""
        SELECT s.id_celebracion, s.id_solicitud, at.nombre_liturgia,  
       CONCAT(f.nombres, ' ', f.apellidos) AS nombres, s.asistencia
        FROM solicitud s
        INNER JOIN actoliturgico at ON at.id_actoliturgico = s.id_actoliturgico 
        INNER JOIN feligres f ON f.dni = s.dni_feligres 
        INNER JOIN solicitud_feligres sf ON sf.id_solicitud = s.id_solicitud
        WHERE LOWER(sf.rol) IN ('bautizado', 'confirmandos', 'comulgantes','novio','novia') and s.estado='A'
        and s.id_celebracion = %s
    """, (id_celebracion,))
    solicitudes = cursor.fetchall()
    conexion.close()
    return [
        {
            'id_celebracion': s[0],
            'id_solicitud' : s[1],
            'acto_liturgico': s[2],
            'feligres': s[3],
            'asistencia': s[4]
        }
        for s in solicitudes
    ]






def actualizar_asistencia_en_bd(id_solicitud, asistencia):
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("""
        UPDATE solicitud SET asistencia = %s WHERE id_solicitud = %s
    """, (asistencia, id_solicitud))
    conexion.commit()
    conexion.close()




def obtener_solicitudes_asistidas():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("""
        SELECT s.id_celebracion, c.fecha,s.id_solicitud, at.nombre_liturgia,  
       CONCAT(f.nombres, ' ', f.apellidos) AS nombres
        FROM solicitud s
        INNER JOIN actoliturgico at ON at.id_actoliturgico = s.id_actoliturgico 
        INNER JOIN feligres f ON f.dni = s.dni_feligres 
        INNER JOIN solicitud_feligres sf ON sf.id_solicitud = s.id_solicitud
        inner join celebracion c on c.id_celebracion=s.id_solicitud
        WHERE LOWER(sf.rol) IN ('bautizado', 'confirmandos','confirmados', 'comulgantes','novio') and s.asistencia=1

    """)
    celebraciones = cursor.fetchall()
    conexion.close()
    return [
        {
            'id_celebracion': c[0],
            'fecha': c[1],
            'id_solicitud': c[2],
            'nombre_liturgia': c[3],
            'feligres': c[4],
            
        }
        for c in celebraciones
    ]