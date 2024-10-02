from flask import Flask, request, render_template, flash, redirect, url_for, jsonify
import controladores.controlador_actosliturgicos as cal
import json
import urllib.parse


def registrar_rutas(app):
    @app.route("/gestionar_actosliturgicos", methods=["GET"])
    def gestionar_actosliturgicos():
        lista_actosliturgicos = cal.obtener_actosliturgicos()  # Asegúrate de que esta función esté devolviendo los datos correctamente
        return render_template("/actos_liturgicos/gestionar_actoliturgico.html", lista_actosliturgicos=lista_actosliturgicos, lis=lista_actosliturgicos)


    @app.route("/insertar_actoliturgico", methods=["POST"])
    def insertar_actoliturgico():
        data = request.get_json()
        nombre = data.get('nombre_liturgia')
        lista_actos = data.get('actos', [])

        id_nombre = cal.insertar_nombreactoliturgico(nombre)
        

        if id_nombre and len(lista_actos) >0 :
            try:
                cal.asignar_acto_prerequisitos(id_nombre, lista_actos)
                lista_actos = {
                'estado': 1,
                'respuesta':"Se registro y asigno correctamente",
                }
            except:
                lista_actos = {
                'estado': 0,
                'respuesta':"Se registro y asigno correctamente",
                }
        return jsonify(lista_actos)


    @app.route("/modificar_actoliturgico", methods=["POST"])
    def modificar_actoliturgico():
        id = request.form['id_liturgia']
        nombre = request.form['nombre_liturgia']
        cookie = request.cookies.get('seleccion')
        lista_cookie = urllib.parse.unquote(cookie)
        lista_cookie = json.loads(lista_cookie)

        if cookie is None:
            flash("No se encontraron datos a modificar", "danger")
            return redirect(url_for('gestionar_actosliturgicos'))
        try:
            if ('Ninguno' in lista_cookie) or (len(lista_cookie) == 0):
                if cal.eliminar_todosprerequisito(nombre,id):
                    flash(f"Se modifico correctamente la liturgia con sus prerrequisitos", "success")
                else:
                    flash(f"LLave duplicada, revise el nombre de su liturgia: {nombre}", "danger")
            else:
                ##analizar
                lista_acto = cal.listar_prerequisitosXid(id)
                lista_agregar = []
                lista_eliminar = []
                lista_pre = []

                for li in lista_acto:
                    lista_pre.append(li[0])
                    
                for ele in lista_cookie:
                    if ele not in lista_pre:
                        lista_agregar.append(ele)

                for ele_acto in lista_pre:
                    if ele_acto not in lista_cookie:
                        lista_eliminar.append(ele_acto)
                        
                try:
                    cal.asignar_prerequisito_modificado(lista_agregar,id,nombre)
                    cal.eliminar_prerequisito(lista_eliminar,id,nombre)
                except:
                    flash(f"LLave duplicada, revise el nombre de su liturgia: {nombre}", "danger")
                return redirect(url_for('gestionar_actosliturgicos'))

        except:
            flash(f"LLave duplicada, revise el nombre de su liturgia: {nombre}", "danger")


        return redirect(url_for('gestionar_actosliturgicos'))


    @app.route("/retornar_prerequisitosXid/<int:id>", methods=["GET"])
    def retornar_prerequisitosXid(id): 
        lista = cal.listar_prerequisitosXid(id)
        pre = [prerequisito for prerequisito in lista]
        prere = {'prerequisitos': pre}
        return jsonify(prere)
    

    @app.route("/listar_Todoslosactosliturgicos", methods=["GET"])
    def listar_Todoslosactosliturgicos():
        try:
            lista = cal.obtener_actosliturgicos()
            lista_data = []
            for row in lista:
                valores = {
                    'id': row[0],
                    'nombreliturgia': row[1],
                    'requisitos': row[2]
                }
                lista_data.append(valores)

            lista_actos = {
                'estado': 1,
                'respuesta':"Se listo correctamente los actos liturgicos",
                'data': lista_data
            }

        except:
            lista_actos = [{
                'estado': 0,
                'mensaje': "No se pudo listar los actos liturgicos",
                'data': 0 
            }]

        return jsonify(lista_actos)
    
    @app.route("/duplicidad/<string:nombre>", methods=["GET"])
    def duplicidad(nombre):
        try:
            datos = cal.duplicidad(nombre)
            if datos:
                return jsonify({'name': True})
            else:
                return jsonify({'name':False})
        except:
            return jsonify(nombre)
        return "hello"

