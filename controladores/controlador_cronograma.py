from bd import obtener_conexion

def obtener_id_sede_por_nombre(nombre_sede):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        sql = "SELECT id_sede FROM sede WHERE nombre_sede = %s"
        cursor.execute(sql, (nombre_sede,))
        result = cursor.fetchone()
    conexion.close()
    return result[0] if result else None

def obtener_cronograma_actividades(id_sede):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        query = """
        SELECT 
            c.fecha AS fecha_inicio,
            c.hora_inicio,
            c.fecha AS fecha_fin,
            c.hora_fin,
            a.nombre_liturgia AS actividad
        FROM celebracion c
        JOIN actoliturgico a ON c.id_actoliturgico = a.id_actoliturgico
        WHERE c.id_sede = %s
        ORDER BY c.fecha, c.hora_inicio
        """
        cursor.execute(query, (id_sede,))
        actividades = cursor.fetchall()
    conexion.close()
    return actividades
