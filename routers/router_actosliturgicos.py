from flask import Flask, request, render_template, flash, redirect, url_for, jsonify
import controladores.controlador_actosliturgicos as cal
import json
import urllib.parse
import envio_correo 

def registrar_rutas(app):
    @app.route("/gestionar_actosliturgicos", methods=["GET"])
    def gestionar_actosliturgicos():
       
        return render_template("/actos_liturgicos/gestionar_actoliturgico.html")
    
    @app.route("/modificarActoPrerequisito", methods=["POST"])
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
    def registrarActoLiturgico_Requisitos():
        actoliturgico = request.json['acto']
        requisitos = request.json['requisitos']
        monto = request.json['monto']
        estado = cal.insertar_acto_requisitos(actoliturgico,monto,requisitos)
        return jsonify({'estado': estado})
        
    @app.route("/lista_actos_requisitos", methods=["GET"])
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
    def duplicidad(nombre):
        lista = cal.duplicidad(nombre)
        return jsonify({'existe': lista})
    
    @app.route("/requisitosXactoliturgico", methods=["GET"])  # Sin barra final
    def requisitosXactoliturgico():
        lista = cal.listar_nombres_actos()
        requisitos = cal.listar_actos_requisitos()

        return render_template('/actos_liturgicos/requisitos_actoliturgico.html', lista=lista, requisitos= requisitos)

    @app.route("/filtrorequisitosxacto/<string:acto>", methods=["GET"]) 
    def filtrorequisitosxacto(acto):
        lista_actos = []
        if(acto == "todos"):
            requisitos = cal.listar_actos_requisitos()
            for r in requisitos:
                dato = {
                    'id': r[0],
                    'nombre_acto': r[1],
                    'requisitos': r[2],
                    'monto' : r[3]
                }
                lista_actos.append(dato)
            
        else:
            r = cal.listar_requisitoXacto(acto)
            dato = {
                'id': r[0],
                'nombre_acto': r[1],
                'requisitos': r[2],
                'monto' : r[3]
            }
            lista_actos.append(dato)
        return jsonify({'data': lista_actos})
    
    @app.route('/enviar', methods=['POST'])
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
    def eliminaracto_requisitos(id):
        resultado = cal.eliminaracto_requisitos(id)
        return jsonify({'estado': resultado})
        

    

        
        

        