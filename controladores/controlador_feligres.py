from bd import obtener_conexion
from hashlib import sha256


def insertar_feligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO feligres (dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede))
        conexion.commit()
    except Exception as e:
        print(f"Error al insertar feligrés: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def obtener_feligreses():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT f.id_feligres, f.dni, f.apellidos, f.nombres, f.fecha_nacimiento, f.estado_civil, f.sexo, s.nombre_sede 
                FROM feligres f
                INNER JOIN sede s ON f.id_sede = s.id_sede
            """)
            feligreses = cursor.fetchall()            
        return feligreses
    except Exception as e:
        print(f"Error al obtener feligreses: {e}")
        return []
    finally:
        conexion.close()

def obtener_feligres_por_id(id_feligres):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_feligres, dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede 
                FROM feligres 
                WHERE id_feligres = %s
            """, (id_feligres,))
            feligres = cursor.fetchone()
        return feligres
    except Exception as e:
        print(f"Error al obtener feligrés por id: {e}")
        return None
    finally:
        conexion.close()

def actualizar_feligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede, id_feligres):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE feligres 
                SET dni = %s, apellidos = %s, nombres = %s, fecha_nacimiento = %s, estado_civil = %s, sexo = %s, id_sede = %s
                WHERE id_feligres = %s
            """, (dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede, id_feligres))
        conexion.commit()
    except Exception as e:
        print(f"Error al actualizar feligrés: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def eliminar_feligres(id_feligres):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM feligres WHERE id_feligres = %s", (id_feligres,))
        conexion.commit()
    except Exception as e:
        print(f"Error al eliminar feligres: {e}")
        conexion.rollback()
    finally:
        conexion.close()

def verificarcuentaFeligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, token, contraseña, id_sede, estado):
    conexion = obtener_conexion()
    valor = 0
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT * FROM feligres WHERE dni = %s", (dni,))
            filas = cursor.fetchone()

            if filas:
                print("El usuario ya existe.")
                valor = 0  # Indica que el usuario ya existe
            else:
                cursor.execute("""
                INSERT INTO feligres (dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede))
                id_feligres = cursor.lastrowid
                
                password = sha256(contraseña.encode('utf-8')).hexdigest()
                
                cursor.execute("""
                INSERT INTO cuenta (id_feligres, estado, token, contraseña)
                VALUES (%s, %s, %s, %s)
                """, (id_feligres, estado, token, password))
                
                print("Usuario registrado con éxito.")
                valor = 1  # Indica que se registró exitosamente
        conexion.commit()
    except Exception as e:
        print(f"Error al verificar o registrar el feligrés: {e}")
    finally:
        conexion.close()
    
    return valor

def iniciosesion(dni, contraseña):
    conexion = obtener_conexion()
    valor = 0
    contraseña = sha256(contraseña.encode('utf-8')).hexdigest()
    print(contraseña)
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT
                    CASE 
                        WHEN EXISTS (SELECT 1 FROM ministro WHERE contraseña = %s AND numero_documento = %s) THEN 1
                        WHEN EXISTS (SELECT 1 FROM cuenta WHERE dni = %s AND contraseña = %s) THEN 2
                        ELSE 0
                    END AS resultado;
            """, (contraseña, dni, dni, contraseña))
            
            resultado = cursor.fetchone()
            return resultado[0]
    except:
        return 0
    
def varificar_sessionFeligres(dni,token):
    conexion = obtener_conexion()
    valor = 0
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM feligres AS fe INNER JOIN cuenta AS cu ON fe.id_feligres = cu.id_feligres WHERE fe.dni = %s AND cu.token = %s
            """, (dni,token))
            resultado = cursor.fetchone()
            if  resultado:
                valor = 1

        return valor
    except:
        return valor


def actualizarTokenFeligres(dni, token):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # 1. Actualiza el token
            cursor.execute("""
                UPDATE feligres AS fe 
                INNER JOIN cuenta AS cu ON fe.id_feligres = cu.id_feligres 
                SET cu.token = %s 
                WHERE fe.dni = %s;
            """, (token, dni))
            conexion.commit()

            # 2. Obtiene el nombre y apellido del feligres
            cursor.execute("""
                SELECT fe.nombres
                FROM feligres AS fe 
                WHERE fe.dni = %s;
            """, (dni,))
            resultado = cursor.fetchone()
            
            if resultado:
                return resultado[0]  # Devuelve el resultado (nombres, apellidos)
            else:
                print("Feligres no encontrado.")
                return None  # Si no se encuentra el feligres

    except Exception as e:
        print(f"Error al actualizar feligrés: {e}")
        conexion.rollback()  # Revertir cambios si ocurre un error
        return None  # Devuelve None en caso de error

    finally:
        conexion.close()  # Cierra la conexión


def obtener_feligres_por_dni(dni):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede 
                FROM feligres 
                WHERE dni = %s
            """, (dni,))
            feligres = cursor.fetchone()
        return feligres
    except Exception as e:
        print(f"Error al obtener feligrés por id: {e}")
        return None
    finally:
        conexion.close()