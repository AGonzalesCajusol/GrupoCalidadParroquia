from bd import obtener_conexion

def obtener_actosliturgicos():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('''
        SELECT 
            a1.id_liturgia, 
            a1.nombre_liturgia, 
            a2.nombre_liturgia AS nombre_prerequisito
        FROM 
            actoliturgico a1
        LEFT JOIN 
            actoliturgico a2 ON a1.id_prerequisito = a2.id_liturgia;
                ''')
    lista_actos = cursor.fetchall()
    conexion.close()
    return lista_actos