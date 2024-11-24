from bd import obtener_conexion

def obtener_celebraciones_crud():
    """Obtiene todas las celebraciones desde la base de datos."""
    conexion = obtener_conexion()
    celebraciones = []
    try:
        with conexion.cursor() as cursor:
            query = """
                SELECT 
                    cele.id_celebracion, 
                    cele.fecha, 
                    cele.hora_inicio, 
                    cele.hora_fin, 
                    cele.estado, 
                    sed.id_sede, 
                    sed.nombre_sede, 
                    act.id_actoliturgico, 
                    act.nombre_liturgia
                FROM celebracion cele
                INNER JOIN sede sed ON sed.id_sede = cele.id_sede
                INNER JOIN actoliturgico act ON act.id_actoliturgico = cele.id_actoliturgico
            """
            cursor.execute(query)
            celebraciones = cursor.fetchall()
    finally:
        conexion.close()
    
    return [
        {
            "id_celebracion": fila[0],
            "fecha": str(fila[1]),
            "hora_inicio": str(fila[2]),
            "hora_fin": str(fila[3]),
            "estado": fila[4],
            "id_sede": fila[5],       
            "nombre_sede": fila[6],   
            "id_actoliturgico": fila[7],
            "nombre_actoliturgico": fila[8]
        } for fila in celebraciones
    ]




def insertar_celebracion_crud(fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                INSERT INTO celebracion (fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico))
        conexion.commit()
    finally:
        conexion.close()



def eliminar_celebracion_crud(id_celebracion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = "DELETE FROM celebracion WHERE id_celebracion = %s"
            cursor.execute(query, (id_celebracion,))
        conexion.commit()
        return {"success": True, "message": "Celebración eliminada correctamente"}
    except Exception as e:
        # Log del error para depuración
        print(f"Error al eliminar celebración: {e}")

        # Manejo de errores controlados
        if "1451" in str(e):  # Código de error de clave foránea (MySQL)
            return {
                "success": False,
                "message": "No se puede eliminar la celebración porque tiene registros asociados"
            }
        else:
            return {
                "success": False,
                "message": "Ha ocurrido un error inesperado al intentar eliminar la celebración"
            }
    finally:
        conexion.close()

def editar_celebracion_crud(id_celebracion, fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = """
                UPDATE celebracion
                SET fecha = %s, hora_inicio = %s, hora_fin = %s, estado = %s, id_sede = %s, id_actoliturgico = %s
                WHERE id_celebracion = %s
            """
            cursor.execute(query, (fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico, id_celebracion))
        conexion.commit()
    finally:
        conexion.close()

def cambiar_estado_celebracion(id_celebracion, nuevo_estado):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            query = "UPDATE celebracion SET estado = %s WHERE id_celebracion = %s"
            cursor.execute(query, (nuevo_estado, id_celebracion))
        conexion.commit()
    finally:
        conexion.close()
