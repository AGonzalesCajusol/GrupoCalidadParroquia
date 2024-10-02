from flask import render_template, request, redirect, url_for, flash
from bd import obtener_conexion  # Asegúrate de que esta función exista
import controladores.controlador_recaudaciones as ccr

from controladores.controlador_recaudaciones import (
    listar_recaudaciones,
    agregar_recaudacion,
    actualizar_recaudacion,
    eliminar_recaudacion
)

def registrar_rutas(app):
        # Ruta para gestionar las recaudaciones
    @app.route('/gestionar_recaudaciones', methods=['GET'])
    def gestionar_recaudaciones():
        lista_recaudaciones = ccr.listar_recaudaciones()
        return render_template('tipo_financiero/gestionar_recaudaciones.html', recaudaciones=lista_recaudaciones)

    # Ruta para agregar recaudación
    @app.route('/insertar_recaudacion', methods=['POST'])
    def insertar_recaudacion():
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        descripcion = request.form['observacion']
        fecha = request.form['fecha']
        hora = request.form['hora']
        
        flash("Recaudación registrada correctamente")
        return redirect(url_for('gestionar_recaudaciones'))

    # Ruta para modificar recaudación
    @app.route('/actualizar_recaudacion', methods=['POST'])
    def actualizar_recaudacion():
        id_recaudacion = request.form['id_recaudacion']
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        observacion = request.form['observacion']
        fecha = request.form['fecha']
        hora = request.form['hora']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                UPDATE recaudacion 
                SET id_sede = %s, monto = %s, observacion = %s, fecha = %s, hora = %s
                WHERE id_recaudacion = %s
            """, (id_sede, monto, observacion, fecha, hora, id_recaudacion))
        conexion.commit()
        conexion.close()
        
        flash("Recaudación actualizada correctamente")
        return redirect(url_for('gestionar_recaudaciones'))

    # Ruta para eliminar recaudación
    @app.route('/eliminar_recaudacion', methods=['POST'])
    def eliminar_recaudacion():
        id_recaudacion = request.form['id_recaudacion']
        
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM recaudacion WHERE id_recaudacion = %s", (id_recaudacion,))
        conexion.commit()
        conexion.close()
        
        flash("Recaudación eliminada correctamente")
        return redirect(url_for('gestionar_recaudaciones'))
