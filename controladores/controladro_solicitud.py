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

def verificar_fecha(fecha,sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            fecha = str(fecha)
            fecha= fecha.replace('T', ' ')
            print(fecha)
            cursor.execute("""
                SET @hora_inicio_usuario = %s;
            """, (fecha,))
            
            # Segundo SET para hora_fin_usuario (sumando 1:30 horas)
            cursor.execute("""
                SET @hora_fin_usuario = DATE_ADD(@hora_inicio_usuario, INTERVAL 1 HOUR);
            """)
            cursor.execute("""
                SET @hora_fin_usuario = DATE_ADD(@hora_fin_usuario, INTERVAL 30 MINUTE);
            """)
            
            # Consulta para verificar si hay conflicto de fechas y horas
            cursor.execute("""
                SELECT 1 AS conflicto  
                FROM celebracion AS ce
                INNER JOIN sede AS sd 
                    ON sd.id_sede = ce.id_sede
                WHERE sd.nombre_sede = %s
                AND (
                    @hora_inicio_usuario < CONCAT(ce.fecha, ' ', ce.hora_fin)
                    AND @hora_fin_usuario > CONCAT(ce.fecha, ' ', ce.hora_inicio)
                )
                LIMIT 1;
            """, (sede,))
            
            # Si se encuentra algún conflicto, devuelve 1
            if cursor.fetchone():
                return 1
            return 0
    except Exception as e:
        print("fallo")
        return 1
    finally:
        conexion.close() 

<<<<<<< HEAD
# def solicitudes(sede):
#     conexion = obtener_conexion()
#     try:
#         with conexion.cursor() as cursor:
#             cursor.execute("""
#                 SELECT sl.id_solicitud, sd.id_sede , sd.nombre_sede ,fl.dni , al.nombre_liturgia  ,CONCAT(fl.nombres, ' ', fl.apellidos) as 'nombres', sl.fecha_registro
#                 FROM solicitud AS sl
#                 INNER JOIN feligres AS fl ON fl.dni = sl.dni_feligres inner join sede as sd
#                 on sd.id_sede = sl.id_sede  inner join celebracion as cl
#                 on cl.id_celebracion = sl.id_celebracion inner join actoliturgico as al
#                 on al.id_actoliturgico = cl.id_actoliturgico
#                 where sd.nombre_sede = %s order by sl.id_solicitud asc
#             """, (sede))
#         return cursor.fetchall()
#     except Exception as e:
#         return "Error"
#     finally:
#         conexion.close() 
=======
def solicitudes(sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT sl.id_solicitud, sd.id_sede , sd.nombre_sede ,fl.dni , al.nombre_liturgia  ,CONCAT(fl.nombres, ' ', fl.apellidos) as 'nombres', sl.fecha_registro
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
>>>>>>> parent of 70241f3 (ccccccc)

def insertar_bautismo(requisitos_data):
    id_sede = csede.obtener_id_sede_por_nombre(requisitos_data['sedebau'])
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                insert into solicitud(id_actoliturgico,id_sede,estado,id_celebracion,dni_feligres, asistencia, fecha_registro) values (%s,%s,%s,%s,%s,0, CURRENT_DATE())
                ''',(requisitos_data['id_acto'],id_sede,'P',requisitos_data['id_charla'],requisitos_data['dni_tutor'])
            )
            id_solicitud = cursor.lastrowid

            print(id_solicitud)

            roles = ['Padrino', 'Madrina', 'Padre']
            dnis = [requisitos_data['dni_padrino'],requisitos_data['dni_madrina'],requisitos_data['dni_tutor']]

            #insertamos los implicados en ese acto como el padrino, madrina, padre
            for dni, rol in zip(dnis, roles):
                cursor.execute(
                    '''
                        insert into solicitud_feligres (dni_feligres,id_solicitud,rol) values (%s,%s,%s) '''
                        ,(dni,id_solicitud,rol)
                )
                print("ok")
 
            #grabamos las asistenicas de las 3 pesonas
            datos_celebracion = viww(requisitos_data['id_charla'])[0]
            dnis = [requisitos_data['dni_padrino'],requisitos_data['dni_madrina'],requisitos_data['dni_tutor']]

            for dni in dnis:
                cursor.execute(
                    '''
                    insert into asistencia(id_programacion,dni_feligres,id_solicitud,estado,fecha,hora_inicio,hora_fin) 
                    values (%s,%s,%s,0,%s,%s,%s)
                    ''',(datos_celebracion[4],dni,id_solicitud,datos_celebracion[1],datos_celebracion[2],datos_celebracion[3])
                )

            
            #registramos comprobantes

            monto = monto_butismo(requisitos_data['sedebau'])
            print(monto)

            cursor.execute(
                '''
                INSERT INTO comprobante (fecha_hora, total, tipo_comprobante, forma_pago, id_solicitud, id_sede) 
                VALUES (CURRENT_DATE(), %s, %s, %s, %s, %s)
                ''',
                (monto, 'Electrónico', requisitos_data['metodo'], id_solicitud, id_sede) 
            )


            #ahora falta insertar el nombre de las imagenes y sus estados
            requisitos = cactos.listar_requisitos(requisitos_data['id_acto'])

            directorio = 'static/archivos_usuario/'+ str(id_solicitud) +'/'
            print(f"Directorio donde se guardará la imagen: {directorio}")  # Imprimir para verificar

            if not os.path.exists(directorio):
                os.mkdir(directorio)

            for rq in requisitos:
                if rq[3] == "Imagen" :
                    archivo_imagen = requisitos_data[rq[7]] 
                    if archivo_imagen :
                        ruta_imagen = directorio + archivo_imagen.filename 
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
                ,(id_solicitud, rq[0],'V',enlace_imagen)
            )
            conexion.commit()

        return 1
    except Exception as e:
        print(f"Error: {e}")
        return 0
    finally:
        conexion.close()

def insertar_confirmacion(requisitos_data):
    id_sede = csede.obtener_id_sede_por_nombre(requisitos_data['sede'])
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                insert into solicitud(id_actoliturgico,id_sede,estado,id_celebracion,dni_feligres, asistencia, fecha_registro) values (%s,%s,%s,%s,%s,0, CURRENT_DATE())
                ''',(requisitos_data['id_acto'],id_sede,'P',requisitos_data['id_charla'],requisitos_data['dni_confirmado'])
            )
            id_solicitud = cursor.lastrowid

            print(id_solicitud)

            roles = ['confirmandos']
            dnis = [requisitos_data['dni_confirmado']]

            #insertamos los implicados en ese acto como el padrino, madrina, padre
            for dni, rol in zip(dnis, roles):
                cursor.execute(
                    '''
                        insert into solicitud_feligres (dni_feligres,id_solicitud,rol) values (%s,%s,%s) '''
                        ,(dni,id_solicitud,rol)
                )
                print("ok")
 
            cursor.execute(
            '''
                CALL GenerarAsistenciasPorSolicitud(%s);
            ''',(id_solicitud)
            )
            print("ok")
    

            #registramos comprobantes

            monto = monto_confirmacion(requisitos_data['sede'])
            print(monto)

            cursor.execute(
                '''
                INSERT INTO comprobante (fecha_hora, total, tipo_comprobante, forma_pago, id_solicitud, id_sede) 
                VALUES (CURRENT_DATE(), %s, %s, %s, %s, %s)
                ''',
                (monto, 'Electrónico', requisitos_data['metodo'], id_solicitud, id_sede) 
            )


            requisitos = cactos.listar_requisitos(requisitos_data['id_acto'])

            directorio = 'static/archivos_usuario/'+ str(id_solicitud) +'/'
            print(f"Directorio donde se guardará la imagen: {directorio}")  # Imprimir para verificar

            if not os.path.exists(directorio):
                os.mkdir(directorio)

            for rq in requisitos:
                if rq[3] == "Imagen" :
                    archivo_imagen = requisitos_data[rq[7]] 
                    if archivo_imagen :
                        ruta_imagen = directorio + archivo_imagen.filename 
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
                ,(id_solicitud, rq[0],'V',enlace_imagen)
            )
            conexion.commit()

        return 1
    except Exception as e:
        print(f"Error: {e}")
        return 0
    finally:
        conexion.close()

def primeracomu(requisitos_data):
    id_sede = csede.obtener_id_sede_por_nombre(requisitos_data['sede'])
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                insert into solicitud(id_actoliturgico,id_sede,estado,id_celebracion,dni_feligres, asistencia, fecha_registro) values (%s,%s,%s,%s,%s,0, CURRENT_DATE())
                ''',(requisitos_data['id_acto'],id_sede,'P',requisitos_data['id_charla'],requisitos_data['dni_pri_responsable'])
            )
            id_solicitud = cursor.lastrowid

            print(id_solicitud)

            roles = ['comulgantes']
            dnis = [requisitos_data['dni_celebrante']]

            #insertamos los implicados en ese acto como el padrino, madrina, padre
            for dni, rol in zip(dnis, roles):
                cursor.execute(
                    '''
                        insert into solicitud_feligres (dni_feligres,id_solicitud,rol) values (%s,%s,%s) '''
                        ,(dni,id_solicitud,rol)
                )
                print("ok")
 
            cursor.execute(
            '''
                CALL GenerarAsistenciasPorSolicitud(%s);
            ''',(id_solicitud)
            )
            print("ok")
    

            #registramos comprobantes

            monto = monto_primera(requisitos_data['sede'])
            print(monto)

            cursor.execute(
                '''
                INSERT INTO comprobante (fecha_hora, total, tipo_comprobante, forma_pago, id_solicitud, id_sede) 
                VALUES (CURRENT_DATE(), %s, %s, %s, %s, %s)
                ''',
                (monto, 'Electrónico', requisitos_data['metodo'], id_solicitud, id_sede) 
            )


            requisitos = cactos.listar_requisitos(requisitos_data['id_acto'])

            directorio = 'static/archivos_usuario/'+ str(id_solicitud) +'/'
            print(f"Directorio donde se guardará la imagen: {directorio}")  # Imprimir para verificar

            if not os.path.exists(directorio):
                os.mkdir(directorio)

            for rq in requisitos:
                if rq[3] == "Imagen" :
                    archivo_imagen = requisitos_data[rq[7]] 
                    if archivo_imagen :
                        ruta_imagen = directorio + archivo_imagen.filename 
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
                ,(id_solicitud, rq[0],'V',enlace_imagen)
            )
            conexion.commit()

        return 1
    except Exception as e:
        print(f"Error: {e}")
        return 0
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
        id_sede = csede.obtener_id_sede_por_nombre(requisitos_data['sede']) 

        # Aquí deberías agregar la lógica para insertar en la base de datos
        with conexion.cursor() as cursor:
            cursor.execute(
                "INSERT INTO celebracion (fecha, hora_inicio, hora_fin, estado, id_sede, id_actoliturgico) VALUES (%s, %s, %s, %s, %s, %s)",
                (fecha, hora_inicio, hora_fin, 'P', id_sede, requisitos_data['id_acto'])
            )
            id_celebracion = cursor.lastrowid
            cursor.execute(
                '''
                insert into solicitud(id_actoliturgico,id_sede,estado,id_celebracion,dni_feligres, asistencia, fecha_registro) values (%s,%s,%s,%s,%s,0, CURRENT_DATE())
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
            #Grabamos asistencias tanto de novio como de la novia

            cursor.execute(
                '''
                    CALL registrar_asistencias(CURRENT_DATE(), %s);
                ''', (id_solicitud,)  # Nota la coma al final para crear una tupla
            )
            mensaje = cursor.fetchone()  # Devuelve una tupla
            print(mensaje[0])
            
            ##Pasamos a realozar los pagos de igual forma el comprobante


            monto = cactos.monto_total('Matrimonio', requisitos_data['sede'], requisitos_data['dni_responsable'], requisitos_data['dni_novio'], requisitos_data['dni_novia'])
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
            directorio = 'static/archivos_usuario/'+ str(id_solicitud) +'/'
            print(f"Directorio donde se guardará la imagen: {directorio}")  # Imprimir para verificar

            if not os.path.exists(directorio):
                os.mkdir(directorio)

            for rq in requisitos:
                if rq[3] == "Imagen" :
                    archivo_imagen = requisitos_data[rq[7]] 
                    if archivo_imagen :
                        ruta_imagen = directorio + archivo_imagen.filename 
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


def monto_butismo(sede):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                    select (select monto from actoliturgico as al 
                    where id_actoliturgico = 2) + (select monto from sede where nombre_sede = %s) as monto
                ''',(sede)
            )
            monto = cursor.fetchone()[0]
            return monto
    except:
        return 0
    finally:
        conexion.close()

def monto_confirmacion(sede):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                    select (select monto from actoliturgico as al 
                    where id_actoliturgico = 3) + (select monto from sede where nombre_sede = %s) as monto
                ''',(sede)
            )
            monto = cursor.fetchone()[0]
            return monto
    except:
        return 0
    finally:
        conexion.close()

def monto_primera(sede):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                    select (select monto from actoliturgico as al 
                    where id_actoliturgico = 6) + (select monto from sede where nombre_sede = %s) as monto
                ''',(sede)
            )
            monto = cursor.fetchone()[0]
            return monto
    except:
        return 0
    finally:
        conexion.close()


def obtener_asistencias(id_solicitud):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                    select asis.id_asistencia,tm.descripcion, DATE(asis.fecha)  as  fecha , sfel.rol , fl.dni  , concat(fl.apellidos, ' ', fl.nombres) as nombre , asis.estado from solicitud_feligres as sfel inner join asistencia as asis
                    on asis.id_solicitud = sfel.id_solicitud and asis.dni_feligres = sfel.dni_feligres inner join programacion_charlas as pch
                    on pch.id_programacion = asis.id_programacion inner join tema as tm 
                    on tm.id_tema = pch.id_tema inner join feligres as fl
                    on asis.dni_feligres = fl.dni
                    where asis.id_solicitud = %s
                    ORDER BY tm.id_tema ASC, fl.apellidos DESC;
                ''',(id_solicitud)
            )
            calendario = cursor.fetchall()
            return calendario
    except:
        return 0
    finally:
        conexion.close()


def check_asistencia(id,estado):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute(
                '''
                    update asistencia set estado = %s where id_asistencia = %s
                ''',(estado,id)
            )
            conexion.commit()
            return 1
    except:
        return 0
    finally:
        conexion.close()

def datos_soliictud_matrimonio(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute('''
                select rq.id_js_requisito, rq.id_js_estado ,ar.id_requisito, ar.estado, ar.enlace_imagen, rq.tipo from solicitud as sol inner join aprobacionrequisitos as ar
                on ar.id_solicitud = sol.id_solicitud inner join requisito as rq
                on rq.id_requisito = ar.id_requisito
                where sol.id_solicitud = %s
            ''',(id,))
            datos = cursor.fetchall()
            return datos
    except:
        return 0
    finally:
        conexion.close()

def fcelebraciones(id,sede):
    try:
        conexion = obtener_conexion()
        
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    cl.id_celebracion, 
                    CONCAT('Fecha:', cl.fecha, ' Hora inicio:  ', cl.hora_inicio, ' Hora fin ', cl.hora_fin) AS fechas
                FROM 
                    celebracion AS cl
                INNER JOIN 
                    sede AS sd ON sd.id_sede = cl.id_sede
                WHERE 
                    cl.id_actoliturgico = %s
                    AND sd.nombre_sede = %s
                    AND cl.fecha > CURRENT_DATE();
            ''',(id,sede,))
            datos = cursor.fetchall()
            return datos
    except:
        return 0
    finally:
        conexion.close()


def viww(id):
    try:
        conexion = obtener_conexion()
        
        with conexion.cursor() as cursor:
            cursor.execute('''
                    SELECT tm.descripcion, 
                        DATE_SUB(cl.fecha, INTERVAL 1 DAY) AS fecha, 
                        pch.hora_inicio, 
                        DATE_ADD(pch.hora_inicio, INTERVAL (HOUR(tm.duracion) * 60 + MINUTE(tm.duracion)) MINUTE) AS hora_suma,
                        pch.id_programacion
                    FROM tema AS tm
                    INNER JOIN celebracion AS cl
                    ON tm.id_actoliturgico = cl.id_actoliturgico 
                    INNER JOIN programacion_charlas AS pch
                    ON pch.id_tema = tm.id_tema
                    WHERE cl.id_celebracion = %s;
            ''',(id,))
            datos = cursor.fetchall()
            return datos
    except:
        return 0
    finally:
        conexion.close()

def ch_confir(sede,id_acto,id):
    try:
        id_sede = csede.obtener_id_sede_por_nombre(sede)
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    tm.descripcion AS tema,
                    DATE_ADD(cl.fecha, INTERVAL ((tm.orden - 1) * 7 + 7) DAY) AS fecha_asistencia,
                    pch.hora_inicio AS hora_inicio,
                    ADDTIME(pch.hora_inicio, tm.duracion) AS hora_fin,
                    tm.orden AS orden_tema,
                    pch.dias_semana AS dias_programados
                FROM celebracion AS cl
                JOIN tema AS tm ON tm.id_actoliturgico = cl.id_actoliturgico
                JOIN programacion_charlas AS pch ON pch.id_tema = tm.id_tema
                WHERE cl.id_actoliturgico = %s AND cl.id_sede = %s and cl.id_celebracion = %s
                ORDER BY tm.orden ASC;
            ''',(id_acto,id_sede,id))
            datos = cursor.fetchall()
            return datos
    except:
        return 0
    finally:
        conexion.close()


def ch_comunion(sede,id_acto,id):
    try:
        id_sede = csede.obtener_id_sede_por_nombre(sede)
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT 
                    tm.descripcion AS tema,
                    DATE_ADD(cl.fecha, INTERVAL ((tm.orden - 1) * 7 + 7) DAY) AS fecha_asistencia,
                    pch.hora_inicio AS hora_inicio,
                    ADDTIME(pch.hora_inicio, tm.duracion) AS hora_fin,
                    tm.orden AS orden_tema,
                    pch.dias_semana AS dias_programados
                FROM celebracion AS cl
                JOIN tema AS tm ON tm.id_actoliturgico = cl.id_actoliturgico
                JOIN programacion_charlas AS pch ON pch.id_tema = tm.id_tema
                WHERE cl.id_actoliturgico = %s AND cl.id_sede = %s and cl.id_celebracion = %s
                ORDER BY tm.orden ASC;
            ''',(id_acto,id_sede,id))
            datos = cursor.fetchall()
            return datos
    except:
        return 0
    finally:
        conexion.close()


def solicitudes(sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    sl.id_solicitud,
                    sd.nombre_sede,
                    al.nombre_liturgia,
                    CONCAT(fl.nombres, ' ', fl.apellidos) AS nombres,
                    CASE
                        WHEN COUNT(CASE WHEN ar.estado = 'F' THEN 1 END) > 0 THEN 'Pendiente'
                        ELSE 'Aprobado'
                    END AS estado,
                    sl.fecha_registro
                FROM solicitud AS sl
                INNER JOIN feligres AS fl ON fl.dni = sl.dni_feligres
                INNER JOIN sede AS sd ON sd.id_sede = sl.id_sede
                INNER JOIN celebracion AS cl ON cl.id_celebracion = sl.id_celebracion
                INNER JOIN actoliturgico AS al ON al.id_actoliturgico = cl.id_actoliturgico
                LEFT JOIN aprobacionrequisitos AS ar ON ar.id_solicitud = sl.id_solicitud
                WHERE sd.nombre_sede = %s
                GROUP BY sl.id_solicitud, sd.nombre_sede, al.nombre_liturgia, fl.nombres, fl.apellidos, sl.fecha_registro
                ORDER BY sl.id_solicitud;
            """, (sede,))
            solicitudes = cursor.fetchall()
            return solicitudes
    except Exception as e:
        print(f"Error en solicitudes(): {e}")
        return "Error"
    finally:
        conexion.close()


