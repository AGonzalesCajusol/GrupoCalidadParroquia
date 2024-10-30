from datetime import datetime
from flask import request, redirect, url_for, render_template, flash
from bd import obtener_conexion

# Controlador para listar los egresos
def listar_egresos():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        # Obtener egresos con el nombre de la sede
        cursor.execute("""
            SELECT e.id_egreso, s.nombre_sede AS nombre_sede, e.monto, e.descripcion, e.fecha, e.hora
            FROM egresos e
            JOIN sedes s ON e.id_sede = s.id_sede
        """)
        egresos = cursor.fetchall()

        # Obtener la lista de sedes para el formulario
        cursor.execute("SELECT id_sede, nombre_sede FROM sedes")
        sedes = cursor.fetchall()

    conexion.close()
    return render_template('egresos/gestionar_egresos.html', egresos=egresos, sedes=sedes)


# Controlador para agregar un nuevo egreso
def agregar_egreso():
    if request.method == 'POST':
        id_sede = request.form['id_sede']
        monto = request.form['monto']
        descripcion = request.form['descripcion']
        
        # Obtener la fecha y la hora actuales automáticamente
        fecha = datetime.now().strftime('%Y-%m-%d')
        hora = datetime.now().strftime('%H:%M:%S')

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

def obtener_id_sede_por_nombre(nombre_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Ejecuta la consulta para obtener el ID en base al nombre de la sede
            cursor.execute("SELECT id_sede FROM sede WHERE nombre_sede = %s", (nombre_sede,))
            resultado = cursor.fetchone()
            if resultado:
                return resultado[0]  # Devuelve el id_sede
            else:
                return None  # Retorna None si no encuentra el nombre de la sede
    except Exception as e:
        print(f"Error al obtener el ID de la sede: {e}")
        return None
    finally:
        conexion.close
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
