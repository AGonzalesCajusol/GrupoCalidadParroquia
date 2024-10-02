from bd import obtener_conexion

def obtener_actosliturgicos():
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('''
                    SELECT 
                al.id_liturgia,
                al.nombre_liturgia,
                IFNULL(GROUP_CONCAT(pr.nombre_liturgia SEPARATOR ', '), 'Ninguno') AS prerequisitos
            FROM 
                actoliturgico AS al
            LEFT JOIN 
                prerequisito_actoliturgico AS pra ON pra.id_actoliturgico = al.id_liturgia
            LEFT JOIN 
                actoliturgico AS pr ON pra.id_prerequisito = pr.id_liturgia
            GROUP BY 
                al.id_liturgia, al.nombre_liturgia
            ORDER BY 
                al.id_liturgia ASC;
                ''')
    lista_actos = cursor.fetchall()
    conexion.close()
    return lista_actos

def insertar_nombreactoliturgico(nombre):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                INSERT INTO actoliturgico (nombre_liturgia) VALUES (%s)
            ''', (nombre,))
            # Asegúrate de confirmar la transacción
            conexion.commit()
            id_insertado = cursor.lastrowid
        return id_insertado
    except:
        raise("Error, llave duplicada")
    finally:
        conexion.close()


def asignar_acto_prerequisitos(id_acto, prerequisitos):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            for pre in prerequisitos:
                # Ejecuta la consulta para obtener el id_liturgia
                cursor.execute('''
                    SELECT id_liturgia FROM actoliturgico WHERE nombre_liturgia = %s
                ''', (pre,))
                
                resultado = cursor.fetchone()
                
                if resultado:  # Verifica si se encontró un resultado
                    id_pre = resultado[0]  # id_liturgia es el primer elemento
                    
                    # Inserta el prerequisito
                    cursor.execute('''
                        INSERT INTO prerequisito_actoliturgico (id_actoliturgico, id_prerequisito) VALUES (%s, %s)
                    ''', (id_acto, id_pre))
                else:
                    print(f"No se encontró la liturgia con el nombre: {pre}")
        
        # Confirma la transacción
        conexion.commit()
        return True
    except Exception as e:
        conexion.rollback() 
        return False
    finally:
        conexion.close()  

def listar_prerequisitosXid(id_acto):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute('''
            select al.nombre_liturgia from actoliturgico as al where al.id_liturgia In (select pa.id_prerequisito from actoliturgico as a left join prerequisito_actoliturgico as pa 
            on pa.id_actoliturgico = a.id_liturgia
            where id_liturgia = %s)
                ''',(id_acto))
    lista_actos = cursor.fetchall()
    conexion.close()
    return lista_actos

def eliminar_todosprerequisito(nombre, id_acto):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            # Verifica si el nombre ya existe
            cursor.execute('''
                SELECT COUNT(*) FROM actoliturgico WHERE nombre_liturgia = %s AND id_liturgia != %s;
            ''', (nombre, id_acto))
            existe = cursor.fetchone()[0]

            if existe > 0:
                raise ValueError("El nombre de liturgia ya existe, no se puede actualizar.")

            # Elimina todos los prerequisitos
            cursor.execute('''
                DELETE FROM prerequisito_actoliturgico WHERE id_actoliturgico = %s
            ''', (id_acto,))

            # Actualiza el nombre de la liturgia
            cursor.execute('''
                UPDATE actoliturgico SET nombre_liturgia = %s WHERE id_liturgia = %s;
            ''', (nombre, id_acto))

        conexion.commit()
        return True
    except Exception as e:
        print(f"Ocurrió un error: {e}")  # Puedes registrar el error para depuración
        conexion.rollback()
        return False  
    finally:
        conexion.close()


def eliminar_prerequisito(lista_eliminar,id_acto,nombre):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            cursor.execute('''
                UPDATE actoliturgico SET nombre_liturgia = %s WHERE id_liturgia = %s;
            ''',(nombre,id_acto))

            for ele_eliminar in lista_eliminar:
                cursor.execute('''
                    select id_liturgia from actoliturgico where nombre_liturgia = %s;
                ''',(ele_eliminar))
                id = cursor.fetchone()[0]

                cursor.execute('''
                    delete from prerequisito_actoliturgico where id_actoliturgico = %s and id_prerequisito = %s
                ''', (id_acto,id))
        conexion.commit()
        return True
    except Exception as e:
        conexion.rollback()
        return False  
    finally:
        conexion.close()


def asignar_prerequisito_modificado(lista_agregar,id_acto,nombre):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                UPDATE actoliturgico SET nombre_liturgia = %s WHERE id_liturgia = %s;
            ''',(nombre,id_acto))
            for pre in lista_agregar:
                # Ejecuta la consulta para obtener el id_liturgia
                cursor.execute('''
                    SELECT id_liturgia FROM actoliturgico WHERE nombre_liturgia = %s
                ''', (pre,))
                
                resultado = cursor.fetchone()
                
                if resultado:  # Verifica si se encontró un resultado
                    id_pre = resultado[0]  # id_liturgia es el primer elemento
                    
                    # Inserta el prerequisito
                    cursor.execute('''
                        INSERT INTO prerequisito_actoliturgico (id_actoliturgico, id_prerequisito) VALUES (%s, %s)
                    ''', (id_acto, id_pre))
        conexion.commit()
    except Exception as e:  
        conexion.rollback() 
        raise("Error, llave duplicada")

    finally:
        conexion.close()  

def duplicidad(nombre):
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('''
                SELECT * FROM actoliturgico where nombre_liturgia = %s
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