from flask import jsonify
from bd import obtener_conexion


def registrar_programacion_en_bloque(id_charla, programaciones):
    if not id_charla or not programaciones:
        return {"success": False, "error": "Datos incompletos"}
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    try:        
        for programacion in programaciones:
            tema = programacion.get('tema')
            fecha = programacion.get('fecha')
            hora_inicio = programacion.get('hora_inicio')
            hora_fin = programacion.get('hora_fin')
            estado = programacion.get('estado')
            ministro = programacion.get('ministro')
            sede = programacion.get('sede')
            if None in [tema, fecha, hora_inicio, hora_fin, estado, ministro, sede]:
                return {"success": False, "error": "Faltan campos obligatorios en la programación"}
            cursor.execute("""
                INSERT INTO programacion_charlas (id_charla, tema, fecha, hora_inicio, hora_fin, estado, ministro, sede)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (id_charla, tema, fecha, hora_inicio, hora_fin, estado, ministro, sede))
        conexion.commit()
        return {"success": True, "message": "Programaciones registradas con éxito"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al registrar las programaciones en bloque: {e}")
        return {"success": False, "error": "Error al registrar las programaciones"}

    finally:
        cursor.close()
        conexion.close()

def charlas_acto(id_acto):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('''
            select pr.id_programacion, tm.descripcion, pr.fecha , pr.hora_inicio, pr.hora_fin from programacion_charlas as pr inner join tema as tm
            on pr.id_tema = tm.id_tema
            where pr.id_charla = (select id_charla from charlas
            inner join actoliturgico as al1
            on charlas.id_actoliturgico = al1.id_actoliturgico
            where current_date < charlas.fecha_inicio and al1.id_actoliturgico = %s
            order by charlas.fecha_inicio asc
            limit 1)
                ''', (id_acto,))
        charlas = cursor.fetchall()
    conexion.close()
    return charlas 



