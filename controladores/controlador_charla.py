from flask import jsonify
from bd import obtener_conexion



# Obtener las charlas dentro de un rango de fechas
def obtener_charlas(inicio , fin):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                select c.id_charla,c.fecha,c.hora_inicio,c.hora_fin,m.nombre_ministro,al.nombre_liturgia, t.descripcion, c.estado from charlas c 
                    inner join ministro m on m.id_ministro= c.id_ministro 
                    inner join tema t on t.id_tema= c.id_tema 
                    inner join actoliturgico al on al.id_actoliturgico=c.id_actoliturgico
                    where c.fecha BETWEEN %s AND %s
            """
            cursor.execute(query, (inicio, fin))
            charlas = cursor.fetchall()
        return jsonify(charlas)  # Devolver las charlas en formato JSON
    except Exception as e:
        print(f"Error al obtener charlas: {e}")
        return jsonify(success=False, message="Error al obtener charlas"), 500
    finally:
        conexion.close()

# Insertar una nueva charla
def insertar_charla(fecha, hora_inicio, hora_fin, acto_liturgico, tema, ministro, sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                INSERT INTO charlas (fecha, hora_inicio, hora_fin, id_sac_liturgico, id_tema, id_ministro, id_sede)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (fecha, hora_inicio, hora_fin, acto_liturgico, tema, ministro, sede))
        conexion.commit()
        return jsonify(success=True)
    except Exception as e:
        print(f"Error al insertar charla: {e}")
        conexion.rollback()
        return jsonify(success=False, message="Error al insertar charla"), 500
    finally:
        conexion.close()

# Actualizar una charla existente
def actualizar_charla(id_charla, fecha, hora_inicio, hora_fin, acto_liturgico, tema, ministro, sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                UPDATE charlas 
                SET fecha = %s, hora_inicio = %s, hora_fin = %s, id_sac_liturgico = %s, id_tema = %s, id_ministro = %s, id_sede = %s
                WHERE id_charla = %s
            """
            cursor.execute(query, (fecha, hora_inicio, hora_fin, acto_liturgico, tema, ministro, sede, id_charla))
        conexion.commit()
        return jsonify(success=True)
    except Exception as e:
        print(f"Error al actualizar charla: {e}")
        conexion.rollback()
        return jsonify(success=False, message="Error al actualizar charla"), 500
    finally:
        conexion.close()

# Eliminar una charla
def eliminar_charla(id_charla):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM charlas WHERE id_charla = %s", (id_charla,))
        conexion.commit()
        return jsonify(success=True)
    except Exception as e:
        print(f"Error al eliminar charla: {e}")
        conexion.rollback()
        return jsonify(success=False, message="Error al eliminar charla"), 500
    finally:
        conexion.close()


def obtener_actoliturgico():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT * from actoliturgico order by 1 asc")
        sede = cursor.fetchall()
    conexion.close()
    return sede    


def obtener_actoliturgico_por_id(id_acto):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT * from actoliturgico where id_actoliturgico=%s",(id_acto,))
        sede = cursor.fetchall()
    conexion.close()
    return sede    


def obtener_id_actoliturgico_nombre(acto):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_actoliturgico from actoliturgico where nombre_liturgia =%s", (acto,))
        sede = cursor.fetchall()
    conexion.close()
    return sede    


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



