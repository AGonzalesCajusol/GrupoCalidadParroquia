from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion

# Controlador para listar los egresos
def listar_egresos():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT * FROM egresos")
        egresos = cursor.fetchall()
    conexion.close()
    return render_template('egresos/gestionar_egresos.html', egresos=egresos)

# Controlador para agregar un nuevo egreso
def agregar_egreso():
    if request.method == 'POST':
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        descripcion = request.form['descripcion']
        fecha = request.form['fecha']
        hora = request.form['hora']

        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO egresos (id_sede, monto, descripcion, fecha, hora)
                VALUES (%s, %s, %s, %s, %s)
            """, (id_sede, monto, descripcion, fecha, hora))
        conexion.commit()
        conexion.close()

        flash('Egreso registrado correctamente')
        return redirect(url_for('listar_egresos'))

# Controlador para actualizar un egreso existente
def actualizar_egreso():
    if request.method == 'POST':
        id_egreso = request.form['id_egreso']
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        descripcion = request.form['descripcion']
        fecha = request.form['fecha']
        hora = request.form['hora']

        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE egresos
                SET id_sede = %s, monto = %s, descripcion = %s, fecha = %s, hora = %s
                WHERE id_egreso = %s
            """, (id_sede, monto, descripcion, fecha, hora, id_egreso))
        conexion.commit()
        conexion.close()

        flash('Egreso actualizado correctamente')
        return redirect(url_for('listar_egresos'))

# Controlador para eliminar un egreso
def eliminar_egreso():
    if request.method == 'POST':
        id_egreso = request.form['id_egreso']

        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM egresos WHERE id_egreso = %s", (id_egreso,))
        conexion.commit()
        conexion.close()

        flash('Egreso eliminado correctamente')
        return redirect(url_for('listar_egresos'))
