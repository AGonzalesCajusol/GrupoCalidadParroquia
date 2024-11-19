from flask import request, jsonify, redirect, url_for, render_template, flash
from bd import obtener_conexion

def obtener_intenciones():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    i.id_intencion,
                    i.nombre_intencion,
                    i.descripcion,
                    a.nombre_liturgia
                FROM intencion i
                JOIN actoliturgico a ON i.id_actoliturgico = a.id_actoliturgico
            """)
            intenciones = cursor.fetchall()
        return intenciones
    except Exception as e:
        print(f"Error al obtener intenciones: {e}")
        return []
    finally:
        conexion.close()

def insertar_intencion(nombre_intencion, descripcion, id_actoliturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO intencion (nombre_intencion, descripcion, id_actoliturgico)
                VALUES (%s, %s, %s)
            """, (nombre_intencion, descripcion, id_actoliturgico))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al insertar intención: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def actualizar_intencion(id_intencion, nombre_intencion, descripcion, id_actoliturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE intencion
                SET nombre_intencion = %s, descripcion = %s, id_actoliturgico = %s
                WHERE id_intencion = %s
            """, (nombre_intencion, descripcion, id_actoliturgico, id_intencion))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al actualizar intención: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()

def eliminar_intencion(id_intencion):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM intencion WHERE id_intencion = %s", (id_intencion,))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error al eliminar intención: {e}")
        conexion.rollback()
        return False
    finally:
        conexion.close()
