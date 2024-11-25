from flask import request, jsonify
from datetime import datetime, timedelta
from bd import obtener_conexion

## select * from asistencia (id_asistencia, id_programacion, dni_feligres, id_solicitud, estado, fecha)
## select * from programacion_charlas (id_programacion,, hora_inicio, id_tema, id_ministro, id_sede, dias_semana)
## select * from feligres (dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede, correo)
## select * from solicitud (id_solicitud, id_actoliturgico, id_sede, estado, id_celebracion,dni_feligres,asistencia)


def obtener_asistencia():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT asist.id_asistencia, asist.fecha, prgCH.id_programacion, fe.dni, CONCAT(fe.apellidos, ' ', fe.nombres) AS nombre_completo, asist.id_solicitud, asist.estado FROM asistencia asist
            INNER JOIN feligres fe ON asist.dni_feligres = fe.dni
            INNER JOIN programacion_charlas prgCH ON asist.id_programacion = prgCH.id_programacion
            INNER JOIN solicitud solst ON asist.id_solicitud = solst.id_solicitud
            ORDER BY asist.fecha ASC, prgCH.id_programacion ASC;
        """)
        sede = cursor.fetchall()
    conexion.close()
    return sede

def obtener_programacion():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT prgCH.id_programacion, prgCH.hora_inicio, t.descripcion, mi.nombre_ministro, t.duracion, prgCH.id_sede, prgCH.dias_semana
            FROM programacion_charlas prgCH
            INNER JOIN tema t ON prgCH.id_tema = t.id_tema
            INNER JOIN ministro mi ON prgCH.id_ministro = mi.id_ministro
        """)
        programacion = cursor.fetchall()
    conexion.close()
    return programacion


def obtener_feligres():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("select fe.dni, fe.apellidos, fe.nombres, fe.fecha_nacimiento, fe.estado_civil, fe.sexo, fe.id_sede, fe.correo from feligres fe")
        sede = cursor.fetchall()
    conexion.close()
    return sede

def obtener_solicitud():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("select * from solicitud")
        sede = cursor.fetchall()
    conexion.close()
    return sede

def obtener_calendario():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT DISTINCT prgCH.id_programacion, prgCH.hora_inicio, tm.descripcion, asist.fecha
            FROM asistencia asist
            INNER JOIN programacion_charlas prgCH ON asist.id_programacion = prgCH.id_programacion
            INNER JOIN tema tm ON prgCH.id_tema = tm.id_tema
        """)
        data = cursor.fetchall()

    conexion.close()

    eventos = []
    for row in data:
        eventos.append({
            "title": f"{row[1]} - {row[2]}",  # Hora-tema
            "start": row[3].strftime('%Y-%m-%d'),
            "extendedProps": {
                "id_programacion": row[0],
                "hora_tema": f"{row[1]} - {row[2]}"
            }
        })

    return eventos


def actualizar_asistencia():
    try:
        # Imprimir el JSON recibido para verificar si los datos están llegando correctamente
        datos = request.json
        print("Datos recibidos:", datos)
        ids = datos.get('ids', [])
        
        # Verificar si se recibieron IDs
        if not ids:
            print("No se enviaron IDs")
            return jsonify({"success": False, "message": "No se enviaron IDs"})

        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            # Actualizar el estado a '1' (Asistió) para los IDs seleccionados
            cursor.execute("""
                UPDATE asistencia 
                SET estado = 1 
                WHERE id_asistencia IN %s
            """, (tuple(ids),))
            conexion.commit()
        
        conexion.close()
        print("Actualización completada para IDs:", ids)
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error al actualizar la asistencia: {e}")
        return jsonify({"success": False, "message": str(e)})

