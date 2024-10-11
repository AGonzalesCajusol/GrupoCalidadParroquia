from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion

# Controlador para listar las recaudaciones
def listar_recaudaciones():
    conexion = obtener_conexion()
    recaudaciones = []
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''SELECT re.id_recaudacion, se.nombre_sede, re.monto, tr.nombre_recaudacion, re.observacion, re.fecha, re.hora 
                              FROM recaudacion AS re 
                              LEFT JOIN sede AS se ON se.id_sede = re.id_sede 
                              LEFT JOIN tipo_recaudacion tr ON tr.id_tipo_recaudacion = re.id_tipo_recaudacion''')
            recaudaciones = cursor.fetchall()
    except Exception as e:
        flash(f"Error al obtener recaudaciones: {str(e)}", "danger")
    finally:
        conexion.close()
    
    return recaudaciones


# Controlador para agregar una nueva recaudación
def agregar_recaudacion():
    if request.method == 'POST':
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        observacion = request.form['observacion']
        fecha = request.form['fecha']
        hora = request.form['hora']
        
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO recaudacion (id_sede, monto, observacion, fecha, hora)
                    VALUES (%s, %s, %s, %s, %s)
                """, (id_sede, monto, observacion, fecha, hora))
            conexion.commit()
            flash('Recaudación registrada correctamente', "success")
        except Exception as e:
            conexion.rollback()
            flash(f"Error al registrar recaudación: {str(e)}", "danger")
        finally:
            conexion.close()

        return redirect(url_for('gestionar_recaudaciones'))


# Controlador para actualizar una recaudación existente
def actualizar_recaudacion():
    if request.method == 'POST':
        id_recaudacion = request.form['id_recaudacion']
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        observacion = request.form['observacion']
        fecha = request.form['fecha']
        hora = request.form['hora']
        
        conexion = obtener_conexion()
        try:
            with conexion.cursor() as cursor:
                cursor.execute("""
                    UPDATE recaudacion
                    SET id_sede = %s, monto = %s, observacion = %s, fecha = %s, hora = %s
                    WHERE id_recaudacion = %s
                """, (id_sede, monto, observacion, fecha, hora, id_recaudacion))
            conexion.commit()
            flash('Recaudación actualizada correctamente', "success")
        except Exception as e:
            conexion.rollback()
            flash(f"Error al actualizar recaudación: {str(e)}", "danger")
        finally:
            conexion.close()

        return redirect(url_for('gestionar_recaudaciones'))

# Controlador para eliminar una recaudación
def eliminar_recaudacion():
    if request.method == 'POST':
        id_recaudacion = request.form['id_recaudacion']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM recaudacion WHERE id_recaudacion = %s", (id_recaudacion,))
        conexion.commit()
        conexion.close()

        flash('Recaudación eliminada correctamente')
        return redirect(url_for('listar_recaudaciones'))