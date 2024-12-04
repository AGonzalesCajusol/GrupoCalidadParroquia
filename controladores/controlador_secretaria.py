from bd import obtener_conexion

def obtener_solicitudes_matrimonio(fecha_inicio=None, fecha_fin=None):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                SELECT 
                    s.id_solicitud,
                    c.fecha as fecha_matrimonio,
                    f1.nombres as nombre_novio,
                    f2.nombres as nombre_novia,
                    s.estado
                FROM solicitud s
                JOIN solicitud_feligres sf1 ON s.id_solicitud = sf1.id_solicitud AND sf1.rol = 'Novio'
                JOIN solicitud_feligres sf2 ON s.id_solicitud = sf2.id_solicitud AND sf2.rol = 'Novia'
                JOIN feligres f1 ON sf1.dni_feligres = f1.dni_feligres
                JOIN feligres f2 ON sf2.dni_feligres = f2.dni_feligres
                JOIN celebracion c ON s.id_celebracion = c.id_celebracion
                WHERE s.id_actoliturgico = 1  -- ID para matrimonio
            """
            params = []
            
            if fecha_inicio and fecha_fin:
                query += " AND c.fecha BETWEEN %s AND %s"
                params.extend([fecha_inicio, fecha_fin])
                
            query += " ORDER BY c.fecha DESC"
            
            cursor.execute(query, params)
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener solicitudes de matrimonio: {e}")
        return []
    finally:
        conexion.close() 