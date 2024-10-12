from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion

# Listar todas las recaudaciones
def listar_recaudaciones():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''SELECT re.id_recaudacion, se.nombre_sede, re.monto, tr.nombre_recaudacion, re.observacion, re.fecha, re.hora 
                              FROM recaudacion AS re 
                              LEFT JOIN sede AS se ON se.id_sede = re.id_sede 
                              LEFT JOIN tipo_recaudacion tr ON tr.id_tipo_recaudacion = re.id_tipo_recaudacion''')
            return cursor.fetchall()
    except Exception as e:
        flash(f"Error al obtener recaudaciones: {str(e)}", "danger")
    finally:
        conexion.close()

# Agregar una nueva recaudación
def agregar_recaudacion():
    if request.method == 'POST':
        id_sede, monto, observacion, fecha, hora = request.form['id_sede'], request.form['monto'], request.form['observacion'], request.form['fecha'], request.form['hora']
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                cursor.execute("INSERT INTO recaudacion (id_sede, monto, observacion, fecha, hora) VALUES (%s, %s, %s, %s, %s)", 
                               (id_sede, monto, observacion, fecha, hora))
            conexion.commit()
            flash('Recaudación registrada correctamente', "success")
        except Exception as e:
            conexion.rollback()
            flash(f"Error al registrar recaudación: {str(e)}", "danger")
        finally:
            conexion.close()
        return redirect(url_for('gestionar_recaudaciones'))

# Actualizar una recaudación existente
def actualizar_recaudacion():
    if request.method == 'POST':
        id_recaudacion = request.form['id_recaudacion']
        id_sede, monto, observacion, fecha, hora = request.form['id_sede'], request.form['monto'], request.form['observacion'], request.form['fecha'], request.form['hora']
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                cursor.execute("""UPDATE recaudacion SET id_sede = %s, monto = %s, observacion = %s, fecha = %s, hora = %s WHERE id_recaudacion = %s""", 
                               (id_sede, monto, observacion, fecha, hora, id_recaudacion))
            conexion.commit()
            flash('Recaudación actualizada correctamente', "success")
        except Exception as e:
            conexion.rollback()
            flash(f"Error al actualizar recaudación: {str(e)}", "danger")
        finally:
            conexion.close()
        return redirect(url_for('gestionar_recaudaciones'))

# Eliminar una recaudación
def eliminar_recaudacion():
    if request.method == 'POST':
        id_recaudacion = request.form['id_recaudacion']
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                cursor.execute("DELETE FROM recaudacion WHERE id_recaudacion = %s", (id_recaudacion,))
            conexion.commit()
            flash('Recaudación eliminada correctamente')
        finally:
            conexion.close()
        return redirect(url_for('gestionar_recaudaciones'))



####NO BORRAR####
# Obtener recaudaciones por año
def obtener_recaudaciones_por_año(año):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT 
                r.id_recaudacion AS id,
                r.fecha,
                r.monto,
                r.observacion,
                s.nombre_sede AS sede,
                t.nombre_recaudacion AS tipo_recaudacion,
                CASE
                    WHEN t.tipo = 1 THEN 'Monetaria'
                    WHEN t.tipo = 0 THEN 'No Monetaria'
                    ELSE 'Desconocido'
                END AS tipo
            FROM 
                recaudacion r
            JOIN 
                sede s ON r.id_sede = s.id_sede
            JOIN 
                tipo_recaudacion t ON r.id_tipo_recaudacion = t.id_tipo_recaudacion
            WHERE 
                YEAR(r.fecha) = %s
        """, (año,))
        recaudaciones = cursor.fetchall()
    
    return recaudaciones


def obtener_rango_de_años():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT MIN(YEAR(fecha)) as año_minimo, MAX(YEAR(fecha)) as año_maximo
            FROM recaudacion;
        """)
        rango_años = cursor.fetchone()
        
    # Verifica que el rango de años sea válido
    if rango_años:
        año_minimo, año_maximo = rango_años
        return list(range(año_minimo, año_maximo + 1))
    return []


