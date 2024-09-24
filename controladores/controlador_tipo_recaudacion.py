from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion

# Controlador para listar los tipos de recaudación
def listar_tipo_recaudacion():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT * FROM tipo_recaudacion")
        tipos_recaudacion = cursor.fetchall()
    conexion.close()
    return render_template('tipo_financiero/gestionar_tipo_recaudacion.html', tipos_recaudacion=tipos_recaudacion)

# Controlador para agregar un nuevo tipo de recaudación
def agregar_tipo_recaudacion():
    if request.method == 'POST':
        nombre_tipo = request.form['nombre_tipo']
        monetario = 1 if 'monetario' in request.form else 0
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("INSERT INTO tipo_recaudacion (nombre_recaudacion, monetario) VALUES (%s, %s)", (nombre_tipo, monetario))
        conexion.commit()
        conexion.close()

        flash('Tipo de recaudación registrado correctamente')
        return redirect(url_for('listar_tipo_recaudacion'))

# Controlador para actualizar un tipo de recaudación
def actualizar_tipo_recaudacion():
    if request.method == 'POST':
        id_tipo_recaudacion = request.form['id_tipo_recaudacion']
        nombre_tipo = request.form['nombre_tipo']
        monetario = 1 if 'monetario' in request.form else 0
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE tipo_recaudacion
                SET nombre_recaudacion = %s, monetario = %s
                WHERE id_tipo_recaudacion = %s
            """, (nombre_tipo, monetario, id_tipo_recaudacion))
        conexion.commit()
        conexion.close()

        flash('Tipo de recaudación actualizado correctamente')
        return redirect(url_for('listar_tipo_recaudacion'))

# Controlador para eliminar un tipo de recaudación
def eliminar_tipo_recaudacion():
    if request.method == 'POST':
        id_tipo_recaudacion = request.form['id_tipo_recaudacion']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM tipo_recaudacion WHERE id_tipo_recaudacion = %s", (id_tipo_recaudacion,))
        conexion.commit()
        conexion.close()

        flash('Tipo de recaudación eliminado correctamente')
        return redirect(url_for('listar_tipo_recaudacion'))
