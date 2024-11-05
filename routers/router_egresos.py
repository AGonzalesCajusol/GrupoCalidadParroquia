from flask import render_template, request, redirect, url_for, flash
from bd import obtener_conexion  # Asegúrate de que esta función esté correctamente definida

from controladores.controlador_egresos import (
    listar_egresos,
    agregar_egreso,
    actualizar_egreso,
    eliminar_egreso
)

def registrar_rutas(app):
    # Ruta para gestionar los egresos
    @app.route('/gestionar_egresos', methods=['GET'])
    def gestionar_egresos():
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT e.id_egreso, s.nombre_sede AS nombre_sede, e.monto, e.descripcion, e.fecha, e.hora
                FROM egreso e
                JOIN sede s ON e.id_sede = s.id_sede
            """)
            egresos = cursor.fetchall()
        conexion.close()
        return render_template('egresos/gestionar_egresos.html', egresos=egresos)


    # Ruta para agregar un egreso
    @app.route('/insertar_egreso', methods=['POST'])
    def insertar_egreso():
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        descripcion = request.form['descripcion']
        fecha = request.form['fecha']
        hora = request.form['hora']

        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                INSERT INTO egreso (id_sede, monto, descripcion, fecha, hora)
                VALUES (%s, %s, %s, %s, %s)
            """, (id_sede, monto, descripcion, fecha, hora))
        conexion.commit()
        conexion.close()

        flash("Egreso registrado correctamente")
        return redirect(url_for('gestionar_egresos'))

    def obtener_sede_usuario(user_id):
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT s.id_sede, s.nombre_sede 
                FROM sede s 
                JOIN cuenta c ON s.id_sede = c.id_sede 
                WHERE c.id = %s
            """, (user_id,))
            sede = cursor.fetchone()
        conexion.close()
        return sede


    # Ruta para modificar un egreso
    @app.route('/actualizar_egreso', methods=['POST'])
    def actualizar_egreso():
        try:
            id_egreso = request.form['id_egreso']
            id_sede = request.form['id_sede']
            monto = request.form['monto']
            descripcion = request.form['descripcion']
            fecha = request.form['fecha']
            hora = request.form['hora']

            conexion = obtener_conexion()
            with conexion.cursor() as cursor:
                # Verificar si el id_sede existe
                cursor.execute("SELECT COUNT(*) FROM sede WHERE id_sede = %s", (id_sede,))
                sede_existe = cursor.fetchone()[0]

                if sede_existe:
                    # Actualizar el egreso si la sede existe
                    cursor.execute(
                        """
                        UPDATE egreso 
                        SET id_sede = %s, monto = %s, descripcion = %s, fecha = %s, hora = %s
                        WHERE id_egreso = %s
                        """,
                        (id_sede, monto, descripcion, fecha, hora, id_egreso)
                    )
                    conexion.commit()
                    flash("Egreso actualizado correctamente")
                else:
                    flash(f"Error: El id_sede {id_sede} no existe.", "error")

            conexion.close()
            return redirect(url_for('gestionar_egresos'))

        except Exception as e:
            conexion.rollback()  # Revertir cambios si ocurre un error
            flash(f"Ocurrió un error al actualizar el egreso: {str(e)}", "error")
            return redirect(url_for('gestionar_egresos'))

    def mostrar_formulario_agregar():
        user_id = request.cookies.get('user_id')  # O utiliza 'session' si estás utilizando sesiones
        sede = obtener_sede_usuario(user_id) if user_id else None

        # Obtenemos todas las sedes para la lista desplegable si es necesario
        #sedes = obtener_todas_las_sedes()

        return render_template('egresos/gestionar_egresos.html', sede=sede, sedes=sedes)


    # Ruta para eliminar un egreso
    @app.route('/eliminar_egreso', methods=['POST'])
    def eliminar_egreso():
        id_egreso = request.form['id_egreso']

        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute("DELETE FROM egreso WHERE id_egreso = %s", (id_egreso,))
        conexion.commit()
        conexion.close()

        flash("Egreso eliminado correctamente")
        return redirect(url_for('gestionar_egresos'))
