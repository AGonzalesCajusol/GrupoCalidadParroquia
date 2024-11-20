from flask import render_template, request, redirect, url_for, flash, jsonify
import controladores.controlador_actosliturgicos as cactos
import controladores.controlador_programacion as ccharla
import controladores.controlador_feligres as cfel
import controladores.controladro_solicitud as csoli
import os, base64
from routers.router_main import requerido_login


def registrar_rutas(app):
    # Ruta para gestionar tipos de ministro
    @app.route('/solicitudes')
    def solicitudes():
        nombre_sede = request.cookies.get('sede')
        lista_actos = cactos.listar_actosxsede(nombre_sede)
        return render_template('solicitudes/solicitudes_actoliturgico.html', lista_actos=lista_actos)
    
    @app.route('/listar_solicitudes', methods=['GET'])
    def listar_solicitudes():
        sede = request.cookies.get('sede')
        solicitudes = csoli.solicitudes(sede)
        listar_solicitudes = []
        if solicitudes != 'Error':
            for sl in solicitudes:
                listar_solicitudes.append({
                'id_solicitud': sl[0],
                'id_sede': sl[1],
                'nombre_sede' : sl[2],
                'dni': sl[3],
                'nombre_liturgia': sl[4],
                'nombres': sl[5],
                'fecha': str(sl[6])
            })
            return jsonify({'data': listar_solicitudes})
        return jsonify({'mensaje': 'Error'})
    

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
    

    @app.route('/fcelebraciones/<int:acto>', methods=['GET'])
    def fcelebraciones(acto):
        sede = request.cookies.get('sede')
        charlas = csoli.fcelebraciones(acto,sede)
        lista_charlas = []
        if charlas is not  None:
            for ch in charlas:
                lista_charlas.append({
                    'id_charla': ch[0],
                    'charla': ch[1]
                })
            return jsonify({'data': lista_charlas})
        return jsonify({'data': 'Error'})
    
    @app.route('/horario_cl/<int:id>', methods=['GET','POST'])
    def horario_cl(id):
        datos = csoli.horario_cl(id)
        lista_datos = []

        if datos == 0:
            return jsonify({"mensaje": "Error"}), 500
        else:
            for data in datos:
                lista_datos.append({
                    'descripcion': data[0],
                    'fecha': str(data[1]),
                    'hora_inicio': str(data[2]),
                    'hora_fin': str(data[3]),
                })
            print(data)
            return jsonify({'mensaje': "OK",
                           'data': lista_datos})


    @app.route('/registrarsolicitud/<int:acto_liturgico>', methods=['GET','POST'])
    def registrarsolicitud(acto_liturgico):
        if acto_liturgico == 1:
            requisitos_data = {
                'id_acto' : 1,
                'metodo': request.form.get('metodo'),
                'dni_responsable': request.form.get('responsable'),
                'dni_novio': request.form.get('dni_novio'),
                'dni_novia': request.form.get('dni_novia'),
                'dni_testigo1': request.form.get('dni_testigo1'),
                'dni_testigo2': request.form.get('dni_testigo2'),
                'sede': request.form.get('sede'),
                'f_matrimonio': request.form.get('f_matrimonio'),
                'charlas': '',
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
        elif acto_liturgico == 2:
            requisitos_bautismo = {
                'id_charla': request.form.get('id_charla'),
                'charbau': request.form.get('id_charla'),
                'metodo': request.form.get('metodo'),
                'id_acto' : 2,
                'dni_padrino' : request.form.get('dni_padrino'),
                'dni_madrina': request.form.get('dni_madrina'),
                'co_dniactan': request.files.get('co_dniactan'),
                'nom_niño': request.form.get('nom_niño'),
                'cop_dni_padres': request.files.get('cop_dni_padres'),
                'cop_agualuz': request.files.get('cop_agualuz'),
                'cop_conspadrino': request.files.get('cop_conspadrino'),
                'cop_consmadrina': request.files.get('cop_consmadrina'),
                'dni_tutor': request.form.get('dni_tutor'),
                'sedebau': request.form.get('sedebau'),
            }
            
            try:
                print("oks")
                estado = csoli.insertar_bautismo(requisitos_bautismo) 
                if estado == 1:
                    return jsonify({'estado': 'Correcto'})
                else:
                    return jsonify({'estado': 'Error'})
            except Exception as e:
                return jsonify({'estado': 'Error'})
        elif acto_liturgico == 3:

            requisitos_confirmacion = {
                'id_acto' : 3,
                'id_charla': request.form.get('id_charla'),
                'charlas': request.form.get('id_charla'),
                'const_bautizo': request.files.get('const_bautizo'),
                'dni_confirmado': request.form.get('dni_confirmado'),
                'dni_padrino_madrina': request.form.get('dni_padrino_madrina'),
                'sede':request.form.get('sede'),
                'metodo': request.form.get('metodo')
            }
                     
            print(requisitos_confirmacion)
            try:
                estado = csoli.insertar_confirmacion(requisitos_confirmacion)
                if estado == 1:
                    return jsonify({'estado': 'Correcto'})
                else:
                    return jsonify({'estado': 'Error'})
            except Exception as e:
                return jsonify({'estado':'Error'})
        elif acto_liturgico == 6:
            requisitos_confirmacion = {
                'id_acto' : 6,
                'id_charla': request.form.get('id_charla'),
                'charlas': request.form.get('id_charla'),
                'dni_pri_responsable':request.form.get('dni_pri_responsable'),
                'dni_pri_celebrante':request.files.get('dni_pri_celebrante'),
                'dni_pradri_madri':request.files.get('dni_pradri_madri'), 
                'constan_bau_celebrante':request.files.get('constan_bau_celebrante'),
                'cosntan_estudios': request.files.get('cosntan_estudios'),
                'cop_luz_agua': request.files.get('cop_luz_agua'),
                'dni_celebrante': request.form.get('dni_celebrante'),
                'sede': request.form.get('sede'),
                'metodo': request.form.get('metodo')
            }
                     
            print(requisitos_confirmacion)
            try:
                estado = csoli.primeracomu(requisitos_confirmacion)
                if estado == 1:
                    return jsonify({'estado': 'Correcto'})
                else:
                    return jsonify({'estado': 'Error'})
            except Exception as e:
                return jsonify({'estado':'Error'}) 
    
    @app.route('/verificar_fecha/<string:fecha>', methods=['GET', 'POST'])
    def verificar_fecha(fecha):
        sede = request.cookies.get('sede')
        valor = csoli.verificar_fecha(fecha,sede)
        if valor ==0:
            print("A")
            return jsonify({'estado': "Aceptado"})
        else:
      
            return jsonify({'estado': "Rechazado"})

    @app.route('/montobautismo/<string:sede>', methods=['GET'])
    def montobautismo(sede):
        monto = csoli.monto_butismo(sede)
        
        # Imprimir el monto total
        print("Monto Total:", monto)

        if monto == 0:
            return jsonify({'estado': 'no'}) 
        else:
            return jsonify({'estado': 'si', 'datos': monto})
        
    @app.route('/confirmado/<string:sede>', methods=['GET'])
    def confirmado(sede):
        monto = csoli.monto_confirmacion(sede)
        
        # Imprimir el monto total
        print("Monto Total:", monto)

        if monto == 0:
            return jsonify({'estado': 'no'}) 
        else:
            return jsonify({'estado': 'si', 'datos': monto})
        
    @app.route('/primeracm/<string:sede>', methods=['GET'])
    def primeracm(sede):
        monto = csoli.monto_primera(sede)
        
        # Imprimir el monto total
        print("Monto Total:", monto)

        if monto == 0:
            return jsonify({'estado': 'no'}) 
        else:
            return jsonify({'estado': 'si', 'datos': monto})
        
    @app.route('/asistencias_solicitud/<int:id_solicitud>', methods=['GET'])
    def asistencias_solicitud(id_solicitud):
        asistencias = csoli.obtener_asistencias(id_solicitud)
        lista_asistencia = []
        if asistencias == 0:
            return jsonify({'estado': 'no'})
        else:
            for asis in asistencias:
                lista_asistencia.append({
                    'id_asistencia': asis[0],
                    'descripcion':asis[1],
                    'fecha':str(asis[2]),
                    'rol':asis[3],
                    'dni':asis[4],
                    'nombre':asis[5],
                    'estado':asis[6],
                })          
            return jsonify({'estado': 'si',
                            'data': lista_asistencia})
        
    @app.route('/check_asistencia/<int:id>/<int:estado>', methods=['GET'])
    def check_asistencia(id,estado):
        valor = csoli.check_asistencia(id,estado)
        if valor == 1:
            return jsonify({'estado': 'correcto'})
        else:
            return jsonify({'estado': 'incorrecto'})
        
    @app.route('/datos_solicitud/<int:id>', methods=['GET'])
    def datos_solicitud(id):
        valores = csoli.datos_soliictud_matrimonio(id)
        data = []

        if valores == 0:
            return jsonify({'estado': 'incorrecto'})
        else:
            for v in valores:
                data.append({
                    'campo1': v[0],
                    'campo2': v[1],
                    'id': v[2],
                    'estado': v[3],
                    'valor': str(v[4]),
                    'tipo': v[5]
                })

            return jsonify({'estado': 'Correcto',
                            'data': data})
        
    @app.route('/datos_charlas/<int:id>', methods=['GET'])
    def datos_charlas(id):
        valores = csoli.viww(id)
        lista_datos = []

        if valores == 0:
            return jsonify({'estado': 'incorrecto'})
        else:
            for data  in valores:
                lista_datos.append({
                    'descripcion': data[0],
                    'fecha': str(data[1]),
                    'hora_inicio': str(data[2]),
                    'hora_fin': str(data[3]),
                })
            print(lista_datos)
            return jsonify({'estado': 'Correcto',
                            'data': lista_datos})
        
    @app.route('/datos_charlas_confirmacion/<int:id>', methods=['GET'])
    def datos_charlas_confirmacion(id):
        sede = request.cookies.get('sede')
        id_acto = 3
        valores = csoli.ch_confir(sede,id_acto,id)
        lista_datos = []

        if valores == 0:
            return jsonify({'estado': 'incorrecto'})
        else:
            for data  in valores:
                lista_datos.append({
                    'descripcion': data[0],
                    'fecha': str(data[1]),
                    'hora_inicio': str(data[2]),
                    'hora_fin': str(data[3]),
                })
            print(lista_datos)
            return jsonify({'estado': 'Correcto',
                            'data': lista_datos})
        
    @app.route('/datos_charlas_comunion/<int:id>', methods=['GET'])
    def datos_charlas_comunion(id):
        sede = request.cookies.get('sede')
        id_acto = 6
        valores = csoli.ch_comunion(sede,id_acto,id)
        lista_datos = []

        if valores == 0:
            return jsonify({'estado': 'incorrecto'})
        else:
            for data  in valores:
                lista_datos.append({
                    'descripcion': data[0],
                    'fecha': str(data[1]),
                    'hora_inicio': str(data[2]),
                    'hora_fin': str(data[3]),
                })
            print(lista_datos)
            return jsonify({'estado': 'Correcto',
                            'data': lista_datos})
