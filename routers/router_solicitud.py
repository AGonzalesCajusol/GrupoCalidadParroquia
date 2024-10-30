from flask import render_template, request, redirect, url_for, flash, jsonify
import controladores.controlador_actosliturgicos as cactos
import controladores.controlador_programacion as ccharla
import controladores.controlador_feligres as cfel

def registrar_rutas(app):
    # Ruta para gestionar tipos de ministro
    @app.route('/solicitudes')
    def solicitudes():
        lista_actos = cactos.listar_actosLit()
        return render_template('solicitudes/solicitudes_actoliturgico.html', lista_actos=lista_actos)
    

    @app.route('/calendario_solicitud/<string:actoliturgico>')
    def calendario_solicitud(actoliturgico):
        charlas = ccharla.charlas_acto(actoliturgico)
        lista_charlas = []
        for ch in charlas:
            lista_charlas.append({
                'id': ch[0],
                'descripcion':ch[1],
                'fecha': str(ch[2]),
                'hora_inicio': str(ch[3]),
                'hora_fin':str(ch[4]),
            })
        return jsonify(lista_charlas)
    

    @app.route('/requisitosXacto/<int:id_actoliturgico>' , methods=['GET'])
    def requisitosXacto(id_actoliturgico):
        requisitos = cactos.listar_requisitos(id_actoliturgico)
        lista_requisitos = []
        for requisito in requisitos:
            lista_requisitos.append({
                'id': requisito[0],
                'nombre_requisito':requisito[1],
                'id_actoliturgico': requisito[2],
                'tipo': requisito[3],
                'estado':requisito[4],
                'maximo':requisito[5],
                'minimo':requisito[6],
            })
        return jsonify(lista_requisitos)
    
    @app.route('/validar_dni/<int:dni>' , methods=['GET'])
    def validar_dni(dni):
        feligres = cfel.obtener_feligres_por_dni(dni)
        if feligres:
            return jsonify({'estado':'si',
                            'nombre': f"{feligres[2]} {feligres[3]}" 
                            })
        else:
            return jsonify({'estado':'no'})
        
    @app.route('/monto_acto/<int:acto_id>' , methods=['GET'])
    def monto_actos(acto_id):
        monto = cactos.monto_acto(acto_id)
        print(monto)
        if monto > 0:
            return jsonify({'estado':'si',
                            'monto': monto
                            })
        else:
            return jsonify({'estado':'no'})
        
    @app.route('/apilistaactos' , methods=['GET'])
    def monto_acto(acto_id):
        monto = cactos.monto_acto(acto_id)
        print(monto)
        if monto > 0:
            return jsonify({'estado':'si',
                            'monto': monto
                            })
        else:
            return jsonify({'estado':'no'})
        





