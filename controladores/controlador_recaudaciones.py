from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion

# Controlador para listar las recaudaciones
def listar_recaudaciones():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('''SELECT re.id_recaudacion, se.nombre_sede, re.monto, tr.nombre_recaudacion ,re.observacion , re.fecha, re.hora FROM recaudacion as re inner join sede as se
on se.id_sede = re.id_sede inner join tipo_recaudacion tr on 
tr.id_tipo_recaudacion = re.id_tipo_recaudacion''')
        recaudaciones = cursor.fetchall()
    conexion.close()
    return recaudaciones



# Controlador para agregar una nueva recaudación
def agregar_recaudacion():
    if request.method == 'POST':
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        descripcion = request.form['descripcion']
        fecha = request.form['fecha']
        hora = request.form['hora']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO recaudacion (id_sede, monto, descripcion, fecha, hora)
                VALUES (%s, %s, %s, %s, %s)
            """, (id_sede, monto, descripcion, fecha, hora))
        conexion.commit()
        conexion.close()

        flash('Recaudación registrada correctamente')
        return redirect(url_for('listar_recaudaciones'))

# Controlador para actualizar una recaudación existente
def actualizar_recaudacion():
    if request.method == 'POST':
        id_recaudacion = request.form['id_recaudacion']
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        descripcion = request.form['descripcion']
        fecha = request.form['fecha']
        hora = request.form['hora']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE recaudacion
                SET id_sede = %s, monto = %s, descripcion = %s, fecha = %s, hora = %s
                WHERE id_recaudacion = %s
            """, (id_sede, monto, descripcion, fecha, hora, id_recaudacion))
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