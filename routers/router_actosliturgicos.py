from flask import Flask, request, render_template, flash, redirect, url_for, jsonify
import controladores.controlador_actosliturgicos as cal
import json
import urllib.parse
import envio_correo 
from routers.router_main import requerido_login
from controladores.controlador_actosliturgicos import (
    obtener_celebraciones_por_fecha,
    obtener_anos,
    listar_actos
)


def registrar_rutas(app):
    @app.route("/gestionar_actosliturgicos", methods=["GET"])
    @requerido_login
    def gestionar_actosliturgicos():
       
        return render_template("/actos_liturgicos/gestionar_actoliturgico.html")
    
    @app.route("/modificarActoPrerequisito", methods=["POST"])
    @requerido_login
    def modificarActoPrerequisito():
        id = request.json['id']
        actoliturgico = request.json['acto']
        requisitos = request.json['requisitos']
        monto = request.json['monto']
        lista = cal.listar_actos_requisitosXid(id)
        ##agregar
        lista_agregar = []
        ##eliminar
        lista_eliminar = []
        lista_actos = []

        for li in lista:
            lista_actos.append(li[2])

        for el in lista_actos:
            if el not in requisitos:
                lista_eliminar.append(el)

        for requi in requisitos:
            if requi not in lista_actos:
                lista_agregar.append(requi)


        try:
            cal.modificar_acto_requisitos(id,actoliturgico,monto,lista_eliminar,lista_agregar)

            return jsonify({'estado': True})
        except:
            return jsonify({'estado': False})
        
    @app.route("/registrarActoLiturgico_Requisitos", methods=["POST"])
    @requerido_login
    def registrarActoLiturgico_Requisitos():
        actoliturgico = request.json['acto']
        requisitos = request.json['requisitos']
        monto = request.json['monto']
        estado = cal.insertar_acto_requisitos(actoliturgico,monto,requisitos)
        return jsonify({'estado': estado})
        
    @app.route("/lista_actos_requisitos", methods=["GET"])
    @requerido_login
    def lista_actos_requisitos():
        lista = cal.listar_actos_requisitos()
        resultado = []
        if(lista):
            for li in lista:
                resultado.append({
                    'id': li[0],
                    'nombre': li[1],
                    'requisito' : li[2],
                    'monto': li[3]
                })

        return jsonify(resultado)
    
    @app.route("/actoporid/<int:id>", methods=["GET"])
    @requerido_login
    def actoporid(id):
        lista = cal.listar_actos_requisitosXid(id)
        requisitos = []
        if(lista):
            for li in lista:
                requisitos.append(li[2])

            if requisitos[0] is None : 
                requisitos = ['Ninguno']

            resultado = {
                'id': lista[0][0],
                'nombre': lista[0][1],
                'monto' : lista[0][3],
                'requisito': requisitos
            }
        return jsonify(resultado)


    @app.route("/duplicidad/<string:nombre>", methods=["GET"])
    @requerido_login
    def duplicidad(nombre):
        lista = cal.duplicidad(nombre)
        return jsonify({'existe': lista})
    
    @app.route("/requisitosXactoliturgico", methods=["GET"])  # Sin barra final
    @requerido_login
    def requisitosXactoliturgico():
        lista = cal.listar_nombres_actos()
        requisitos = cal.listar_actos_requisitos()

        return render_template('/actos_liturgicos/requisitos_actoliturgico.html', lista=lista, requisitos= requisitos)

    @app.route("/filtrorequisitosxacto/<string:acto>", methods=["GET"]) 
    @requerido_login
    def filtrorequisitosxacto(acto):
        lista_actos = []
        if(acto == "todos"):
            requisitos = cal.listar_actos_requisitos()
            for r in requisitos:
                dato = {
                    'id': r[0],
                    'nombre_acto': r[1],
                    'requisitos': r[2],
                    'nivel' : r[3],
                    'tipo': r[4]
                }
                lista_actos.append(dato)
            
        else:
            requisitos = cal.listar_requisitoXacto(acto)
            for r in requisitos:
                dato = {
                    'id': r[0],
                    'nombre_acto': r[1],
                    'requisitos': r[2],
                    'nivel' : r[3],
                    'tipo': r[4]
                }
                lista_actos.append(dato)
        return jsonify({'data': lista_actos})
    
    @app.route('/enviar', methods=['POST'])
    @requerido_login
    def enviar():
        data = request.get_json()  # Extrae los datos de la solicitud
        texto = data.get('text')
        destinatario = data.get('dest')
        try:
            envio_correo.enviar(destinatario,texto)
            return jsonify({'estado': 'Correcto'})
        except:
            return jsonify({'estado': 'Incorrecto'})
        

    @app.route("/eliminaracto_requisitos/<int:id>", methods=["GET"])
    @requerido_login
    def eliminaracto_requisitos(id):
        resultado = cal.eliminaracto_requisitos(id)
        return jsonify({'estado': resultado})
    
    @app.route("/gestionar_requisitosactos", methods=["GET"])
    @requerido_login
    def gestionar_requisitosactos():
        actos = cal.listar_actosLit()
        return render_template('/actos_liturgicos/gestionar_requisitosactoliturgico.html', actos=actos)
    
    @app.route("/gestionar_actos", methods=["GET"])
    @requerido_login
    def gestionar_actos():
        return render_template('/actos_liturgicos/gestionar_liturgicoacto.html')
    
    @app.route("/registraractoliturgico1", methods=["POST"])
    @requerido_login
    def registraractoliturgico1():
        try:
            acto = request.form.get('nombreLiturgico')
            tipo = request.form.get('tipo')
            monto = request.form.get('montoFijo')
            estado = request.form.get('estado')
            if tipo == 'on':
                tipo = 'S'
            else:
                tipo = 'N'

            if estado == 'on':
                estado = 'A'
            else:
                estado = 'I'

            st = cal.insertar_acto(acto, tipo, monto, estado)    

            if st is not None:
                return jsonify({'estado': 'Incorrecto'}), 400
            return jsonify({'estado': 'Correcto'})  # Respuesta exitosa
        except Exception as e:
            print(f"Error al registrar el acto: {e}")
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500

    @app.route("/Apilistaactos", methods=["GET"])
    @requerido_login
    def Apilistaactos():
        actos = cal.listar_actosLit()
        lista_actos = []
        for acto in actos:
            tipo = 'Sacramento' if acto[3] == 'S'  else 'No sacramento'

            if acto[4] == 'A':
                estado = 'Activo'
            else:
                estado='Inactivo'

            

            lista_actos.append({
                'id': acto[0],
                'nombre_acto': acto[1],
                'monto': acto[2],
                'sacramento' : tipo,
                'estado': estado
            })
        return jsonify(lista_actos)

    @app.route('/eliminar_acto/<int:id>', methods=["GET"])
    @requerido_login
    def eliminar_acto(id):
        if cal.eliminar_acto(id):
            return jsonify({'estado': 'Correcto'})
        else:
            return jsonify({'estado': 'Incorrecto'})
        
    @app.route('/darbaja_acto/<int:id>', methods=["GET"])
    @requerido_login
    def darbaja_acto(id):
        try:
            if cal.darbaja_acto(id):
                return jsonify({'estado': 'Correcto'}), 200  # Respuesta exitosa
            else:
                return jsonify({'estado': 'Incorrecto'}), 404  # No se encontró el acto
        except Exception as e:
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500  # Error del servidor
        
    @app.route('/activar_acto/<int:id>', methods=["GET"])
    @requerido_login
    def activar_acto(id):
        try:
            if cal.activar_acto(id):
                return jsonify({'estado': 'Correcto'}), 200  # Respuesta exitosa
            else:
                return jsonify({'estado': 'Incorrecto'}), 404  # No se encontró el acto
        except Exception as e:
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500  # Error del servidor
        
    @app.route("/modificaracto1", methods=["POST"])
    @requerido_login
    def modificaracto1():
        try:
            id = request.form.get('id_f')
            acto = request.form.get('nombreLiturgico')
            tipo = request.form.get('tipo')
            monto = request.form.get('montoFijo')
            estado = request.form.get('estado')

            tipo = 'S' if tipo == 'on' else 'N'
            estado = 'A' if estado == 'on' else 'I'

            st = cal.modificar_acto(id, acto, tipo, monto, estado)

            if not st:
                return jsonify({'estado': 'Incorrecto'}), 400
            return jsonify({'estado': 'Correcto'})
        except Exception as e:
            print(f"Error al registrar el acto: {e}")
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500

    @app.route("/Apilistarrequisitos", methods=["GET"])
    @requerido_login
    def Apilistarrequisitos():
        actos = cal.listar_requisitosLit()
        lista_actos = []
        for acto in actos:
            if acto[9] == 'A':
                estado = "Activo"
            else:
                estado = "Inactivo"

            if acto[14] == 'O':
                nivel = "Obligatorio"
            else:
                nivel = "Requerido"

            lista_actos.append({
                'id': acto[0],
                'nombre_acto': acto[1],
                'id_requisito': acto[5],
                'nombre_requisito': acto[6],
                'tipo' : acto[8],
                'estado': estado,
                'maximo':acto[10],
                'minimo':acto[11],
                'nivel': nivel
            })
        return jsonify(lista_actos)

    @app.route("/registrarrequisito", methods=["POST"])
    @requerido_login
    def registrarrequisito():
        try:
            acto = request.form.get('nombreLiturgico')
            requisito = request.form.get('nombrerequisito')
            nivel = request.form.get('nivel')
            tipo = request.form.get('opciones')
            estado = request.form.get('estado')
            maximo = request.form.get('maxim')
            minimo = request.form.get('minim')

            # Manejo del estado
            estado = 'A' if estado == 'on' else 'I'

            # Insertar requisito
            st = cal.insertar_requisito(acto, requisito, tipo, estado, maximo, minimo, nivel)

            if st == 'error':  # Cambiado de 'if st is not None' a 'if not st'
                return jsonify({'estado': 'Incorrecto'}), 400
            return jsonify({'estado': 'Correcto'})  # Respuesta exitosa
        except Exception as e:
            print(f"Error al registrar el requisito: {e}")
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500

    @app.route('/darbaja_requisito/<int:id>/<int:id_requi>', methods=["GET"])
    @requerido_login
    def darbaja_requisito(id,id_requi):
        try:
            if cal.darbaja_requisito(id, id_requi):
                return jsonify({'estado': 'Correcto'}), 200  # Respuesta exitosa
            else:
                return jsonify({'estado': 'Incorrecto'}), 404  # No se encontró el acto
        except Exception as e:
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500  # Error del servidor
        
    @app.route('/activar_requisito/<int:id>/<int:id_requi>', methods=["GET"])
    @requerido_login
    def activar_requisito(id,id_requi):
        try:
            if cal.activar_requisito(id, id_requi):
                return jsonify({'estado': 'Correcto'}), 200  # Respuesta exitosa
            else:
                return jsonify({'estado': 'Incorrecto'}), 404  # No se encontró el acto
        except Exception as e:
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500  # Error del servidor
        
    @app.route('/eliminar_requisito/<int:id_actoliturgico>/<int:id_requisito>', methods=["GET"])
    @requerido_login
    def eliminar_requisito(id_actoliturgico, id_requisito):
        try:
            if cal.eliminar_requisito(id_actoliturgico, id_requisito):
                return jsonify({'estado': 'Correcto'}), 200  # Respuesta exitosa
            else:
                return jsonify({'estado': 'Incorrecto'}), 404  # No se encontró el acto o hubo un error
        except Exception as e:
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500  # Error del servidor

    @app.route("/modificar_requisito", methods=["POST"])
    @requerido_login
    def modificar_requisito():
        try:
            id_requisito = request.form.get('id_r')
            requisito = request.form.get('nombrerequisito')
            tipo = request.form.get('opciones')
            estado = request.form.get('estado')
            maximo = request.form.get('maxim')
            minimo = request.form.get('minim')
            nivel = request.form.get('nivel')

            estado = 'A' if estado == 'on' else 'I'

            st = cal.modificar_requisito(id_requisito, requisito, tipo, estado, maximo, minimo,nivel)

            if not st:
                return jsonify({'estado': 'Incorrecto'}), 400
            return jsonify({'estado': 'Correcto'})  # Respuesta exitosa
        except Exception as e:
            return jsonify({'estado': 'Error', 'mensaje': str(e)}), 500

    @app.route("/numero_actos_liturgicos", methods=["GET"])
    @requerido_login
    def numero_actos_liturgicos():
        try:
            años = obtener_anos()  # Función que obtiene los años
            actos = listar_actos()  # Función que obtiene los actos litúrgicos
            return render_template(
                "reportes/numeroActosLiturgicosAño.html",
                años=[int(an[0]) for an in años],  # Convertir los años a una lista de enteros
                actos=actos  # Lista de actos litúrgicos
            )
        except Exception as e:
            print(f"Error al cargar datos para la vista: {e}")
            return render_template(
                "reportes/numeroActosLiturgicosAño.html",
                años=[],
                actos=[]
            )
    @app.route("/api/obtener_anos", methods=["GET"])
    @requerido_login
    def api_obtener_anos():
        try:
            años = obtener_anos()  # Llama al controlador
            lista_años = [{'año': int(an[0])} for an in años]
            return jsonify({'data': lista_años})
        except Exception as e:
            print(f"Error al obtener años: {e}")
            return jsonify({"error": "Error al obtener los años"}), 500

    @app.route("/api/listar_actos", methods=["GET"])
    @requerido_login
    def api_listar_actos():
        try:
            actos = listar_actos()  # Llama al controlador
            return jsonify(actos)
        except Exception as e:
            print(f"Error al listar actos litúrgicos: {e}")
            return jsonify({"error": "Error al listar los actos litúrgicos"}), 500

    # Ruta para obtener las celebraciones filtradas por año, mes y tipo de acto
    @app.route("/api/celebraciones_por_fecha", methods=["GET"])
    @requerido_login
    def api_celebraciones_por_fecha():
        year = request.args.get('year')
        month = request.args.get('month')
        acto = request.args.get('acto')  # Nuevo filtro por tipo de acto litúrgico
        try:
            celebraciones = obtener_celebraciones_por_fecha(year, month, acto)
            return jsonify(celebraciones)
        except Exception as e:
            print(f"Error al obtener celebraciones por fecha: {e}")
            return jsonify({"error": "Error al obtener los datos"}), 500
