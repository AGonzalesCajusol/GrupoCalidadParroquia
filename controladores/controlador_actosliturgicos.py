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
                SELECT 
                    al.id_actoliturgico, 
                    al.nombre_liturgia, 
                    COALESCE(GROUP_CONCAT(r.nombre_requisito SEPARATOR ', '), 'Ninguno') AS requisitos, 
                    al.monto 
                FROM 
                    actoliturgico AS al 
                LEFT JOIN 
                    requisito AS r ON al.id_actoliturgico = r.id_actoliturgico 
                GROUP BY 
                    al.id_actoliturgico, al.nombre_liturgia, al.monto 
                ORDER BY 
                    al.id_actoliturgico ASC;
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
                select al.id_actoliturgico , al.nombre_liturgia, r.nombre_requisito, al.monto from actoliturgico as al left join 
                           requisito as r on al.id_actoliturgico = r.id_actoliturgico where al.id_actoliturgico = %s;
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
                    cursor.execute('''
                       delete from requisito where nombre_requisito = %s
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
                SELECT nombre_liturgia from actoliturgico 
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
                SELECT 
                    al.id_actoliturgico, 
                    al.nombre_liturgia, 
                    COALESCE(GROUP_CONCAT(r.nombre_requisito SEPARATOR ', '), 'Ninguno') AS requisitos, 
                    al.monto 
                FROM 
                    actoliturgico AS al 
                LEFT JOIN 
                    requisito AS r ON al.id_actoliturgico = r.id_actoliturgico 
                WHERE al.nombre_liturgia = %s
                GROUP BY 
                    al.id_actoliturgico, al.nombre_liturgia, al.monto;
            ''',(acto))
            valores = cursor.fetchone()
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
