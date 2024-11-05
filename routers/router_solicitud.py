from flask import render_template, request, redirect, url_for, flash, jsonify
import controladores.controlador_actosliturgicos as cactos
import controladores.controlador_programacion as ccharla
import controladores.controlador_feligres as cfel
import controladores.controladro_solicitud as csoli
import os



def registrar_rutas(app):
    # Ruta para gestionar tipos de ministro
    @app.route('/solicitudes')
    def solicitudes():
        lista_actos = cactos.listar_actosLit()
        return render_template('solicitudes/solicitudes_actoliturgico.html', lista_actos=lista_actos)
    

    @app.route('/calendario_solicitud/<int:id_charla>')
    def calendario_solicitud(id_charla):
        charlas = ccharla.charlas_acto(id_charla)
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
                'id_requisito': requisito[7],
                'id_estador': requisito[8],
                'nivel': requisito[9] 
            })
        return jsonify(lista_requisitos)
    
    @app.route('/validar_dni/<int:dni>' , methods=['GET'])
    def validar_dni(dni):
        feligres = cfel.obtener_feligres_por_dni(dni)
        if feligres:
            return jsonify({'estado':'si',
                            'nombre': f"{feligres[1]} {feligres[2]}" 
                            })
        else:
            return jsonify({'estado':'no'})
        
    @app.route('/monto_acto/<string:acto_liturgico>/<string:sede>/<int:dni_responsable>/<int:dni1>/<int:dni2>', methods=['GET'])
    def monto_actos(acto_liturgico, sede, dni_responsable, dni1, dni2=''):

        monto = cactos.monto_total(acto_liturgico, sede, dni_responsable, dni1, dni2)
        
        # Imprimir el monto total
        print("Monto Total:", monto)

        if monto == 0:
            return jsonify({'estado': 'no'}) 
        else:
            return jsonify({'estado': 'si', 'datos': monto})
            
    @app.route('/charlas_rangoaño/<string:acto_liturgico>', methods=['GET'])
    def charlas_rangoaño(acto_liturgico):
        charlas = csoli.charlas_rangoaño(acto_liturgico)
        lista_charlas = []
        if charlas is not  None:
            for ch in charlas:
                lista_charlas.append({
                    'id_charla': ch[0],
                    'charla': ch[1]
                })
            return jsonify({'data': lista_charlas})
        return jsonify({'data': 'Error'})



    @app.route('/registrarsolicitud/<int:acto_liturgico>', methods=['POST'])
    def registrarsolicitud(acto_liturgico):
        #Insertamos si es matrimonio
        if acto_liturgico == 1:
            requisitos_data = {
                'id_acto' : 1,
                'metodo': request.form.get('metodo'),
                'dni_responsable': request.form.get('responsable'),
                'dni_novio': request.form.get('dni_novio'),
                'dni_novia': '01234567',
                #'dni_novia': request.form.get('dni_novia'),
                'dni_testigo1': request.form.get('dni_testigo1'),
                'dni_testigo2': request.form.get('dni_testigo2'),
                'sede': request.form.get('sede'),
                'f_matrimonio': request.form.get('f_matrimonio'),
                'charlas': request.form.get('charlas'),
                'copia_dninovio': request.files.get('copia_dninovio'),
                'copia_dninovia': request.files.get('copia_dninovia'),
                'consb_novio': request.files.get('consb_novio'),
                'consc_novio': request.files.get('consc_novio'),
                'consb_novia': request.files.get('consb_novia'),
                'consc_novia': request.files.get('consc_novia'),
                'fc_novio': request.files.get('fc_novio'),
                'fc_novia': request.files.get('fc_novia'),
                'fvih_novio': request.files.get('fvih_novio'),
                'fvih_novia': request.files.get('fvih_novia'),
                'es_dni_novio': request.form.get('es_dni_novio'),
                'es_copia_dninovio': request.form.get('es_copia_dninovio'),
                'es_dni_novia': request.form.get('es_dni_novia'),
                'es_copia_dninovia': request.form.get('es_copia_dninovia'),
                'es_dni_testigo1': request.form.get('es_dni_testigo1'),
                'es_dni_testigo2': request.form.get('es_dni_testigo2'),
                'es_sede': request.form.get('es_sede'),
                'es_f_matrimonio': request.form.get('es_f_matrimonio'),
                'es_consb_novio': request.form.get('es_consb_novio'),
                'es_consc_novio': request.form.get('es_consc_novio'),
                'es_consb_novia': request.form.get('es_consb_novia'),
                'es_consc_novia': request.form.get('es_consc_novia'),
                'es_fc_novio': request.form.get('es_fc_novio'),
                'es_fc_novia': request.form.get('es_fc_novia'),
                'es_fvih_novio': request.form.get('es_fvih_novio'),
                'es_fvih_novia': request.form.get('es_fvih_novia'),
                'es_charlas': request.form.get('es_charlas'),
            }
            try:
                estado = csoli.insertar_solicitudMatrimonio(requisitos_data) 
                if estado:
                    return jsonify({'estado': 'Correcto'})
                else:
                    return jsonify({'estado': 'Error'})
            except Exception as e:
                return jsonify({'estado': 'Error'})