from bd import obtener_conexion


def insertar_acto_requisitos(nombre_liturgia, monto, requisitos):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Verificar si ya existe un acto litúrgico con ese nombre
            cursor.execute('''
                SELECT id_actoliturgico FROM actoliturgico WHERE nombre_liturgia = %s
            ''', (nombre_liturgia,))
            resultado = cursor.fetchone()

            if resultado:  # Si ya existe, devolver False para indicar duplicidad
                return False

            # Insertar el nuevo acto litúrgico
            cursor.execute('''
                INSERT INTO actoliturgico (nombre_liturgia, monto) values (%s, %s)
            ''', (nombre_liturgia, monto))
            id_acto = cursor.lastrowid

            # Insertar los requisitos si existen
            if requisitos:
                for requisito in requisitos:
                    cursor.execute('''
                        INSERT INTO requisito (nombre_requisito, id_actoliturgico) 
                        VALUES (%s, %s)
                    ''', (requisito, id_acto))

        # Si todo va bien, confirmar la transacción
        conexion.commit()
        return True
    except Exception as e:
        print(f"Error: {e}")  # Para registrar el error si es necesario
        conexion.rollback()
        return False
    finally:
        conexion.close()

def listar_actos_requisitos():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                    select rq.id_requisito, al.nombre_liturgia, rq.nombre_requisito, rq.nivel_requisito, rq.tipo from actoliturgico as   al left join  requisito as rq 
                    on rq.id_actoliturgico = al.id_actoliturgico order by rq.id_requisito asc
            '''
            )
            lista = cursor.fetchall()
            return lista
    except:
        return "Error"
    finally:
        conexion.close()

def listar_actos_requisitosXid(id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                select al.id_actoliturgico , al.nombre_liturgia, r.nombre_requisito, al.monto from actoliturgico as al left join requisito as r on al.id_actoliturgico = r.id_actoliturgico where al.id_actoliturgico = %s;
            ''',(id)
            )
            lista = cursor.fetchall()
            return lista
    except:
        return ""
    finally:
        conexion.close()

def modificar_acto_requisitos(id,actoliturgico,monto,lista_eliminar,lista_agregar):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                update actoliturgico  set nombre_liturgia = %s , monto=%s where id_actoliturgico = %s
            ''',(actoliturgico,monto,id)
            )

            print(lista_eliminar,lista_agregar)
            if lista_eliminar and lista_eliminar[0] is not None:
                print("no tenia porque entrrar")
                for lis_e in lista_eliminar:
                    cursor.execute('''delete from requisito where nombre_requisito = %s
                    ''',(lis_e)
                    )

            if lista_agregar and lista_agregar[0] is not None:
                for lis_agg in lista_agregar:
                    cursor.execute('''
                        insert into requisito (nombre_requisito,id_actoliturgico) values (%s,%s)
                    ''',(lis_agg,id)
                    )
        conexion.commit()
    except:
        conexion.rollback()
    finally:
        conexion.close()

def duplicidad(nombre):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT * FROM actoliturgico where nombre_liturgia = %s;
            ''',(nombre))
            valores = cursor.fetchone()
        if valores:
            return True
        else:
            return False
    except Exception as e:  
        raise("Error en la consulta")
    finally:
        conexion.close()  

def listar_nombres_actos():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT id_actoliturgico, nombre_liturgia from actoliturgico 
            ''')
            valores = cursor.fetchall()
        return valores
    except Exception as e:  
        raise("Error en la consulta")
    finally:
        conexion.close()  

def listar_requisitoXacto(acto):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                    select rq.id_requisito, al.nombre_liturgia, rq.nombre_requisito, rq.nivel_requisito, rq.tipo  from actoliturgico as   al left join  requisito as rq 
                    on rq.id_actoliturgico = al.id_actoliturgico WHERE al.nombre_liturgia  = %s order by rq.id_requisito asc 
            ''',(acto))
            valores = cursor.fetchall()
        return valores
    except Exception as e:  
        raise("Error en la consulta")
    finally:
        conexion.close()  

def eliminaracto_requisitos(id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT * 
                FROM actoliturgico AS al
                LEFT JOIN charlas AS ch ON ch.id_charla = al.id_actoliturgico
                LEFT JOIN intencion AS it ON it.id_actoliturgico = al.id_actoliturgico
                WHERE al.id_actoliturgico = %s AND (ch.id_charla IS NOT NULL OR it.id_actoliturgico IS NOT NULL);
                ''', (id,))
            
            if cursor.rowcount == 0:
                cursor.execute('DELETE FROM requisito WHERE id_actoliturgico = %s;', (id,))
                cursor.execute('DELETE FROM actoliturgico WHERE id_actoliturgico = %s;', (id,))
                conexion.commit() 
                return True
        
        return False

    except Exception as e:
        conexion.rollback()
        return False
    finally:
        conexion.close()

def obtener_acto():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT nombre_liturgia from actoliturgico")
        sede = cursor.fetchall()
    conexion.close()
    return sede

def listar_actosLit():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT * from actoliturgico 
            ''')
            '''
                SELECT al.* 
                FROM actoliturgico AS al
                left JOIN sede_acto_liturgico AS sdal
                    ON al.id_actoliturgico = sdal.id_actoliturgico
                left JOIN sede AS sd
                    ON sd.id_sede = sdal.id_sede
                WHERE sd.nombre_sede = 'Sede central';
            '''
            valores = cursor.fetchall()
        return valores
    except Exception as e:  
        raise("Error en la consulta")
    finally:
        conexion.close()  

def listar_actosxsede(nombre_sede):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT al.* 
                FROM actoliturgico AS al
                left JOIN sede_acto_liturgico AS sdal
                    ON al.id_actoliturgico = sdal.id_actoliturgico
                left JOIN sede AS sd
                    ON sd.id_sede = sdal.id_sede
                WHERE sd.nombre_sede = %s;
            ''', nombre_sede)
            valores = cursor.fetchall()
        return valores
    except Exception as e:  
        raise("Error en la consulta")
    finally:
        conexion.close()  



def insertar_acto(acto,tipo,monto,estado):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''SELECT * FROM actoliturgico WHERE nombre_liturgia = %s''', (acto,))
            resultado = cursor.fetchone()

            if resultado:
                return 'duplicado'
            
            cursor.execute('''
                insert into actoliturgico(nombre_liturgia, monto,es_sacramento,estado ) values (%s,%s,%s,%s)
            ''', (acto, monto, tipo, estado))
            conexion.commit()
    except Exception as e:
        conexion.rollback() 
        return 'duplicado'
    finally:
        conexion.close()  

def eliminar_acto(id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''SELECT * FROM actoliturgico WHERE id_actoliturgico = %s''', (id,))
            
            if cursor.rowcount > 0:
                cursor.execute('''DELETE FROM actoliturgico WHERE id_actoliturgico = %s''', (id,))
                conexion.commit()
                return True
            
            return False

    except Exception as e:
        conexion.rollback()
        print(f'Error al eliminar acto: {e}')
        return False

    finally:
        conexion.close()

def darbaja_acto(id):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''Update actoliturgico  SET estado= 'I' WHERE id_actoliturgico = %s ''', (id,))
            conexion.commit()
            return True
    except Exception as e:
        conexion.rollback()
        print(f'Error al eliminar acto: {e}')
        return False

    finally:
        conexion.close()

def modificar_acto(id_actoliturgico, acto, tipo, monto, estado):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                UPDATE actoliturgico
                SET nombre_liturgia = %s,
                    monto = %s,
                    es_sacramento = %s,
                    estado = %s
                WHERE id_actoliturgico = %s
            ''', (acto, monto, tipo, estado, id_actoliturgico))
            conexion.commit()
            return True
    except Exception as e:
        conexion.rollback() 
        return False
    finally:
        conexion.close()

def listar_requisitosLit():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                select * from actoliturgico as   al left join  requisito as rq 
                on rq.id_actoliturgico = al.id_actoliturgico order by al.id_actoliturgico asc
            ''')
            valores = cursor.fetchall()
        return valores
    except Exception as e:  
        raise("Error en la consulta")
    finally:
        conexion.close()  

def insertar_requisito(acto, requisito, tipo, estado, maximo, minimo, nivel):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            print(f"Acto: {acto}, Requisito: {requisito}")
            cursor.execute('''
                SELECT * FROM requisito WHERE id_actoliturgico = %s AND nombre_requisito = %s
            ''', (acto, requisito))
            resultado = cursor.fetchone()

            if resultado:
                return 'duplicado'

            cursor.execute('''
                INSERT INTO requisito (nombre_requisito, id_actoliturgico, tipo, estado, maximo, minimo, nivel_requisito) 
                VALUES (%s, %s, %s, %s, %s, %s,%s)
            ''', (requisito, acto, tipo, estado, maximo, minimo,nivel))
            conexion.commit()
            return True
    except Exception as e:
        print(f"Error al insertar requisito: {e}")
        conexion.rollback() 
        return 'error'
    finally:
        conexion.close()

def darbaja_requisito(id_acto, id_requisito):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''update requisito set estado = 'I' where id_requisito = %s and id_actoliturgico = %s''', (id_requisito,id_acto,))
            conexion.commit()
            return True
    except Exception as e:
        conexion.rollback()
        print(f'Error al eliminar acto: {e}')
        return False

    finally:
        conexion.close()

def eliminar_requisito(id_actoliturgico, id_requisito):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Consultar cuántas filas están asociadas con el requisito
            cursor.execute('''
                SELECT COUNT(*) FROM actoliturgico AS al
                INNER JOIN requisito AS req ON al.id_actoliturgico = req.id_actoliturgico
                INNER JOIN aprobacionrequisitos AS ar ON ar.id_requisito = req.id_requisito
                WHERE al.id_actoliturgico = %s AND ar.id_requisito = %s
            ''', (id_actoliturgico, id_requisito))

            count = cursor.fetchone()[0]

            # Si hay más de una fila, no proceder con la eliminación
            if count > 1:
                return False

            # Si hay exactamente una fila, proceder a eliminar
            cursor.execute('''
                DELETE req FROM requisito AS req
                WHERE req.id_actoliturgico = %s AND req.id_requisito = %s
            ''', (id_actoliturgico, id_requisito))

            conexion.commit()
            return True
    except Exception as e:
        conexion.rollback()
        print(f'Error al eliminar requisito: {e}')
        return False
    finally:
        conexion.close()

def modificar_requisito(id_requisito, requisito, tipo, estado, maximo, minimo, nivel):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                UPDATE requisito 
                SET nombre_requisito = %s, tipo = %s, estado = %s, maximo = %s, minimo = %s , nivel_requisito = %s
                WHERE id_requisito = %s
            ''', (requisito, tipo, estado, maximo, minimo,nivel, id_requisito))
            conexion.commit()
            return True
    except Exception:
        conexion.rollback()
        return False
    finally:
        conexion.close()

def listar_requisitos(id_actoliturgico):

    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                select * from requisito where id_actoliturgico = %s
            ''',(id_actoliturgico))
            valores = cursor.fetchall()
        return valores
    except Exception as e:  
        raise("Error en la consulta")
    finally:
        conexion.close()

def monto_total(acto_liturgico, sede, dni_responsable, dni1, dni2):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Monto fijo de ese acto litúrgico
            cursor.execute(
                '''
                SELECT al.monto FROM actoliturgico AS al WHERE al.nombre_liturgia = %s
                ''', (acto_liturgico,)
            )
            resultado_acto = cursor.fetchone()
            if resultado_acto:
                pf_acto = resultado_acto[0]
            else:
                print("No se encontró el acto litúrgico especificado.")
                return 0

            # Monto fijo por ser sede principal
            cursor.execute(
                '''
                SELECT sd.monto FROM sede AS sd WHERE sd.nombre_sede = %s
                ''', (sede,)
            )
            resultado_sede = cursor.fetchone()
            if resultado_sede:
                pf_sede = resultado_sede[0]
            else:
                print("No se encontró la sede especificada.")
                return 0

            # Verificar si los feligreses pertenecen a la sede
            cursor.execute(
                '''
                SELECT * FROM feligres AS fl INNER JOIN sede AS sd
                ON sd.id_sede = fl.id_sede WHERE sd.nombre_sede = %s AND (fl.dni = %s OR fl.dni = %s)
                ''', (sede, dni1, dni2)
            )
            verificar = cursor.fetchone()
            if verificar:
                return {
                    'pf_acto': float(pf_acto),
                    'pf_sede': float(pf_sede)
                }
            else:
                # Si no pertenecen a la sede, calcular el monto de traslado
                cursor.execute(
                    '''
                    SELECT fl.id_sede, sd.monto_traslado FROM feligres AS fl INNER JOIN sede AS sd
                    ON sd.id_sede = fl.id_sede WHERE fl.dni = %s
                    ''', (dni_responsable,)
                )
                resultado_traslado = cursor.fetchone()
                if resultado_traslado:
                    id_sedetraslado = resultado_traslado[0]
                    pf_traslado = resultado_traslado[1]
                    return {
                        'pf_acto': float(pf_acto),
                        'pf_sede': float(pf_sede),
                        'pf_traslado': float(pf_traslado),
                        'id_sedetraslado': id_sedetraslado
                    }
                else:
                    print("No se encontró el responsable especificado para calcular el traslado.")
                    return 0
    except Exception as e:  
        print(f"Error al calcular el monto total: {e}")
        return 0
    finally:
        conexion.close()

def listar_sacramentos():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            # Consulta para obtener los actos litúrgicos que son sacramentos
            cursor.execute("SELECT id_actoliturgico ,nombre_liturgia FROM actoliturgico WHERE es_sacramento = 'S'")
            sacramentos = cursor.fetchall()
            return sacramentos
    finally:
        conexion.close()