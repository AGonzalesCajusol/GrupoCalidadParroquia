from flask import jsonify
from bd import obtener_conexion


def charlas_acto(id_acto):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('''
            select pr.id_programacion, tm.descripcion, pr.fecha , pr.hora_inicio, pr.hora_fin from programacion_charlas as pr inner join tema as tm
            on pr.id_tema = tm.id_tema
            where pr.id_charla = (select id_charla from charlas
            inner join actoliturgico as al1
            on charlas.id_actoliturgico = al1.id_actoliturgico
            where current_date < charlas.fecha_inicio and al1.id_actoliturgico = %s
            order by charlas.fecha_inicio asc
            limit 1)
                ''', (id_acto,))
        charlas = cursor.fetchall()
    conexion.close()
    return charlas 

def verificar_existencia_programacion(id_charla):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Consultar si existen registros en programacion_charlas para el id_charla
            cursor.execute("""
                SELECT COUNT(*) FROM programacion_charlas
                WHERE id_charla = %s
            """, (id_charla,))
            resultado = cursor.fetchone()
            
            # Si existe al menos un registro, devolvemos True
            existe_programacion = resultado[0] > 0
            return {"existe_programacion": existe_programacion}
    except Exception as e:
        print(f"Error al verificar existencia de programación: {e}")
        return {"error": str(e)}
    finally:
        conexion.close()

def generar_programacion_automatica(id_actoliturgico, fecha_inicio, id_charla, id_ministro, id_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Llamada al procedimiento almacenado con los cinco parámetros
            cursor.callproc("GenerarProgramacionCharlas", [id_actoliturgico, fecha_inicio, id_charla, id_ministro, id_sede])
        conexion.commit()
        return {"success": True, "message": "Programación generada automáticamente"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al generar programación automática: {e}")
        return {"success": False, "error": "Error al generar la programación automática"}
    finally:
        conexion.close()

def obtener_programacion_por_charla(id_charla):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    p.id_programacion, 
                    t.descripcion AS tema,
                    p.fecha, 
                    p.hora_inicio, 
                    p.hora_fin, 
                    p.estado,
                    m.nombre_ministro, 
                    s.nombre_sede
                FROM 
                    programacion_charlas p
                JOIN 
                    tema t ON p.id_tema = t.id_tema
                LEFT JOIN 
                    ministro m ON p.id_ministro = m.id_ministro
                LEFT JOIN 
                    sede s ON p.id_sede = s.id_sede
                WHERE 
                    p.id_charla = %s
            """, (id_charla,))
            programacion = cursor.fetchall()

            # Formatear los datos en una estructura serializable
            programacion_serializable = [
                {
                    "id_programacion": prog[0],
                    "tema": prog[1],
                    "fecha": str(prog[2]),
                    "hora_inicio": str(prog[3]),
                    "hora_fin": str(prog[4]),
                    "estado": "Realizado" if prog[5] == 'R' else "Pendiente",
                    "ministro": prog[6] or "Sin asignar",
                    "sede": prog[7] or "No especificada"
                }
                for prog in programacion
            ]
            return {"success": True, "programacion": programacion_serializable}
    except Exception as e:
        print(f"Error al obtener programación por charla: {e}")
        return {"success": False, "error": str(e)}
    finally:
        conexion.close()

def registrar_programacion_en_bloque(id_charla, programaciones):
    if not id_charla or not programaciones:
        return {"success": False, "error": "Datos incompletos"}
    
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            for prog in programaciones:
                id_programacion = prog.get("id_programacion")
                fecha = prog.get("fecha")
                hora_inicio = prog.get("hora_inicio")
                hora_fin = prog.get("hora_fin")
                estado = prog.get("estado")
                ministro = prog.get("ministro")
                sede = prog.get("sede")

                # Actualizar cada fila en programacion_charlas
                cursor.execute("""
                    UPDATE programacion_charlas
                    SET fecha = %s, hora_inicio = %s, hora_fin = %s, estado = %s, 
                        id_ministro = (SELECT id_ministro FROM ministro WHERE nombre_ministro = %s LIMIT 1), 
                        id_sede = (SELECT id_sede FROM sede WHERE nombre_sede = %s LIMIT 1)
                    WHERE id_programacion = %s
                """, (fecha, hora_inicio, hora_fin, estado, ministro, sede, id_programacion))
        
        conexion.commit()
        return {"success": True, "message": "Programación actualizada con éxito"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al registrar la programación: {e}")
        return {"success": False, "error": "Error al registrar la programación"}
    finally:
        conexion.close()

def obtener_ids_por_dni(dni):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT id_ministro, id_sede
                FROM ministro
                WHERE numero_documento = %s
            """, (dni,))
            resultado = cursor.fetchone()
            
            if resultado:
                return {"success": True, "id_ministro": resultado[0], "id_sede": resultado[1]}
            else:
                return {"success": False, "error": "Ministro no encontrado"}
    except Exception as e:
        print(f"Error al obtener IDs por DNI: {e}")
        return {"success": False, "error": "Error al obtener IDs"}
    finally:
        conexion.close()

def actualizar_programacion(id_programacion, tema, fecha, hora_inicio, hora_fin, estado, ministro, sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE programacion_charlas
                SET 
                    fecha = %s, 
                    hora_inicio = %s, 
                    hora_fin = %s, 
                    estado = %s, 
                    id_ministro = (SELECT id_ministro FROM ministro WHERE nombre_ministro = %s LIMIT 1), 
                    id_sede = (SELECT id_sede FROM sede WHERE nombre_sede = %s LIMIT 1)
                WHERE id_programacion = %s
            """, (fecha, hora_inicio, hora_fin, estado, ministro, sede, id_programacion))
        conexion.commit()
        return {"success": True, "message": "Programación actualizada con éxito"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al actualizar programación: {e}")
        return {"success": False, "error": "Error al actualizar la programación"}
    finally:
        conexion.close()

def dar_de_baja_programacion(id_programacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE programacion_charlas
                SET estado = 'I'
                WHERE id_programacion = %s
            """, (id_programacion,))
        conexion.commit()
        return {"success": True, "message": "Programación dada de baja con éxito"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al dar de baja la programación: {e}")
        return {"success": False, "error": "Error al dar de baja la programación"}
    finally:
        conexion.close()

def eliminar_programacion(id_programacion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                DELETE FROM programacion_charlas
                WHERE id_programacion = %s
            """, (id_programacion,))
        conexion.commit()
        return {"success": True, "message": "Programación eliminada con éxito"}
    except Exception as e:
        conexion.rollback()
        print(f"Error al eliminar la programación: {e}")
        return {"success": False, "error": "Error al eliminar la programación"}
    finally:
        conexion.close()
