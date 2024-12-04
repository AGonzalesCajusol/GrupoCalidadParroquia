from bd import obtener_conexion

def obtener_estadisticas_general():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    al.nombre_liturgia,
                    COUNT(c.id_celebracion) as total,
                    ROUND((COUNT(c.id_celebracion) * 100.0) / 
                        NULLIF((SELECT COUNT(*) FROM celebracion WHERE estado = 'C'), 0)
                    , 2) as porcentaje
                FROM actoliturgico al
                LEFT JOIN celebracion c ON al.id_actoliturgico = c.id_actoliturgico 
                    AND c.estado = 'C'
                WHERE al.es_sacramento = 'S'
                GROUP BY al.nombre_liturgia
            """)
            resultados = cursor.fetchall()
            # Convertir a lista de diccionarios para JSON
            return [
                {
                    'nombre_liturgia': row[0],
                    'total': int(row[1]),
                    'porcentaje': float(row[2] if row[2] is not None else 0)
                }
                for row in resultados
            ]
    except Exception as e:
        print(f"Error al obtener estadísticas generales: {e}")
        return []
    finally:
        conexion.close()

def obtener_estadisticas_filtradas(año, mes=None):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            params = []
            query = """
                SELECT 
                    al.nombre_liturgia,
                    COUNT(c.id_celebracion) as total,
                    ROUND((COUNT(c.id_celebracion) * 100.0) / 
                        NULLIF((
                            SELECT COUNT(*) FROM celebracion 
                            WHERE estado = 'C'
                            AND YEAR(fecha) = %s
            """
            params.append(año)

            if mes:
                query += " AND MONTH(fecha) = %s"
                params.append(mes)
            
            query += """
                    ), 0), 2) as porcentaje
                FROM actoliturgico al
                LEFT JOIN celebracion c ON al.id_actoliturgico = c.id_actoliturgico 
                    AND c.estado = 'C'
                    AND YEAR(c.fecha) = %s
            """
            params.append(año)

            if mes:
                query += " AND MONTH(c.fecha) = %s"
                params.append(mes)

            query += """
                WHERE al.es_sacramento = 'S'
                GROUP BY al.nombre_liturgia
            """

            cursor.execute(query, params)
            resultados = cursor.fetchall()
            # Convertir a lista de diccionarios para JSON
            return [
                {
                    'nombre_liturgia': row[0],
                    'total': int(row[1]),
                    'porcentaje': float(row[2] if row[2] is not None else 0)
                }
                for row in resultados
            ]
    except Exception as e:
        print(f"Error al obtener estadísticas filtradas: {e}")
        return []
    finally:
        conexion.close()

def obtener_años_disponibles():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT YEAR(fecha) as año
                FROM celebracion
                WHERE estado = 'C'
                ORDER BY año DESC
            """)
            resultados = cursor.fetchall()
            return [año[0] for año in resultados]
    except Exception as e:
        print(f"Error al obtener años disponibles: {e}")
        return []
    finally:
        conexion.close() 