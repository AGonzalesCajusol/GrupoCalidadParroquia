import secrets
import hashlib  # To handle password encryption
from bd import obtener_conexion

def generar_token():
    # Genera un token alfanumérico aleatorio de 20 caracteres
    return secrets.token_hex(10)

def insertar_ministro(nombre_ministro, numero_documento, fecha_nacimiento, fecha_ordenacion, fin_actividades, tipoministro, id_sede, id_cargo, contraseña_encriptada):
    token = generar_token()  # Genera un token aleatorio
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Obtener el siguiente id_ministro disponible
            cursor.execute("SELECT COALESCE(MAX(id_ministro) + 1, 1) as siguiente_id FROM ministro")
            siguiente_id = cursor.fetchone()[0]


            # Inserción del nuevo ministro
            cursor.execute("""
                INSERT INTO ministro (id_ministro, nombre_ministro, numero_documento, fecha_nacimiento, fecha_ordenacion, fin_actividades, token, tipoministro, id_sede, id_cargo, contraseña) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (siguiente_id, nombre_ministro, numero_documento, fecha_nacimiento, fecha_ordenacion, fin_actividades, token, tipoministro, id_sede, id_cargo, contraseña_encriptada))
        
        # Confirmar la transacción
        conexion.commit()
        return siguiente_id  # Devuelve el ID del nuevo ministro insertado
    except Exception as e:
        print(f"Error al insertar ministro: {e}")
        conexion.rollback()  # Revertir la transacción en caso de error
        return None
    finally:
        conexion.close()  # Asegurarse de cerrar la conexión


def encriptar_contraseña(contraseña):
    # Encripta la contraseña usando SHA-256
    print(f"Encriptando la contraseña: {contraseña}")  # Añadimos un print para ver la contraseña antes de encriptar
    sha_signature = hashlib.sha256(contraseña.encode('utf8')).hexdigest()
    print(f"Resultado de la encriptación: {sha_signature}")  # Añadimos un print para ver la contraseña encriptada
    return sha_signature



def actualizar_ministro(nombre_ministro, numero_documento, fecha_nacimiento, fecha_ordenacion, fin_actividades, tipoministro, id_sede, id_cargo, id_ministro, contraseña_encriptada=None):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Construir la base de la consulta de actualización
            query = """
                UPDATE ministro 
                SET nombre_ministro = %s, 
                    numero_documento = %s, 
                    fecha_nacimiento = %s, 
                    fecha_ordenacion = %s, 
                    fin_actividades = %s, 
                    tipoministro = %s, 
                    id_sede = %s, 
                    id_cargo = %s
            """
            params = [nombre_ministro, numero_documento, fecha_nacimiento, fecha_ordenacion, fin_actividades, tipoministro, id_sede, id_cargo]

            # Si se proporciona una nueva contraseña, agregarla a la consulta
            if contraseña_encriptada:
                query += ", contraseña = %s"
                params.append(contraseña_encriptada)

            # Agregar la cláusula WHERE para actualizar el ministro específico
            query += " WHERE id_ministro = %s"
            params.append(id_ministro)

            # Ejecutar la consulta
            cursor.execute(query, tuple(params))

        # Confirmar la transacción si no hubo errores
        conexion.commit()
    except Exception as e:
        print(f"Error al actualizar ministro: {e}")
        conexion.rollback()  # Revertir la transacción en caso de error
        raise  # Lanzar la excepción para manejarla externamente si es necesario
    finally:
        conexion.close()  # Asegurarse de cerrar la conexión


# Las demás funciones no necesitan modificaciones
def obtener_ministros():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
               SELECT m.id_ministro, m.nombre_ministro, m.numero_documento, m.fecha_nacimiento, m.fecha_ordenacion, m.fin_actividades, m.token, 
                       tp.tipo_ministro, s.nombre_sede, c.cargo,  
                           CASE 
                                WHEN m.estado = 1 THEN 'Activo'
                                WHEN m.estado = 0 THEN 'Inactivo'
                                ELSE 'Desconocido'
                            END AS estado
                FROM ministro m 
                INNER JOIN sede s ON s.id_sede = m.id_sede 
                INNER JOIN tipo_ministro tp ON tp.id_tipoministro = m.tipoministro 
                INNER JOIN cargo c ON c.id_cargo = m.id_cargo
            """)
            ministros = cursor.fetchall()
        return ministros
    except Exception as e:
        print(f"Error al obtener ministros: {e}")
        return []
    finally:
        conexion.close()

def obtener_ministro_por_id(id_ministro):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_ministro, nombre_ministro, numero_documento, fecha_nacimiento, fecha_ordenacion, fin_actividades, token, tipoministro, id_sede, id_cargo 
                FROM ministro 
                WHERE id_ministro = %s
            """, (id_ministro,))
            ministro = cursor.fetchone()
        return ministro
    except Exception as e:
        print(f"Error al obtener ministro por id: {e}")
        return None
    finally:
        conexion.close()

def eliminar_ministro(id_ministro):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM ministro WHERE id_ministro = %s", (id_ministro,))
        conexion.commit()
    except Exception as e:
        print(f"Error al eliminar ministro: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def retornar_datos_ministro(num_doc):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT mn.numero_documento, mn.nombre_ministro, mn.token, c.cargo, sd.nombre_sede
                FROM ministro AS mn 
                INNER JOIN cargo AS c ON c.id_cargo = mn.id_cargo left join sede as sd
                on sd.id_sede = mn.id_sede
                WHERE mn.numero_documento = %s
            ''', (num_doc,))
            return cursor.fetchone()
    finally:
        conexion.close()

def actualizar_token(token,dni):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                update ministro set token = %s where numero_documento = %s
            ''', (token,dni,))
            conexion.commit()
            return cursor.fetchone()
    finally:
        conexion.close()

def verificar_ministro(token,dni):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                select * from  ministro where numero_documento = %s and token = %s
            ''', (dni,token))
            lista = cursor.fetchall()
            if lista:
                return 1
            else:
                return 0
    except:
        return 0
    finally:
        conexion.close()

##anggelooo
def obtener_todos_ministros(termino_busqueda="", limite=10, offset=0):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT m.id_ministro, m.nombre_ministro, s.nombre_sede
                FROM ministro m
                LEFT JOIN sede s ON m.id_sede = s.id_sede
                WHERE m.estado = 1 
                  AND m.nombre_ministro LIKE %s
                LIMIT %s OFFSET %s
            """, (f"%{termino_busqueda}%", limite, offset))
            ministros = cursor.fetchall()
            ministros_list = [{"id_ministro": ministro[0], "nombre": ministro[1], "sede": ministro[2]} for ministro in ministros]
        return ministros_list
    except Exception as e:
        print(f"Error al obtener ministros: {e}")
        return []
    finally:
        conexion.close()



def dar_baja_ministro( id,estado):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE ministro SET estado = %s WHERE id_ministro = %s", ( estado, id))
    conexion.commit()
    conexion.close()
