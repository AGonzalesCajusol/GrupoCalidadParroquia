from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion
from datetime import datetime

# Controlador para listar las recaudaciones
# Controlador para listar las recaudaciones
def listar_recaudaciones():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("""
            SELECT recaudacion.id_recaudacion, sede.nombre_sede, tipo_recaudacion.nombre_recaudacion, 
            recaudacion.monto, recaudacion.fecha, recaudacion.hora, recaudacion.observacion
            FROM recaudacion
            LEFT JOIN sede ON recaudacion.id_sede = sede.id_sede
            LEFT JOIN tipo_recaudacion ON recaudacion.id_tipo_recaudacion = tipo_recaudacion.id_tipo_recaudacion
        """)
        recaudaciones = cursor.fetchall()
    conexion.close()
    return render_template('tipo_financiero/gestionar_recaudaciones.html', recaudaciones=recaudaciones)

# Controlador para agregar una nueva recaudación
def agregar_recaudacion():
    if request.method == 'POST':
        id_tipo_recaudacion = request.form['id_tipo_recaudacion']
        monto = request.form.get('monto', None)
        observacion = request.form['observacion']
        fecha = datetime.now().strftime("%Y-%m-%d")
        hora = datetime.now().strftime("%H:%M:%S")
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO recaudacion (id_sede, monto, observacion, fecha, hora, id_tipo_recaudacion)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (1, monto, observacion, fecha, hora, id_tipo_recaudacion))  # Se asume una sede temporal
        conexion.commit()
        conexion.close()

        flash('Recaudación registrada correctamente')
        return redirect(url_for('listar_recaudaciones'))

# Controlador para actualizar una recaudación existente
def actualizar_recaudacion():
    if request.method == 'POST':
        id_recaudacion = request.form['id_recaudacion']
        id_tipo_recaudacion = request.form['id_tipo_recaudacion']
        monto = request.form.get('monto', None)
        observacion = request.form['observacion']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE recaudacion
                SET id_tipo_recaudacion = %s, monto = %s, observacion = %s
                WHERE id_recaudacion = %s
            """, (id_tipo_recaudacion, monto, observacion, id_recaudacion))
        conexion.commit()
        conexion.close()

        flash('Recaudación actualizada correctamente')
        return redirect(url_for('listar_recaudaciones'))

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
