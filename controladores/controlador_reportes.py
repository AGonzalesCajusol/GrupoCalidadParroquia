from bd import obtener_conexion

def obtener_bautizos_aptos(fecha_inicio=None, fecha_fin=None):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                SELECT 
                    c.fecha as fecha_bautizo,
                    f.nombres as nombre_bautizado,
                    f.dni as dni_bautizado,
                    s.estado,
                    s.id_solicitud
                FROM solicitud s
                JOIN solicitud_feligres sf ON s.id_solicitud = sf.id_solicitud
                JOIN feligres f ON sf.dni_feligres = f.dni
                JOIN celebracion c ON s.id_celebracion = c.id_celebracion
                WHERE s.id_actoliturgico = 2
                AND s.estado = 'A'
            """
            params = []
            
            if fecha_inicio and fecha_fin:
                query += " AND c.fecha BETWEEN %s AND %s"
                params.extend([fecha_inicio, fecha_fin])
            
            query += " ORDER BY c.fecha DESC"
            
            cursor.execute(query, params)
            bautizos = cursor.fetchall()
            
            # Convertir los resultados y transformar el estado
            lista_bautizos = []
            for bautizo in bautizos:
                estado_mostrar = 'Apto' if bautizo[3] == 'A' else bautizo[3]
                lista_bautizos.append({
                    'fecha_bautizo': bautizo[0],
                    'nombre_bautizado': bautizo[1],
                    'dni_bautizado': bautizo[2],
                    'estado': estado_mostrar,
                    'id_solicitud': bautizo[4]
                })
            return lista_bautizos
            
    except Exception as e:
        print(f"Error al obtener bautizos aptos: {e}")
        return []
    finally:
        conexion.close() 