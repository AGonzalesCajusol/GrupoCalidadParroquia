import secrets
from bd import obtener_conexion

def generar_token():
    # Genera un token alfanumérico aleatorio de 20 caracteres
    return secrets.token_hex(10)


def insertar_ministro(nombre_ministro, fecha_nacimiento, fecha_ordenacion, fin_actividades, tipoministro, id_sede, id_cargo):
    token = generar_token()  # Genera un token aleatorio
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        # Obtener el siguiente id_ministro disponible
        cursor.execute("SELECT COALESCE(MAX(id_ministro) + 1, 1) as siguiente_id FROM ministro")
        siguiente_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO ministro (id_ministro,nombre_ministro, fecha_nacimiento, fecha_ordenacion, fin_actividades, token, tipoministro, id_sede, id_cargo) 
            VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s)
        """, (siguiente_id,nombre_ministro, fecha_nacimiento, fecha_ordenacion, fin_actividades, token, tipoministro, id_sede, id_cargo))
    conexion.commit()
    conexion.close()


def obtener_ministros():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT m.id_ministro, m.nombre_ministro, m.fecha_nacimiento, m.fecha_ordenacion, m.fin_actividades, m.token, tp.tipo_ministro, s.nombre_sede, c.cargo FROM ministro m inner join sede s on s.id_sede = m.id_sede inner join tipo_ministro tp on tp.id_tipoministro=m.tipoministro inner join cargo c on c.id_cargo = m.id_cargo")
        ministros = cursor.fetchall()
    conexion.close()
    return ministros

def obtener_ministro_por_id(id_ministro):
    conexion = obtener_conexion()
    ministro = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id_ministro, nombre_ministro, fecha_nacimiento, fecha_ordenacion, fin_actividades, token, tipoministro, id_sede, id_cargo FROM ministro WHERE id_ministro = %s", (id_ministro,))
        ministro = cursor.fetchone()
    conexion.close()
    return ministro

def actualizar_ministro( nombre_ministro, fecha_nacimiento, fecha_ordenacion, fin_actividades, tipoministro, id_sede, id_cargo,id_ministro):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            UPDATE ministro 
            SET nombre_ministro = %s, fecha_nacimiento = %s, fecha_ordenacion = %s, fin_actividades = %s, tipoministro = %s, id_sede = %s, id_cargo = %s
            WHERE id_ministro = %s
        """, (nombre_ministro, fecha_nacimiento, fecha_ordenacion, fin_actividades, tipoministro, id_sede, id_cargo, id_ministro))
    conexion.commit()
    conexion.close()

def eliminar_ministro(id_ministro):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM ministro WHERE id_ministro = %s", (id_ministro,))
    conexion.commit()
    conexion.close()
