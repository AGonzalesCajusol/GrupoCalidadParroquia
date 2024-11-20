    var plantilla_matrimonio =  
    `
        <tr>
                        <td>Copia del DNI del novio</td>
                        <td>
                            <input id="copia_dninovio" name="copia_dninovio" type="file" class="form-control" accept="image/*,application/pdf" required>
                        </td>
                        <td>
                            <input type="checkbox" name="es_copia_dninovio" id="es_copia_dninovio">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('copia_dninovio')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                            </button>
                                    
                        </td>
                    </tr><tr>
                        <td>DNI del novio</td>
                        <td>
                            
                    <div class="d-flex">
                        <div class="col-5">
                            <input id="dni_novio" name="dni_novio" oninput="desabilitar('es_dni_novio')" required="" type="number" max="99999999" min="10000000" class="form-control" placeholder="Ingrese un número">  
                        </div>
                        <div class="col-6">
                            <input type="text" id="Feligresdni_novio" name="Feligresdni_novio" class="form-control" placeholder="Nombre del feligres" readonly="" disabled="">
                        </div>
                    </div>
                
                        </td>
                        <td>
                            <input type="checkbox" onclick="validar_dni('dni_novio', 'es_dni_novio', 'Feligresdni_novio' )" name="es_dni_novio" id="es_dni_novio" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                        </td>
                    </tr><tr>
                        <td>Copia del DNI de la novia</td>
                        <td>
                            <input id="copia_dninovia" name="copia_dninovia" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_copia_dninovia" id="es_copia_dninovia">
                            <label for="">Validado</label>
                        </td>
                        <td>                      
                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('copia_dninovia')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                            </button>        
                        </td>
                    </tr><tr>
                        <td>DNI de la novia</td>
                        <td>
                            
                    <div class="d-flex">
                        <div class="col-5">
                            <input id="dni_novia" name="dni_novia" oninput="desabilitar('es_dni_novia')" required="" type="number" max="99999999" min="10000000" class="form-control" placeholder="Ingrese un número">  
                        </div>
                        <div class="col-6">
                            <input type="text" id="Feligresdni_novia" name="Feligresdni_novia" class="form-control" placeholder="Nombre del feligres" readonly="" disabled="">
                        </div>
                    </div>
                
                        </td>
                        <td>
                            <input type="checkbox" onclick="validar_dni('dni_novia', 'es_dni_novia','Feligresdni_novia')" name="es_dni_novia" id="es_dni_novia" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                        </td>
                    </tr><tr>
                        <td>DNI del primer testigo</td>
                        <td>
                            
                    <div class="d-flex">
                        <div class="col-5">
                            <input id="dni_testigo1" name="dni_testigo1" oninput="desabilitar('es_dni_testigo1')" required="" type="number" max="99999999" min="10000000" class="form-control" placeholder="Ingrese un número">  
                        </div>
                        <div class="col-6">
                            <input type="text" id="Feligresdni_testigo1" name="Feligresdni_testigo1" class="form-control" placeholder="Nombre del feligres" readonly="" disabled="">
                        </div>
                    </div>
                
                        </td>
                        <td>
                            <input type="checkbox" onclick="validar_dni('dni_testigo1', 'es_dni_testigo1','Feligresdni_testigo1')" name="es_dni_testigo1" id="es_dni_testigo1" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                        </td>
                    </tr><tr>
                        <td>DNI del segundo testigo</td>
                        <td>
                            
                    <div class="d-flex">
                        <div class="col-5">
                            <input id="dni_testigo2" name="dni_testigo2" oninput="desabilitar('es_dni_testigo2')" required="" type="number" max="99999999" min="10000000" class="form-control" placeholder="Ingrese un número">  
                        </div>
                        <div class="col-6">
                            <input type="text" id="Feligresdni_testigo2" name="Feligresdni_testigo2" class="form-control" placeholder="Nombre del feligres" readonly="" disabled="">
                        </div>
                    </div>
                
                        </td>
                        <td>
                            <input type="checkbox" onclick="validar_dni('dni_testigo2', 'es_dni_testigo2','Feligresdni_testigo2')" name="es_dni_testigo2" id="es_dni_testigo2" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                        </td>
                    </tr><tr>
                        <td>Sede a realizarse el acto litúrgico</td>
                        <td>
                            <input id="sede" name="sede" value="Sede Central" type="text" class="form-control" placeholder="Ingrese texto" disabled="">
                        </td>
                        <td>
                            <input type="checkbox" name="es_sede" id="es_sede" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                        </td>
                    </tr><tr>
                        <td>Fecha de matrimonio</td>
                        <td>
                            <input id="f_matrimonio"   name="f_matrimonio" required="" type="datetime-local" class="form-control">
                        </td>
                        <td>
                            <input type="checkbox" name="es_f_matrimonio" id="es_f_matrimonio" oninput="validar_fecha('f_matrimonio','es_f_matrimonio')">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                        </td>
                    </tr><tr>
                        <td>Constancia de bautismo del Novio</td>
                        <td>
                            <input id="consb_novio" name="consb_novio" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_consb_novio" id="es_consb_novio">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('consb_novio')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                            </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Constancia de confirmación del Novio</td>
                        <td>
                            <input id="consc_novio" name="consc_novio" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_consc_novio" id="es_consc_novio">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                                        <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('consc_novio')">
                                            <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                        </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Constancia de bautismo de la Novia</td>
                        <td>
                            <input id="consb_novia" name="consb_novia" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_consb_novia" id="es_consb_novia">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                                        <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('consb_novia')">
                                            <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                        </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Constancia de confirmación de la Novia</td>
                        <td>
                            <input id="consc_novia" name="consc_novia" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_consc_novia" id="es_consc_novia">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                                        <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('consc_novia')">
                                            <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                        </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Foto tamaño carnet del Novio</td>
                        <td>
                            <input id="fc_novio" name="fc_novio" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_fc_novio" id="es_fc_novio">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                                        <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('fc_novio')">
                                            <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                        </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Foto tamaño carnet de la Novia</td>
                        <td>
                            <input id="fc_novia" name="fc_novia" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_fc_novia" id="es_fc_novia">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                                        <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('fc_novia')">
                                            <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                        </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Prueba médica de VIH del Novio</td>
                        <td>
                            <input id="fvih_novio" name="fvih_novio" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_fvih_novio" id="es_fvih_novio">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                                        <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('fvih_novio')">
                                            <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                        </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Prueba médica de VIH de la Novia</td>
                        <td>
                            <input id="fvih_novia" name="fvih_novia" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_fvih_novia" id="es_fvih_novia">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            
                                        <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('fvih_novia')">
                                            <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                        </button>
                                    
                        </td>
                    </tr><tr>
                        <td>Charlas preparatorias para los involucrados</td>
                        <td>
                            <div id="rcharlas"></div>
                        </td>
                        <td>
                            <input type="checkbox" name="es_charlas" id="es_charlas" >
                            <label for="">Validado</label>
                        </td>
                        <td>
                
                        <button  id="charlas" class="btn btn-primary btn-sm" type="button" onclick="visualizar_calendario('charlas')">
                            <i class="bi bi-calendar3"></i>
                        </button>
                                
                        </td>
                    </tr>
    `;
    var plantilla_bautismo  =
`
    <tr>
        <td>DNI del padrino</td>
        <td>
            
    <div class="d-flex">
        <div class="col-5">
            <input id="dni_padrino" oninput="desabilitar('es_dni_padrino')" name="dni_padrino" required="" type="number" max="99999999" min="11111111" class="form-control" placeholder="Ingrese un DNI vigente">  
        </div>
        <div class="col-6">
            <input type="text" id="nombre_feligres" name="nombre_feligres" class="form-control" placeholder="Nombre del padrino" readonly="" disabled="">
        </div>
    </div>

        </td>
        <td>
            <input type="checkbox"  id="es_dni_padrino" onclick="validar_dni('dni_padrino', 'es_dni_padrino', 'nombre_feligres')" name="es_dni_padrino" required>
            <label for="">Validado</label>
        </td>
        <td>
                
        </td>
    </tr><tr>
        <td>DNIde la madrina </td>
        <td>
            
    <div class="d-flex">
        <div class="col-5">
            <input id="dni_madrina" name="dni_madrina" oninput="desabilitar('es_dni_madrina')" required="" type="number" max="99999999" min="100000000" class="form-control" placeholder="Ingrese un número">  
        </div>
        <div class="col-6">
            <input type="text" id="nombre_madrina" name="nombre_madrina" class="form-control" placeholder="Nombre de la madrina" readonly="" disabled="">
        </div>
    </div>

        </td>
        <td>
            <input type="checkbox" onclick="validar_dni('dni_madrina', 'es_dni_madrina','nombre_madrina')" name="es_dni_madrina" id="es_dni_madrina" required="">
            <label for="">Validado</label>
        </td>
        <td>
                
        </td>
    </tr><tr>
        <td>Copia del DNI o acta de nacimiento del niño(a)</td>
        <td>
            <input id="co_dniactan" name="co_dniactan" required type="file" class="form-control" accept="image/*,application/pdf" >
        </td>
        <td>
            <input type="checkbox" name="es_co_dniactan" id="es_co_dniactan" required="">
            <label for="">Validado</label>
        </td>
        <td>
            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('co_dniactan')">
                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
            </button>    
        </td>
    </tr><tr>
        <td>Nombre del niño (a)</td>
        <td>
            <input id="nom_niño" name="nom_niño" oninput="desabilitar('es_niño')" required="" type="text" maxlength="70" minlength="15" class="form-control" placeholder="Ingrese texto">
        </td>
        <td>
            <input type="checkbox" onclick=validarNombre('nom_niño','es_niño') name="es_niño" id="es_niño" required="">
            <label for="">Validado</label>
        </td>
        <td>
                
        </td>
    </tr><tr>
        <td>Copia del DNI de los padres</td>
        <td>
            <input id="cop_dni_padres" name="cop_dni_padres" required="file" type="file" class="form-control" accept="image/*,application/pdf">
        </td>
        <td>
            <input type="checkbox" name="es_cop_dni_padres" id="es_cop_dni_padres" required="">
            <label for="">Validado</label>
        </td>
        <td>
            
            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('cop_dni_padres')">
                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
            </button>
                    
        </td>
    </tr><tr>
        <td>Copia recibo de luz o agua</td>
        <td>
            <input id="cop_agualuz" name="cop_agualuz" type="file" class="form-control" accept="image/*,application/pdf">
        </td>
        <td>
            <input type="checkbox" name="es_cop_agualuz" id="es_cop_agualuz">
            <label for="">Validado</label>
        </td>
        <td>
            
            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('cop_agualuz')">
                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
            </button>
                    
        </td>
    </tr><tr>
        <td>Constancia de confirmación del padrino</td>
        <td>
            <input id="cop_conspadrino" name="cop_conspadrino" required="" type="file" class="form-control" accept="image/*,application/pdf">
        </td>
        <td>
            <input type="checkbox" name="es_cop_conspadrino" id="es_cop_conspadrino" accept="image/*,application/pdf">
            <label for="">Validado</label>
        </td>
        <td>
            
            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('cop_conspadrino')">
                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
            </button>
                    
        </td>
    </tr><tr>
        <td>Constancia de confirmación de la madrina</td>
        <td>
            <input id="cop_consmadrina" name="cop_consmadrina" required="" type="file" class="form-control" accept="image/*,application/pdf">
        </td>
        <td>
            <input type="checkbox" name="es_cop_consmadrina" id="es_cop_consmadrina" required="">
            <label for="">Validado</label>
        </td>
        <td>
            
            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('cop_consmadrina')">
                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
            </button>
                    
        </td>
    </tr><tr>
        <td>DNI del tutor</td>
        <td>
            
    <div class="d-flex">
        <div class="col-5">
            <input id="dni_tutor" name="dni_tutor" oninput="dni_tutor('es_dni_tutor)" required="" type="number" max="0" min="0.1" class="form-control" placeholder="Ingrese un número">  
        </div>
        <div class="col-6">
            <input type="text" id="nombre_tutor" name="nombre_tutor" class="form-control" placeholder="Nombre del feligres" readonly="" disabled="">
        </div>
    </div>

        </td>
        <td>
            <input type="checkbox" onclick="validar_dni('dni_tutor', 'es_dni_tutor','nombre_tutor')" name="es_dni_tutor" id="es_dni_tutor" required="">
            <label for="">Validado</label>
        </td>
        <td>
                
        </td>
    </tr><tr>
        <td>Sede a realizarse el acto litúrgico	</td>
        <td>
            <input id="sedebau" name="sedebau" value="Sede Central" type="text" class="form-control" placeholder="Ingrese texto" disabled="">
        </td>
        <td>
            <input type="checkbox" name="es_sedebau" id="es_sedebau" required="">
            <label for="">Validado</label>
        </td>
        <td>
                
        </td>
    </tr><tr>
        <td>Charla de preparación para padres y padrinos	</td>
        <td>
            <div id="rcharlas">
                <select class="form-select" name="cha" id="cha">
                </select>
            </div>
        </td>


        <td>
            <input type="checkbox" name="es_charlas" id="es_charlas" required="">
            <label for="">Validado</label>
        </td>
        <td>
            
                    <button  id="charbau" class="btn btn-primary" type="button" onclick="ver_fechas()">
                        <i class="bi bi-calendar3"></i>
                    </button>
                
        </td>
    </tr>

    `;
    var primera_comunion = 
`
    <tr>
                        <td>DNI responsable </td>
                        <td>

                    <div class="d-flex">
                        <div class="col-5">
                            <input id="dni_pri_responsable" name="dni_pri_responsable" oninput="desabilitar('es_dni_pri_responsable')" required="" type="number" max="99999999" min="10000000" class="form-control" placeholder="Ingrese un número">
                        </div>
                        <div class="col-6">
                            <input type="text" id="nombre_responsable" name="Feligresnull" class="form-control" placeholder="Nombre del responsable" readonly="" disabled="">
                        </div>
                    </div>

                        </td>
                        <td>
                            <input type="checkbox" onclick="validar_dni('dni_pri_responsable','es_dni_pri_responsable','nombre_responsable')" name="es_dni_pri_responsable" id="es_dni_pri_responsable" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>

                        </td>
                    </tr><tr>
                        <td>Copia del DNI celebrante</td>
                        <td>
                            <input id="dni_pri_celebrante" name="dni_pri_celebrante" required="" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_dni_pri_celebrante" id="es_dni_pri_celebrante" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>

                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('dni_pri_celebrante')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                            </button>

                        </td>
                    </tr><tr>
                        <td>Copia DNI del padrino o madrina</td>
                        <td>
                            <input id="dni_pradri_madri" name="dni_pradri_madri" required="" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_dni_pradri_madri" id="es_dni_pradri_madri" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>

                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('dni_pradri_madri')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                            </button>
                        </td>
                    </tr><tr>
                        <td>Copia de constancia de bautismo del celebrante</td>
                        <td>
                            <input id="constan_bau_celebrante" name="constan_bau_celebrante" required="" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_constan_bau_celebrante" id="es_constan_bau_celebrante" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>

                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('constan_bau_celebrante')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                            </button>
                        </td>
                    </tr><tr>
                        <td>Constancia de estudios de 3°, 4° o 5° primaria</td>
                        <td>
                            <input id="cosntan_estudios" name="cosntan_estudios" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_cosntan_estudios" id="es_cosntan_estudios">
                            <label for="">Validado</label>
                        </td>
                        <td>
                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('cosntan_estudios')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                            </button>
                        </td>
                    </tr><tr>
                        <td>Copia de recibo de luz o agua</td>
                        <td>
                            <input id="cop_luz_agua" name="cop_luz_agua" type="file" class="form-control" accept="image/*,application/pdf">
                        </td>
                        <td>
                            <input type="checkbox" name="es_cop_luz_agua" id="es_cop_luz_agua">
                            <label for="">Validado</label>
                        </td>
                        <td>

                            <button type="button" class="btn btn-primary btn-sm" title="Ver" onclick="visualizar('cop_luz_agua')">
                                <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM432 256c0 79.45-64.47 144-143.9 144C208.6 400 144 335.5 144 256S208.5 112 288 112S432 176.5 432 256zM288 160C285.7 160 282.4 160.4 279.5 160.8C284.8 170 288 180.6 288 192c0 35.35-28.65 64-64 64C212.6 256 201.1 252.7 192.7 247.5C192.4 250.5 192 253.6 192 256c0 52.1 43 96 96 96s96-42.99 96-95.99S340.1 160 288 160z"></path></svg><!-- <i class="fas fa-eye"></i> Font Awesome fontawesome.com -->
                                </button>
                        </td>
                    </tr><tr>
                        <td>DNI del celebrante </td>
                        <td>

                    <div class="d-flex">
                        <div class="col-5">
                            <input id="dni_celebrante" name="dni_celebrante" oninput="desabilitar('es_dni_celebrante')" required="" type="number" max="99999999" min="10000000" class="form-control" placeholder="Ingrese un número">
                        </div>
                        <div class="col-6">
                            <input type="text" id="nombre_responsable2" name="Feligresnull" class="form-control" placeholder="Nombre del responsable" readonly="" disabled="">
                        </div>
                    </div>

                        </td>
                        <td>
                            <input type="checkbox" onclick="validar_dni('dni_celebrante','es_dni_celebrante','nombre_responsable2')" name="es_dni_celebrante" id="es_dni_celebrante" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>
                        </td>
                    <tr></tr>
                        <td>Nombre sede</td>
                        <td>
                            <input id="sede" name="sede" value="Sede Central" type="text" class="form-control" placeholder="Ingrese texto" disabled="">
                        </td>
                        <td>
                            <input type="checkbox" name="es_sede" id="es_sede" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>

                        </td>
                    </tr>
                    <tr>
                        <td>charlas preparación</td>
                        <td>
                            <div id="rcharlas">
                                <select class="form-select" name="cha" id="cha">
                            </select>
                        </td>
                        <td>
                            <input type="checkbox" name="es_charlas" id="es_charlas" required="">
                            <label for="">Validado</label>
                        </td>
                        <td>

                                    <button class="btn btn-primary" type="button" onclick="ver_fechas()">
                                        <i class="bi bi-calendar3"></i>
                                    </button>

                        </td>
                    </tr>
    `
    ;

    var confirmacion = 
    `
        <tr>
            <td>Constancia de bautizo</td>
            <td>
                <input id="const_bautizo" name="const_bautizo" type="file" class="form-control" accept="image/*,application/pdf" required>
            </td>
            <td>
                <input type="checkbox" name="es_const_bautizo" id="es_const_bautizo" required>
                <label for="es_const_bautizo">Validado</label>
            </td>
            <td>
                <button type="button" class="btn btn-primary btn-sm" title="Ver constancia de bautizo" onclick="visualizar('const_bautizo')">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        </tr>

        <!-- DNI del Confirmado -->
        <tr>
            <td>DNI del confirmado</td>
            <td>
                <div class="d-flex">
                    <div class="col-5">
                        <input id="dni_confirmado" name="dni_confirmado" type="number" class="form-control" placeholder="Ingrese el DNI" min="10000000" max="99999999" required>
                    </div>
                    <div class="col-6">
                        <input type="text" id="nombre_confirmado" name="nombre_confirmado" class="form-control" placeholder="Nombre del confirmado" readonly disabled>
                    </div>
                </div>
            </td>
            <td>
                <input type="checkbox" name="es_dni_confirmado" id="es_dni_confirmado" onclick="validar_dni('dni_confirmado', 'es_dni_confirmado','nombre_confirmado')" required>
                <label for="es_dni_confirmado">Validado</label>
            </td>
            <td></td>
        </tr>

        <!-- DNI del Padrino o Madrina -->
        <tr>
            <td>DNI del padrino o madrina</td>
            <td>
                <div class="d-flex">
                    <div class="col-5">
                        <input id="dni_padrino_madrina" name="dni_padrino_madrina" type="number" class="form-control" placeholder="Ingrese el DNI" min="10000000" max="99999999" required>
                    </div>
                    <div class="col-6">
                        <input type="text" id="nombre_padrino_madrina" name="nombre_padrino_madrina" class="form-control" placeholder="Nombre del padrino/madrina" readonly disabled>
                    </div>
                </div>
            </td>
            <td>
                <input type="checkbox" name="es_dni_padrino_madrina" id="es_dni_padrino_madrina" onclick="validar_dni('dni_padrino_madrina', 'es_dni_padrino_madrina' ,'nombre_padrino_madrina')" required>
                <label for="es_dni_padrino_madrina">Validado</label>
            </td>
            <td></td>
        </tr>

        <!-- Sede donde se realizará -->
        <tr>
            <td>Sede donde se realizará</td>
            <td>
                <input id="sede" name="sede" value="Sede Central" type="text" class="form-control" disabled>
            </td>
            <td>
                <input type="checkbox" name="es_sede" id="es_sede" required>
                <label for="es_sede">Validado</label>
            </td>
            <td></td>
        </tr>

        <!-- Charlas preparatorias -->
        <tr>
            <td>Charlas preparatorias</td>
            <td>
                <div id="rcharlas">
                    <select class="form-select" name="cha" id="cha">
                </select>
            </div>
            </td>
            <td>
                <input type="checkbox" name="es_charlas" id="es_charlas">
                <label for="es_charlas">Validado</label>
            </td>
            <td>
                <button id="charlas" class="btn btn-primary btn-sm" type="button" title="Visualizar calendario de charlas" onclick="ver_fechas()">
                    <i class="bi bi-calendar3"></i>
                </button>
            </td>
        </tr>
    `
    ;



    document.addEventListener('DOMContentLoaded', function() {
        listar_solicitudes();
    });


    function exportarTablaPDF() {
        const tabla = document.getElementById('miTabla');
        const tabla2 = tabla.cloneNode(true); // Clona la tabla existente
        tabla2.id = 'miTablaClonada';

        html2pdf(tabla2, {
            margin: 1,
            filename: 'tabla_excluyendo_columna.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        });
    }

    function validar_fecha(fecha, estado ){
        var fecha_hora = document.getElementById(fecha); 
        var st = document.getElementById(estado);
        if (fecha_hora.value.length == 0){
            alert("Registre una fecha válida");
            st.checked = false;
        }else{
            if (st.checked){
                fetch(`/verificar_fecha/${fecha_hora.value}`)
                .then(response => {return response.json()})
                .thaen(item => {
                    if (item.estado == "Aceptado"){
                        st.checked = true;
                        fecha_hora.disabled = true;
                    }else{
                        st.checked = false;
                        fecha_hora.disabled = false
                        alert("Fecha y hora ya reservada, ingrese otra");
                    }
                })
            }else{
                fecha_hora.disabled = false
            }
        }

    }


    function retornar(){
        document.getElementById('accordionRequisitos').classList.remove("d-none");
        document.getElementById('aaa').classList.remove("d-none");
        document.getElementById('bbb').disabled = false;
        document.getElementById('contenido_calendario_celebracion').classList.add("d-none");
    }
    const acordeon = document.getElementById('requi_actos');

    function verificar() {
        document.getElementById('estado_general').disabled = false;
        var btn = document.getElementById('registrar').classList.remove('d-none');

        var selectElement = document.getElementById('acto_seleccionado');
        var selectedOption = selectElement.options[selectElement.selectedIndex];
        var textoSeleccionado = selectedOption.text;
        var requi_actos = document.getElementById('datos_solicitud');
        requi_actos.textContent = "";
        var estadog = document.getElementById('estado_general');
        estadog.checked = false;

        var formulario = document.getElementById('requi_actos');
        formulario.classList.remove('d-none');
        if (textoSeleccionado == 'Matrimonio'){
            acordeon.classList.add('show');
            acordeon.setAttribute('aria-expanded', 'true');
            requi_actos.innerHTML = plantilla_matrimonio;
        }else if (textoSeleccionado == 'Bautismo'){
            acordeon.classList.add('show');
            acordeon.setAttribute('aria-expanded', 'true');
            requi_actos.innerHTML = plantilla_bautismo;
            var select = document.getElementById('cha');
            fetch('/fcelebraciones/2')
            .then(data =>  data.json())
            .then( item => {
                if(item == "Error"){
                    Toastify({
                        text: "No existen charlas programadas!!",
                        duration: 2000,
                        close: true,
                        backgroundColor: "#dc3545",
                        gravity: "bottom",
                        position: "right",
                    }).showToast();
                }else{
                    item.data.forEach(v => {
                        select.innerHTML += `<option value="${v.id_charla}">${v.charla}</option>`;
                    });
                }
            })            
        }else if (textoSeleccionado == 'Primera comunion'){
            acordeon.classList.add('show');
            acordeon.setAttribute('aria-expanded', 'true');
            requi_actos.innerHTML = primera_comunion;
            var select = document.getElementById('cha');
            fetch('/fcelebraciones/6')
            .then(data =>  data.json())
            .then( item => {
                if(item == "Error"){
                    Toastify({
                        text: "No existen charlas programadas!!",
                        duration: 2000,
                        close: true,
                        backgroundColor: "#dc3545",
                        gravity: "bottom",
                        position: "right",
                    }).showToast();
                }else{
                    item.data.forEach(v => {
                        select.innerHTML += `<option value="${v.id_charla}">${v.charla}</option>`;
                    });
                }
            }) 
        }else if(textoSeleccionado == 'Confirmacion'){
            acordeon.classList.add('show');
            acordeon.setAttribute('aria-expanded', 'true');
            requi_actos.innerHTML = confirmacion;
            var select = document.getElementById('cha');
            fetch('/fcelebraciones/3')
            .then(data =>  data.json())
            .then( item => {
                if(item == "Error"){
                    Toastify({
                        text: "No existen charlas programadas!!",
                        duration: 2000,
                        close: true,
                        backgroundColor: "#dc3545",
                        gravity: "bottom",
                        position: "right",
                    }).showToast();
                }else{
                    item.data.forEach(v => {
                        select.innerHTML += `<option value="${v.id_charla}">${v.charla}</option>`;
                    });
                }
            })   

        }else{
                        acordeon.classList.remove('show');
            acordeon.setAttribute('aria-expanded', 'false');
            formulario.classList.add('d-none');
        }


    }

    function visualizar(id_archivo) {
        const archivo_formulario = document.getElementById(id_archivo).files[0];

        const modal_contenido = document.getElementById('modal_contenido'); // Contenedor del contenido en el modal
        if (archivo_formulario && archivo_formulario.name.length > 0) {
            const objUrl = URL.createObjectURL(archivo_formulario);
            modal_contenido.innerHTML = "";
            if (archivo_formulario.type === 'application/pdf') {
                modal_contenido.innerHTML = `<iframe src="${objUrl}" width="100%" height="800px" style="border:none;"></iframe>`;
            } else if (archivo_formulario.type.startsWith('image/')) {
                modal_contenido.innerHTML = `<img src="${objUrl}" class="img-fluid formulario_imagenes" alt="Previsualización de la imagen">`;
            } else {
                modal_contenido.innerHTML = "Tipo de archivo no soportado.";
            }
            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            myModal.show();
        }else{
            const src = document.getElementById(id_archivo).name; // Usar el src desde el atributo name
        
            if (src) {
                // Verifica si es una imagen
                if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.gif')) {
                    modal_contenido.innerHTML = `<img src="${src}" class="img-fluid formulario_imagenes" alt="Imagen referenciada">`;
                }
                // Verifica si es un PDF
                else if (src.endsWith('.pdf')) {
                    modal_contenido.innerHTML = `<iframe src="${src}" width="100%" height="800px" style="border:none;"></iframe>`;
                } 
                else {
                    modal_contenido.innerHTML = "Tipo de archivo no soportado.";
                }
    
                var myModal = new bootstrap.Modal(document.getElementById('myModal'));
                myModal.show();
            }
        }
        
        
    }


    let html_opcionescharla = [];

    function enviar_datos(event){
        const form = document.getElementById('formulario_solicitud');
        const formData = new FormData(form);
        var boton = document.getElementById('registrar').textContent;
        var pago = document.getElementById('pago');
        var formulario_solicitud = document.getElementById('div_sol');
        if (form.checkValidity() === false) {
            return;
        }
        event.preventDefault();

        if (boton == "Registrar"){
            pago.classList.remove('d-none')
            formulario_solicitud.classList.add('d-none');
            completar_pago();
        }else{

        }
    }
    function mostrar_img(tipo){
        var imagen = document.getElementById('imagen_qr');
        var metodo = document.getElementById('metodo');
        switch (tipo) {
            case 'yape':
                    metodo.textContent = "yape";
                    imagen.src = "/static/img/yape_qr.jpg";
                break;
            case 'plin':
                    metodo.textContent = "plin";
                    imagen.src = "/static/img/QR_plin.jpg";
                break;
            case 'tarjeta':
                metodo.textContent = "tarjeta";
                imagen.src = "g";
            break;
            default:
                    metodo.textContent = "efectivo";
                    imagen.src = "";
                break;
        }
        
    }
    function desabilitar(elemento){
        document.getElementById(elemento).checked = false;
    }
    function validar_dni(input,estado,mostrar){
        var dni = document.getElementById(input);
        var estado = document.getElementById(estado);
        var mostrar = document.getElementById(mostrar);
        if (estado.checked == true && dni.value.length == 8){
            fetch(`/validar_dni/${dni.value}`)
            .then(response => {return response.json()})
            .then(element => {
                if(element.estado == "si"){
                    dni.disabled = true;
                    mostrar.value = element.nombre; 
                }else{
                    alert("No existe ese feligres");
                    dni.disabled = false;
                    mostrar.value = ""; 
                    estado.checked = false;
                }
            }
            )
        }else if (estado.checked == true && (dni.value.length== 0 || dni.value.length <9)){
            Toastify({
                text: "Ingrese los valores en el campo dni!!",
                duration: 2000,
                close: true,
                backgroundColor: "#dc3545",
                gravity: "bottom",
                position: "right",
            }).showToast();
            dni.disabled = false;
            mostrar.value = ""; 
            estado.checked = false;
        }else{
            dni.disabled = false;
            mostrar.value = ""; 
            estado.checked = false;
        }
    }
    function completar_pago(){
        var responsable = document.getElementById('responsable');
        var acto = document.getElementById('acto_seleccionado');
        var selectedActo = acto.selectedOptions[0] ? acto.selectedOptions[0].text : "";
        
        if (selectedActo == "Matrimonio") {
            var dni_novio = document.getElementById('dni_novio');
            var dni_novia = document.getElementById('dni_novia');
            var novio = document.getElementById('Feligresdni_novio');
            var novia = document.getElementById('Feligresdni_novia');
        
            if (dni_novio.value && dni_novia.value) {
                responsable.innerHTML = `
                    <option value=""></option>
                    <option value="${dni_novio.value}">${novio.value}</option>
                    <option value="${dni_novia.value}">${novia.value}</option>
                `;
            } else {
                // Mostrar un mensaje de error si alguno de los campos está vacío
                alert('Por favor, asegúrate de que todos los campos de los novios estén completos.');
            }
        } else if (selectedActo == "Bautismo") {
            var dni_tutor = document.getElementById('dni_tutor').value;
            var tutor = document.getElementById('nombre_tutor').value;
        
            if (dni_tutor && tutor) {
                responsable.innerHTML = `
                    <option value="${dni_tutor}">${tutor}</option>
                `;
            } else {
                alert('Por favor, asegúrate de que el DNI y el nombre del tutor estén completos.');
            }
        
        } else if (selectedActo == "Confirmacion") {
            var dni_tutor = document.getElementById('dni_confirmado').value;
            var tutor = document.getElementById('nombre_confirmado').value;
        
            if (dni_tutor && tutor) {
                responsable.innerHTML = `
                <option value="${dni_tutor}">${tutor}</option>
                    <option value="${dni_tutor}">${tutor}</option>
                `;
                precio();
            } else {
                alert('Por favor, asegúrate de que el DNI y el nombre del confirmado estén completos.');
            }
        } else if (selectedActo == "Primera comunion") {
            var dni_tutor = document.getElementById('dni_pri_responsable').value;
            var tutor = document.getElementById('nombre_responsable').value;
        
            if (dni_tutor && tutor) {
                responsable.innerHTML = `
                <option value="${dni_tutor}">${tutor}</option>
                    <option value="${dni_tutor}">${tutor}</option>
                `;
                precio();
            } else {
                alert('Por favor, asegúrate de que el DNI y el nombre del confirmado estén completos.');
            }
        }
        


    }
    function precio() {
        var pagos = document.getElementById('pagos');
        var monto = document.getElementById('amount');
        var acto = document.getElementById('acto_seleccionado');
        var acto_liturgico = acto.selectedOptions[0].text;
        var sede = document.getElementById('sede').value;
        var responsable = document.getElementById('responsable').value;
    
        // Deshabilitar botón de pago y mostrar spinner
        pagos.disabled = true;
        pagos.innerHTML = `
            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span class="ms-2">Calculando...</span>
        `;
    
        if (acto_liturgico == 'Matrimonio') {
            var dni1 = document.getElementById('dni_novio').value;
            var dni2 = document.getElementById('dni_novia').value;
            
            fetch(`/monto_acto/${acto_liturgico}/${sede}/${responsable}/${dni1}/${dni2}`)
                .then(response => response.json())
                .then(element => {
                    if (element.estado == "si") {
                        let total = (parseFloat(element.datos.pf_acto) || 0) + 
                                    (parseFloat(element.datos.pf_sede) || 0) + 
                                    (parseFloat(element.datos.pf_traslado) || 0);
                        monto.value = total;
                    }
                    pagos.innerHTML = '';
                    pagos.textContent = 'Confirmar pago';
                    pagos.disabled = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    monto.value = '';
                    pagos.innerHTML = '';
                    pagos.disabled = false;
                    pagos.textContent = 'Error al calcular';
                });
        } else if (acto_liturgico == 'Bautismo') {
            fetch(`/montobautismo/${sede}`)
                .then(response => response.json())
                .then(element => {
                    if (element.estado == "si") {
                        monto.value = element.datos;
                    }
                    pagos.innerHTML = '';
                    pagos.textContent = 'Confirmar pago';
                    pagos.disabled = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    monto.value = '';
                    pagos.innerHTML = '';
                    pagos.disabled = false;
                    pagos.textContent = 'Error al calcular';
                });
        } else if (acto_liturgico == "Confirmacion") {
            fetch(`/confirmado/${sede}`)
                .then(response => response.json())
                .then(element => {
                    if (element.estado == "si") {
                        monto.value = element.datos;
                    }
                    pagos.innerHTML = '';
                    pagos.textContent = 'Confirmar pago';
                    pagos.disabled = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    monto.value = '';
                    pagos.innerHTML = '';
                    pagos.disabled = false;
                    pagos.textContent = 'Error al calcular';
                });
        } else if (acto_liturgico == "Primera comunion") {
            fetch(`/primeracm/${sede}`)
                .then(response => response.json())
                .then(element => {
                    if (element.estado == "si") {
                        monto.value = element.datos;
                    }
                    pagos.innerHTML = '';
                    pagos.textContent = 'Confirmar pago';
                    pagos.disabled = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    monto.value = '';
                    pagos.innerHTML = '';
                    pagos.disabled = false;
                    pagos.textContent = 'Error al calcular';
                });
        }
    }
    

    function grabar_solicitud() {
        var acto = "";
        var id_acto = document.getElementById('acto_seleccionado').value;
        var acto_selecionado = document.getElementById('responsable').value;
        var formData = new FormData();
        var pagos = document.getElementById('pagos');

        if (acto_selecionado.length == 0){
            alert('Ingrese al feligres responsable');
            pagos.disabled = true;
            return ;
        }else if(id_acto== 1){
             acto = array_matrimonio();
        }else if(id_acto == 2){
             acto = array_bautismo();
        }else if(id_acto == 3){
            acto = array_confirmacion();
        }else if(id_acto == 6){
            acto = array_comunion();
        }

        for (var key in acto) {
            formData.append(key, acto[key]);  // Aquí se añaden tanto archivos como datos de texto
        }

        Swal.fire({
            title: 'Procesando solicitud',
            text: 'Por favor espera un momento...',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Muestra un spinner de carga
            }
        });
        fetch(`/registrarsolicitud/${id_acto}`, {
            method: 'POST',
            body: formData  // Aquí no se establecen los headers manualmente
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            Swal.close();
            
            if (data.estado == "Correcto"){
                Swal.fire({
                    title: "Solicitud aceptada!!",
                    text: "Se agrego correctamente la solicitud!!",
                    icon: "success"
                }).then(() => {
                    location.reload();
                });
            }else{
                Swal.fire({
                    title: "Cancelado",
                    text: "La operación ha sido cancelada.",
                    icon: "error", // Cambia a 'error' para mostrar un ícono de error
                    confirmButtonText: "Aceptar" // Texto del botón de confirmación
                });
                pagos.disabled = true;
            }
        })
        .catch(error => {
            Swal.fire({
                title: "Cancelado",
                text: "La operación ha sido cancelada.",
                icon: "error", // Cambia a 'error' para mostrar un ícono de error
                confirmButtonText: "Aceptar" // Texto del botón de confirmación
            });
            pagos.disabled = true;
        });
        pagos.disabled = true;
    }


    function array_matrimonio() {
        var metodo = document.getElementById('metodo');
        var mt = metodo.textContent;
        var array = {
            'copia_dninovio': document.getElementById('copia_dninovio').files[0],  // Archivo
            'dni_novio': document.getElementById('dni_novio').value,              // Valor de texto
            'copia_dninovia': document.getElementById('copia_dninovia').files[0],  // Archivo
            'dni_novia': document.getElementById('dni_novia').value,              // Valor de texto
            'dni_testigo1': document.getElementById('dni_testigo1').value,        // Valor de texto
            'dni_testigo2': document.getElementById('dni_testigo2').value,        // Valor de texto
            'sede': document.getElementById('sede').value,                        // Valor de texto
            'f_matrimonio': document.getElementById('f_matrimonio').value,        // Valor de texto
            'consb_novio': document.getElementById('consb_novio').files[0],      // Archivo
            'consc_novio': document.getElementById('consc_novio').files[0],      // Archivo
            'consb_novia': document.getElementById('consb_novia').files[0],      // Archivo
            'consc_novia': document.getElementById('consc_novia').files[0],      // Archivo
            'fc_novio': document.getElementById('fc_novio').files[0],            // Archivo
            'fc_novia': document.getElementById('fc_novia').files[0],            // Archivo
            'fvih_novio': document.getElementById('fvih_novio').files[0],        // Archivo
            'fvih_novia': document.getElementById('fvih_novia').files[0],        // Archivo
            //aca empieza lo de divertido los paguitos
            'responsable' : document.getElementById('responsable').value,
            'metodo': mt,
            'sede': document.getElementById('sede').value,
            'es_copia_dninovio': document.getElementById('es_copia_dninovio').checked ? 'V' : 'F',
            'es_dni_novio': document.getElementById('es_dni_novio').checked ? 'V' : 'F',
            'es_copia_dninovia': document.getElementById('es_copia_dninovia').checked ? 'V' : 'F',
            'es_dni_novia': document.getElementById('es_dni_novia').checked ? 'V' : 'F',
            'es_dni_testigo1': document.getElementById('es_dni_testigo1').checked ? 'V' : 'F',
            'es_dni_testigo2': document.getElementById('es_dni_testigo2').checked ? 'V' : 'F',
            'es_sede': document.getElementById('es_sede').checked ? 'V' : 'F',
            'es_f_matrimonio': document.getElementById('es_f_matrimonio').checked ? 'V' : 'F',
            'es_consb_novio': document.getElementById('es_consb_novio').checked ? 'V' : 'F',
            'es_consc_novio': document.getElementById('es_consc_novio').checked ? 'V' : 'F',
            'es_consb_novia': document.getElementById('es_consb_novia').checked ? 'V' : 'F',
            'es_consc_novia': document.getElementById('es_consc_novia').checked ? 'V' : 'F',
            'es_fc_novio': document.getElementById('es_fc_novio').checked ? 'V' : 'F',
            'es_fc_novia': document.getElementById('es_fc_novia').checked ? 'V' : 'F',
            'es_fvih_novio': document.getElementById('es_fvih_novio').checked ? 'V' : 'F',
            'es_fvih_novia': document.getElementById('es_fvih_novia').checked ? 'V' : 'F',
            'es_charlas': document.getElementById('es_charlas').checked ? 'V' : 'F'
        };
        return array;
    }
    function array_bautismo() {
        var metodo = document.getElementById('metodo');
        var mt = metodo.textContent;
        var id_charla = document.getElementById('cha').value;
        var array = {
            'id_charla': id_charla,
            'metodo': mt,
            'dni_padrino' : document.getElementById('dni_padrino').value,
            'dni_madrina': document.getElementById('dni_madrina').value,
            'co_dniactan': document.getElementById('co_dniactan').files[0],
            'nom_niño': document.getElementById('nom_niño').value,
            'cop_dni_padres': document.getElementById('cop_dni_padres').files[0],
            'cop_agualuz': document.getElementById('cop_agualuz').files[0],
            'cop_conspadrino': document.getElementById('cop_conspadrino').files[0],
            'cop_consmadrina': document.getElementById('cop_consmadrina').files[0],
            'dni_tutor': document.getElementById('dni_tutor').value,
            'sedebau': document.getElementById('sedebau').value,
        };
        return array;
    }


    function array_confirmacion() {
        var metodo = document.getElementById('metodo');
        var mt = metodo.textContent;
        var id_charla = document.getElementById('cha').value;

        var array = {
            'id_charla': id_charla,
            'const_bautizo': document.getElementById('const_bautizo').files[0],
            'dni_confirmado': document.getElementById('dni_confirmado').value,
            'dni_padrino_madrina': document.getElementById('dni_padrino_madrina').value,
            'sede': document.getElementById('sede').value,
            'metodo': mt
        };
    
        return array;
    }


function array_comunion() {
    var metodo = document.getElementById('metodo');
    var mt = metodo.textContent;
    var id_charla = document.getElementById('cha').value;

    var array = {
        'id_charla': id_charla,
        'dni_pri_responsable': document.getElementById('dni_pri_responsable').value,
        'dni_pri_celebrante': document.getElementById('dni_pri_celebrante').files[0],
        'dni_pradri_madri': document.getElementById('dni_pradri_madri').value, // Valor de texto
        'constan_bau_celebrante': document.getElementById('constan_bau_celebrante').files[0],
        'cosntan_estudios': document.getElementById('cosntan_estudios').files[0], // Archivo
        'cop_luz_agua': document.getElementById('cop_luz_agua').files[0], // Archivo
        'dni_celebrante': document.getElementById('dni_celebrante').value, // Valor de texto
        'sede': document.getElementById('sede').value,
        'metodo': mt
    };

    return array;
}

    function listar_solicitudes() {
        fetch('/listar_solicitudes')
            .then(response => response.json())  // Parseamos la respuesta como JSON
            .then(data => {
                const tbody = document.getElementById('solicitud');
                tbody.innerHTML = '';  // Limpiar el contenido actual del tbody

                if (data.data) {
                    // Si hay datos, los insertamos en la tabla
                    data.data.forEach(solicitud => {
                        const row = document.createElement('tr');

                        // Creamos celdas para cada campo de la solicitud
                        row.innerHTML = `
                            <td class="text-center">${solicitud.id_solicitud}</td>
                            <td class="text-center">${solicitud.fecha}</td>
                            <td class="text-center">${solicitud.nombre_sede}</td>
                            <td class="text-center">${solicitud.nombre_liturgia}</td>
                            <td class="text-center">${solicitud.nombres}</td>
                            <td class="text-center">
                                <button class="btn btn-primary btn-sm" onclick="rellenar_formulario(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                                    <i class="bi bi-check2-circle"></i>
                                </button>
                                <button class="btn btn-secondary btn-sm" onclick="asistencias(${solicitud.id_solicitud}, '${solicitud.nombre_liturgia}')">
                                    <i class="bi bi-calendar3"></i>
                                </button>
                            </td>
                        `;
                        tbody.appendChild(row);  // Añadimos la fila a la tabla
                    });
                } else {
                    // Si no hay datos, podemos agregar un mensaje o manejar el error
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="6">No se encontraron solicitudes</td>';
                    tbody.appendChild(row);
                }
            })
            .catch(error => {
                console.error('Error al obtener solicitudes:', error);
            });
    }

    function validarNombre(inputId, checkboxId) {
        const input = document.getElementById(inputId);
        const checkbox = document.getElementById(checkboxId);
        const valor = input.value.trim();
        const palabras = valor.split(/\s+/);
    
        // Validación del número de palabras
        if (checkbox.checked) {
            if (palabras.length < 3 || palabras.length > 5) {
                Toastify({
                    text: "Ingrese correctamente el nombre!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();                checkbox.checked = false; // Desmarca el checkbox si la validación falla
            } else {
                input.disabled = true; 
            }
        } else {
            input.disabled = false;
        }
    }
   
    

    var md_asistencias = new bootstrap.Modal(document.getElementById('modal_asistencia'));
    function asistencias(id,acto){
        md_asistencias.show();
        //limpiamos
        var tbody = document.getElementById('cu_cuerpo');
        var uno = document.getElementById('uno');
        var dos = document.getElementById('dos');
        uno.textContent = acto;
        dos.textContent = id;

        tbody.innerHTML = "";

        fetch(`/asistencias_solicitud/${id}`)
        .then(response => response.json())
        .then(item => {
            if (item.estado == "si"){
                item.data.forEach(dt => {
                    var tr = document.createElement('tr');
                    tr.innerHTML = 
                        `
                        <td> ${dt.id_asistencia} </td>
                        <td> ${dt.descripcion}  </td>
                        <td> ${dt.fecha}  </td>
                        <td> ${dt.rol}  </td>
                        <td> ${dt.dni}  </td>
                        <td> ${dt.nombre}  </td>
                        <td>
                        <input class="me-1" id="${dt.id_asistencia}" 
                            type="checkbox" 
                            ${dt.estado == 1 ? 'checked disabled' : `onclick="agregar_asistencia(${dt.id_asistencia})"`}>
                        <label for="">${ dt.estado == 1 ? '(Asistió)' : '(Falto)' }</label>
                        </td>
                    `
                    tbody.appendChild(tr);
                });
            }else{
                alert("No se encontro las asistencias para esa solicitud");
            }
        })
    }

    function estado_generales() {
        var check = document.getElementById('estado_general');
        var che = document.querySelectorAll('input[type="checkbox"]:not(#estado_general)');
        var estado = check.checked;

        che.forEach(input => {
            input.checked = estado;
            if (input.onclick) {
                input.onclick();
            }
        });
    }

    function ver_fechas(){
        var valor_s = document.getElementById('cha').value;
        var tbody = document.getElementById('cu_tablapdf');
        tbody.innerHTML = "";
        var acto = document.getElementById('acto_seleccionado').value;
        if (valor_s.length == 0){
            alert("Seleecione una opcion!!");
        }else{
            if(acto == 1){

            }else if(acto == 2){
                fetch(`datos_charlas/${valor_s}`)
                .then(valor => valor.json())
                .then(item => {
                    if(item.mensaje == "Error"){
                        Toastify({
                            text: "No se pudo obtener las asistencias",
                            duration: 2000,
                            close: true,
                            backgroundColor: "#dc3545;",
                            gravity: "bottom",
                            position: "right",
                        }).showToast();
                    }else{
                        tbody.innerHTML = `
                            <tr>
                                <td>${item.data[0].descripcion}</td>
                                <td>${item.data[0].fecha}</td>
                                <td>${item.data[0].hora_inicio}</td>
                                <td>${item.data[0].hora_fin}</td>
                            </tr>
                        `;
    
                    }
                })
            }else if(acto == 3){
                fetch(`datos_charlas_confirmacion/${valor_s}`)
                .then(valor => valor.json())
                .then(item => {
                    if(item.mensaje == "Error"){
                        Toastify({
                            text: "No se pudo obtener las asistencias",
                            duration: 2000,
                            close: true,
                            backgroundColor: "#dc3545;",
                            gravity: "bottom",
                            position: "right",
                        }).showToast();
                    }else{
                        for (let i = 0; i < item.data.length; i++) {
                            tbody.innerHTML += `
                                <tr>
                                    <td>${item.data[i].descripcion}</td>
                                    <td>${item.data[i].fecha}</td>
                                    <td>${item.data[i].hora_inicio}</td>
                                    <td>${item.data[i].hora_fin}</td>
                                </tr>
                            `;
                        }
                        
                    }
                })
            }else{
                fetch(`datos_charlas_comunion/${valor_s}`)
                .then(valor => valor.json())
                .then(item => {
                    if(item.mensaje == "Error"){
                        Toastify({
                            text: "No se pudo obtener las asistencias",
                            duration: 2000,
                            close: true,
                            backgroundColor: "#dc3545;",
                            gravity: "bottom",
                            position: "right",
                        }).showToast();
                    }else{
                        for (let i = 0; i < item.data.length; i++) {
                            tbody.innerHTML += `
                                <tr>
                                    <td>${item.data[i].descripcion}</td>
                                    <td>${item.data[i].fecha}</td>
                                    <td>${item.data[i].hora_inicio}</td>
                                    <td>${item.data[i].hora_fin}</td>
                                </tr>
                            `;
                        }
                        
                    }
                })
            }




        }
        document.getElementById('accordionRequisitos').classList.add("d-none");
        document.getElementById('aaa').classList.add("d-none");
        document.getElementById('bbb').disabled = true;
        document.getElementById('contenido_calendario_celebracion').classList.remove("d-none");
    }
    
    function visualizar_calendario(id_fecha) {
        var acto = document.getElementById('acto_seleccionado').value;
        var tbody = document.getElementById('calendario_cuerpo');
        var id_charla = document.getElementById(id_fecha).value;

        if(acto == 1){

        }else if(acto ==2){
            fetch(`/calendario_solicitud/${id_charla}`)
            .then(data => data.json())
            .then(item => {
                tbody.innerHTML = '';
                item.forEach(elemento => {
                    var tr = document.createElement('tr');
                    var tdId = document.createElement('td');
                    tdId.textContent = elemento.id;
                    tdId.classList.add('ocultar');
                    tr.appendChild(tdId);
                    var tdDescripcion = document.createElement('td');
                    tdDescripcion.textContent = elemento.descripcion;
                    tr.appendChild(tdDescripcion);
                    var tdFecha = document.createElement('td');
                    tdFecha.textContent = elemento.fecha;
                    tr.appendChild(tdFecha);
                    var tdHoraInicio = document.createElement('td');
                    tdHoraInicio.textContent = elemento.hora_inicio;
                    tr.appendChild(tdHoraInicio);
                    var tdHoraFin = document.createElement('td');
                    tdHoraFin.textContent = elemento.hora_fin;
                    tr.appendChild(tdHoraFin);
                    tbody.appendChild(tr);
                });
            })
        }else if(acto == 3){
            const tbody = document.getElementById('tbody'); // Asegúrate de tener el id correcto
            const id_charla = document.getElementById('cha').value;
            fetch(`/datos_charlas_confirmacion/${id_charla}`)
            .then(response => response.json())
            .then(item => {
                console.log(item);  // Verifica si la respuesta contiene los datos esperados
                tbody.innerHTML = '';  // Limpiar el tbody
                item.forEach(elemento => {
                    var tr = document.createElement('tr');
                    var tdId = document.createElement('td');
                    tdId.textContent = elemento.id;
                    tdId.classList.add('ocultar');
                    tr.appendChild(tdId);
                    var tdDescripcion = document.createElement('td');
                    tdDescripcion.textContent = elemento.descripcion;
                    tr.appendChild(tdDescripcion);
                    var tdFecha = document.createElement('td');
                    tdFecha.textContent = elemento.fecha;
                    tr.appendChild(tdFecha);
                    var tdHoraInicio = document.createElement('td');
                    tdHoraInicio.textContent = elemento.hora_inicio;
                    tr.appendChild(tdHoraInicio);
                    var tdHoraFin = document.createElement('td');
                    tdHoraFin.textContent = elemento.hora_fin;
                    tr.appendChild(tdHoraFin);
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error:', error));

        }else if(acto == 4){

        }


      


    }


    function agregar_asistencia(id){
        var seleccion = document.getElementById(id);
        if (seleccion.checked == true){
            seleccion = 1
        }else{
            seleccion = 0;
        }
        fetch(`/check_asistencia/${id}/${seleccion}`)
        .then(response => response.json())
        .then(item =>{
            if (item.estado == "correcto"){
                Toastify({
                    text: "Se modifico la asistencia!!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "--bs-primary",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }else{
                Toastify({
                    text: "No se pudo modificar la asistencia!!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545;",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
        })

    }


    function rellenar_formulario(id,acto){
        var select = document.getElementById('acto_seleccionado');
        Array.from(select.options).forEach(option => {
            if (option.text === acto) { 
                option.selected = true;
            }
        });

        verificar();
        var btn = document.getElementById('registrar').classList.add('d-none');
        fetch(`/datos_solicitud/${id}`)
        .then(data => data.json())
        .then(item => {
            if (item.estado === "Correcto") {
                item.data.forEach(v => {
                    var st = false;
                    if (v.estado == "V"){
                        st = true;
                    }
                    document.getElementById('estado_general').disabled = true;
                    document.getElementById(`${v.campo1}`).disabled = `${v.campo1}` !== 'charbau';
                    if ((`${v.campo1}` == 'charbau' ||  `${v.campo1}` == 'charlas' || `${v.campo1}` == 'charla'  )){
                        document.getElementById('cha').classList.add('d-none');
                    }


                    document.getElementById(`${v.campo2}`).disabled = true;
                    switch (v.tipo) {
                        case 'Imagen':
                            document.getElementById(`${v.campo1}`).name = v.valor;
                            document.getElementById(`${v.campo2}`).checked = st;
                            break;
                        case 'Sede':
                        case 'FechaHora':
                        case 'Dni':
                            document.getElementById(`${v.campo1}`).value = v.valor;
                            document.getElementById(`${v.campo2}`).checked = st;
                            break;
                        case 'Texto':
                            document.getElementById(`${v.campo1}`).value = v.valor;
                            document.getElementById(`${v.campo1}`).disabled = true;
                            document.getElementById(`${v.campo2}`).checked = st;
                            break;
                        default:
                            document.getElementById(`${v.campo1}`).disabled = false;
                            document.getElementById(`${v.campo2}`).checked = st;
                            document.getElementById(`${v.campo1}`).onclick = function() {
                                asistencias(id,acto);
                            };
                            break;
                    }
                });
            } else {
                Toastify({
                    text: "No se pudo extraer los datos de la solicitud!!",
                    duration: 2000,
                    close: true,
                    backgroundColor: "#dc3545",
                    gravity: "bottom",
                    position: "right",
                }).showToast();
            }
            var lugar = document.getElementById('formulario_solicitud');
            if (lugar) {
                var che = lugar.querySelectorAll('input[type="checkbox"]:not(#estado_general):not(#es_f_matrimonio)');
                che.forEach(input => {
                    if (typeof input.onclick === "function") {
                        input.onclick(); // Ejecuta el evento onclick de cada checkbox
                    }
                });
            } else {
                console.error('Formulario no encontrado.');
            }
            
        })


    }
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', function () {
            const inputFecha = document.querySelector('#f_matrimonio');
    
            if (inputFecha) {
                const today = new Date();
                today.setMonth(today.getMonth() + 4);
                const minDate = today.toISOString().split('T')[0];
                inputFecha.setAttribute('min', `${minDate}T14:00`);
                
                inputFecha.addEventListener('keydown', function (e) {
                    e.preventDefault();
                });
    
                inputFecha.addEventListener('input', function () {
                    const [fecha, hora] = this.value.split('T');
                    const [horas, minutos] = hora ? hora.split(':').map(Number) : [0, 0];
    
                    if (new Date(fecha) < today || horas < 14 || horas >= 20) {
                        this.setCustomValidity('Seleccione una fecha válida (al menos 7 meses desde hoy) y una hora entre las 14:00 y las 20:00.');
                        this.value = '';
                    } else {
                        this.setCustomValidity('');
                    }
                });
            }
        });
    });