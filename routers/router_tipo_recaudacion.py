from flask import render_template, request, redirect, url_for, flash
from bd import obtener_conexion

from controladores.controlador_tipo_recaudacion import (
    listar_tipo_recaudacion,
    agregar_tipo_recaudacion,
    actualizar_tipo_recaudacion,
    eliminar_tipo_recaudacion
)

def registrar_rutas_tipo_recaudacion(app):
    # Ruta para gestionar los tipos de recaudación
    @app.route('/gestionar_tipo_recaudacion', methods=['GET'])
    def gestionar_tipo_recaudacion():
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("SELECT * FROM tipo_recaudacion")
            tipos_recaudacion = cursor.fetchall()
        conexion.close()
        return render_template('tipo_financiero/gestionar_tipo_recaudacion.html', tipos_recaudacion=tipos_recaudacion)

    # Ruta para agregar un nuevo tipo de recaudación
    @app.route('/insertar_tipo_recaudacion', methods=['POST'])
    def insertar_tipo_recaudacion():
        nombre_tipo = request.form['nombre_tipo']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("INSERT INTO tipo_recaudacion (nombre_recaudacion) VALUES (%s)", (nombre_tipo,))
        conexion.commit()
        conexion.close()
        
        flash("Tipo de recaudación registrado correctamente")
        return redirect(url_for('gestionar_tipo_recaudacion'))

    # Ruta para actualizar un tipo de recaudación existente
    @app.route('/actualizar_tipo_recaudacion', methods=['POST'])
    def actualizar_tipo_recaudacion():
        id_tipo_recaudacion = request.form['id_tipo_recaudacion']
        nombre_tipo = request.form['nombre_tipo']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE tipo_recaudacion
                SET nombre_recaudacion = %s
                WHERE id_tipo_recaudacion = %s
            """, (nombre_tipo, id_tipo_recaudacion))
        conexion.commit()
        conexion.close()
        
        flash("Tipo de recaudación actualizado correctamente")
        return redirect(url_for('gestionar_tipo_recaudacion'))

    # Ruta para eliminar un tipo de recaudación
    @app.route('/eliminar_tipo_recaudacion', methods=['POST'])
    def eliminar_tipo_recaudacion():
        id_tipo_recaudacion = request.form['id_tipo_recaudacion']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM tipo_recaudacion WHERE id_tipo_recaudacion = %s", (id_tipo_recaudacion,))
        conexion.commit()
        conexion.close()
        
        flash("Tipo de recaudación eliminado correctamente")
        return redirect(url_for('gestionar_tipo_recaudacion'))
