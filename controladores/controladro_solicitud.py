from bd import obtener_conexion
from . import controlador_sede as csede
from . import controlador_actosliturgicos as cactos
import os
from datetime import datetime, timedelta


def charlas_rangoaño(acto_liturgico):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                select ch.id_charla, CONCAT(al.nombre_liturgia, ' - ', ch.fecha_inicio) AS liturgia_fecha   from charlas as ch inner join actoliturgico as al
                on al.id_actoliturgico = ch.id_actoliturgico where al.id_actoliturgico = %s and ch.fecha_inicio > current_date()
            """, (acto_liturgico))
        return cursor.fetchall()
    except Exception as e:
        return "Error"
    finally:
        conexion.close() 

def solicitudes(sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT sl.id_solicitud, sd.id_sede , sd.nombre_sede ,fl.dni , al.nombre_liturgia  ,CONCAT(fl.nombres, ' ', fl.apellidos) as 'nombres' 
                FROM solicitud AS sl
                INNER JOIN feligres AS fl ON fl.dni = sl.dni_feligres inner join sede as sd
                on sd.id_sede = sl.id_sede  inner join celebracion as cl
                on cl.id_celebracion = sl.id_celebracion inner join actoliturgico as al
                on al.id_actoliturgico = cl.id_actoliturgico
                where sd.nombre_sede = %s order by sl.id_solicitud asc
            """, (sede))
        return cursor.fetchall()
    except Exception as e:
        return "Error"
    finally:
        conexion.close() 


def insertar_solicitudMatrimonio(requisitos_data):
    try:
        conexion = obtener_conexion()

        # Cambia la forma de acceder a f_matrimonio usando la notación de diccionario
        fecha_hora = requisitos_data['f_matrimonio']  # Cambiado a la notación de clave
        fecha_hora_formateada = datetime.strptime(fecha_hora, '%Y-%m-%dT%H:%M')

        # Extraer fecha y hora
        fecha = fecha_hora_formateada.date()
        hora_inicio = fecha_hora_formateada.time()
        hora_fin_objeto = fecha_hora_formateada + timedelta(hours=1)
        hora_fin = hora_fin_objeto.time()

        # Obtener ID de la sede
        id_sede = csede.obtener_id_sede_por_nombre(requisitos_data['sede'])  # Cambiado a la notación de clave

        # Aquí deberías agregar la lógica para insertar en la base de datos
        with conexion.cursor() as cursor:
            cursor.execute(
                "INSERT INTO celebracion (fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico) VALUES (%s, %s, %s, %s, %s, %s)",
                (fecha, hora_inicio, hora_fin, 'P', id_sede, requisitos_data['id_acto'])
            )
            id_celebracion = cursor.lastrowid
            cursor.execute(
                '''
                insert into solicitud(id_actoliturgico,id_sede,estado,id_celebracion,dni_feligres) values (%s,%s,%s,%s,%s)
                ''',(requisitos_data['id_acto'],id_sede,'P',id_celebracion,requisitos_data['dni_responsable'])
            )
            id_solicitud = cursor.lastrowid
            cursor.execute(
                '''
                    insert into solicitud_feligres (dni_feligres,id_solicitud,rol) values (%s,%s,%s) '''
                    ,(requisitos_data['dni_novio'],id_solicitud,'Novio')
            )
            cursor.execute(
                '''
                    insert into solicitud_feligres (dni_feligres,id_solicitud,rol) values (%s,%s,%s) '''
                    ,(requisitos_data['dni_novia'],id_solicitud,'Novia')
            )
            #Grabamos asistencias 
            #novio
            cursor.execute(
                '''
                    INSERT INTO asistencia (id_programacion, id_feligres, id_solicitud, estado)
                    SELECT pc.id_programacion, %s, %s, 'P'
                    FROM programacion_charlas AS pc
                    INNER JOIN charlas AS ch ON ch.id_charla = pc.id_charla
                    WHERE ch.id_charla = %s;
                '''
                    ,(requisitos_data['dni_novio'],id_solicitud,requisitos_data['charlas'])
            )
            cursor.execute(
                '''
                    INSERT INTO asistencia (id_programacion, id_feligres, id_solicitud, estado)
                    SELECT pc.id_programacion, %s, %s, 'P'
                    FROM programacion_charlas AS pc
                    INNER JOIN charlas AS ch ON ch.id_charla = pc.id_charla
                    WHERE ch.id_charla = %s;
                '''
                    ,(requisitos_data['dni_novia'],id_solicitud, requisitos_data['charlas'])
            )
            monto = cactos.monto_total('Matrimonio', requisitos_data['sede'], requisitos_data['dni_responsable'], requisitos_data['dni_novio'], requisitos_data['dni_novia'])
            print(monto)
            cursor.execute(
                '''
                INSERT INTO comprobante (fecha_hora, total, tipo_comprobante, forma_pago, id_solicitud, id_sede) 
                VALUES (CURRENT_DATE(), %s, %s, %s, %s, %s)
                ''',
                (monto['pf_sede']+monto['pf_acto'], 'Electrónico', requisitos_data['metodo'], id_solicitud, id_sede) 
            )
            if 'id_sedetraslado' in monto:
                cursor.execute(
                    '''
                    INSERT INTO comprobante (fecha_hora, total, tipo_comprobante, forma_pago, id_solicitud, id_sede) 
                    VALUES (CURRENT_DATE(), %s, %s, %s, %s, %s)
                    ''',
                    (monto['pf_traslado'], 'Electrónico', requisitos_data['metodo'], id_solicitud, monto['id_sedetraslado'])
            )
            #ahora falta insertar el nombre de las imagenes y sus estados
            requisitos = cactos.listar_requisitos(requisitos_data['id_acto'])
            directorio = 'static/archivos_usuario/'+ str(id_solicitud)
            print(f"Directorio donde se guardará la imagen: {directorio}")  # Imprimir para verificar

            if not os.path.exists(directorio):
                os.mkdir(directorio)

            for rq in requisitos:
                if rq[3] == "Imagen" :
                    archivo_imagen = requisitos_data[rq[7]] 
                    if archivo_imagen :
                        ruta_imagen = os.path.join(directorio,archivo_imagen.filename) 
                        try:
                            archivo_imagen.save(ruta_imagen)  # Guardar la imagen en el sistema de archivos
                            enlace_imagen = ruta_imagen  # Guarda la ruta de la imagen
                        except Exception as e:
                            print(f"Error al guardar la imagen: {e}")  # Imprime el error si ocurre
                            enlace_imagen = ""  # O maneja el error como consideres necesario
                    else:
                        enlace_imagen = ""
                else:
                    enlace_imagen = requisitos_data[rq[7]]

                cursor.execute(
                '''
                    insert into aprobacionrequisitos (id_solicitud,id_requisito,estado,enlace_imagen) 
                    values (%s,%s,%s,%s)
                '''
                ,(id_solicitud, rq[0],requisitos_data[rq[8]],enlace_imagen)
            )
            conexion.commit()
        return True
    except Exception as e:
        print(f"Error al insertar solicitud: {e}")  # Log del error para depuración
        return False

    finally:
        if conexion:
            conexion.close()  # Cierra la conexión si fue abierta