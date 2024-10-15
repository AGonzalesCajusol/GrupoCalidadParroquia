from bd import obtener_conexion

def insertar_feligres(dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO Feligres (dni, apellidos, nombres, fecha_nacimiento, estado_civil, sexo, id_sede)
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
                FROM Feligres f
                INNER JOIN Sede s ON f.id_sede = s.id_sede
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
                FROM Feligres 
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
                UPDATE Feligres 
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
            cursor.execute("DELETE FROM Feligres WHERE id_feligres = %s", (id_feligres,))
        conexion.commit()
    except Exception as e:
        print(f"Error al eliminar feligrés: {e}")
        conexion.rollback()
    finally:
        conexion.close()
