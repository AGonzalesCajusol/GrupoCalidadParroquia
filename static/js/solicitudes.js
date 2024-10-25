const html_matrimonio = ` 
                        <hr>
                        <h6><strong>Registro de celebridad de acto litúrgico de matrimonio:</strong></h6>
                    
                        <form action="" id="formulario_matrimonio">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Requisito</th>
                                        <th>Elemento</th>
                                        <th>Estado</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Copia del DNI del novio</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="dni_novio_copia">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_dni_novio_copia">
                                            <label for="estado_dni_novio_copia">Validado</label>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-primary" onclick="visualizar('dni_novio_copia')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                    
                                    <tr>
                                        <td>Ingrese el DNI del novio</td>
                                        <td>
                                            <input class="form-control" type="text" id="dni_novio" placeholder="DNI del novio">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_dni_novio">
                                            <label for="estado_dni_novio">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button"><i class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Copia del DNI de la novia</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="dni_novia_copia">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_dni_novia_copia">
                                            <label for="estado_dni_novia_copia">Validado</label>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-primary" onclick="visualizar('dni_novia_copia')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ingrese el DNI de la novia</td>
                                        <td>
                                            <input class="form-control" type="text" id="dni_novia" placeholder="DNI de la novia">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_dni_novia">
                                            <label for="estado_dni_novia">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button"><i class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ingrese el DNI del primer testigo</td>
                                        <td>
                                            <input class="form-control" type="text" id="dni_testigo1" placeholder="DNI del testigo">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_testigo1">
                                            <label for="estado_testigo1">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button"><i class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ingrese el DNI del segundo testigo</td>
                                        <td>
                                            <input class="form-control" type="text" id="dni_testigo2" placeholder="DNI del testigo">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_testigo2">
                                            <label for="estado_testigo2">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button"><i class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Residencia en la jurisdicción (Novio/a)</td>
                                        <td>
                                            <input class="form-control" type="text" id="residencia_novio"
                                                placeholder="Indicar residencia del novio/a">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_residencia">
                                            <label for="estado_residencia">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button"><i class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Fecha de matrimonio</td>
                                        <td>
                                            <input class="form-control" type="datetime-local" id="fecha_matrimonio">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_fecha_matrimonio">
                                            <label for="estado_fecha_matrimonio">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button"><i class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Constancia de bautismo del Novio</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="bautismo_novio">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_bautismo_novio">
                                            <label for="estado_bautismo_novio">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('bautismo_novio')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Constancia de confirmación del Novio</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="confirmacion_novio">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_confirmacion_novio">
                                            <label for="estado_confirmacion_novio">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('confirmacion_novio')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Constancia de bautismo de la Novia</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="bautismo_novia">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_bautismo_novia">
                                            <label for="estado_bautismo_novia">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('bautismo_novia')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Constancia de confirmación de la Novia</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="confirmacion_novia">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_confirmacion_novia">
                                            <label for="estado_confirmacion_novia">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('confirmacion_novia')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Foto tamaño carnet del Novio</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="foto_carnet_novio">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_foto_carnet_novio">
                                            <label for="estado_foto_carnet_novio">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('foto_carnet_novio')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Foto tamaño carnet de la Novia</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="foto_carnet_novia">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_foto_carnet_novia">
                                            <label for="estado_foto_carnet_novia">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('foto_carnet_novia')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Prueba médica de VIH del Novio</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="prueba_vih_novio">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_prueba_vih_novio">
                                            <label for="estado_prueba_vih_novio">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('prueba_vih_novio')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Prueba médica de VIH de la Novia</td>
                                        <td>
                                            <input class="form-control" accept="image/*" type="file" id="prueba_vih_novia">
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_prueba_vih_novia">
                                            <label for="estado_prueba_vih_novia">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('prueba_vih_novia')"><i
                                                    class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Charlas preparatorias para los involucrados</td>
                                        <td>
                                        </td>
                                        <td>
                                            <input type="checkbox" id="estado_prueba_vih_novia">
                                            <label for="estado_prueba_vih_novia">Validado</label>
                                        </td>
                                        <td>
                                            <button class="btn btn-primary" type="button" onclick="visualizar('prueba_vih_novia')">
                                                <i class="bi bi-calendar3"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="submit" class="btn btn-success" id="btn_enviar_matrimonio">Enviar
                                Requisitos</button>
                        </form>
`
const html_bautizo = `
                    <hr>
                    <h6><strong>Registro de celebridad de acto litúrgico de bautizo:</strong></h6>
                    <form action="" id="formulario_bautizo">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Requisito</th>
                                    <th>Elemento</th>
                                    <th>Estado</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Copia de DNI del niño o acta de nacimiento</td>
                                    <td>
                                        <input class="form-control" accept="image/*" type="file"
                                            id="partida_nacimiento">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_partida_nacimiento">
                                        <label for="estado_partida_nacimiento">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('partida_nacimiento')"><i
                                                class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Número de DNI del niño</td>
                                    <td>
                                        <input class="form-control" type="number" id="dni_nino">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_dni_nino">
                                        <label for="estado_dni_nino">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('dni_nino')"><i class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Copia del DNI del padre</td>
                                    <td>
                                        <input class="form-control" accept="image/*" type="file" id="dni_padre_copia">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_dni_padre_copia">
                                        <label for="estado_dni_padre_copia">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('dni_padre_copia')"><i
                                                class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Número de DNI del padre</td>
                                    <td>
                                        <input class="form-control" type="number" id="dni_padre">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_dni_padre">
                                        <label for="estado_dni_padre">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('dni_padre')"><i class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Copia del DNI de la madre</td>
                                    <td>
                                        <input class="form-control" accept="image/*" type="file" id="dni_madre_copia">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_dni_madre_copia">
                                        <label for="estado_dni_madre_copia">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('dni_madre_copia')"><i
                                                class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Número de DNI de la madre</td>
                                    <td>
                                        <input class="form-control" type="number" id="dni_madre">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_dni_madre">
                                        <label for="estado_dni_madre">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('dni_madre')"><i class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Copia de recibo de luz o agua</td>
                                    <td>
                                        <input class="form-control" type="file" id="recibo_servicio">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_recibo_servicio">
                                        <label for="estado_recibo_servicio">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('recibo_servicio')"><i
                                                class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Número del DNI del padrino</td>
                                    <td>
                                        <input class="form-control" type="number" id="dni_padrino">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_dni_padrino">
                                        <label for="estado_dni_padrino">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('dni_padrino')"><i class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Copia confirmación (soltero) o matrimonio católico (casado) del padrino</td>
                                    <td>
                                        <input class="form-control" accept="image/*" type="file"
                                            id="confirmacion_padrino">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_confirmacion_padrino">
                                        <label for="estado_confirmacion_padrino">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('confirmacion_padrino')"><i
                                                class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Número del DNI de la madrina</td>
                                    <td>
                                        <input class="form-control" type="number" id="dni_madrina">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_dni_madrina">
                                        <label for="estado_dni_madrina">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('dni_madrina')"><i class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Copia confirmación (soltera) o matrimonio católico (casada) de la madrina</td>
                                    <td>
                                        <input class="form-control" accept="image/*" type="file"
                                            id="confirmacion_madrina">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_confirmacion_madrina">
                                        <label for="estado_confirmacion_madrina">Validado</label>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            onclick="visualizar('confirmacion_madrina')"><i
                                                class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Fecha del bautizo</td>
                                    <td>
                                        <input class="form-control" type="datetime-local" id="fecha_bautizo">
                                    </td>
                                    <td>
                                        <input type="checkbox" id="estado_fecha_bautizo">
                                        <label for="estado_fecha_bautizo">Validado</label>
                                    </td>
                                    <td>
                                        <button class="btn btn-primary" type="button"><i
                                                class="bi bi-eye-fill"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                    <button type="submit" class="btn btn-success" id="btn_enviar_bautizo">Enviar Requisitos</button>
`

function verificar(){
    texto_boton = document.getElementById('acto_seleccionado');
    if(texto_boton.value == ""){
        alert("Seleccione un acto litúrgico");
    }else{
        graficar_formularios(texto_boton.value);
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
        myModal.show();
    }
}

function graficar_formularios(acto_liturgico){
    const div_requisitos = document.getElementById('requi_actos');
    div_requisitos.innerHTML = '';
    switch (acto_liturgico) {
        case 'matrimonio':
            div_requisitos.innerHTML = html_matrimonio;
            break;
        case 'bautizo':
            div_requisitos.innerHTML = html_bautizo;
        default:
            break;
    }
}


function visualizar(id_imagen){
    const imagen_formulario = document.getElementById(id_imagen).files[0];
    const imagen_modal = document.getElementById('imagen_modal');
    if (imagen_formulario.name.length > 0){
        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        const objUrl = URL.createObjectURL(imagen_formulario);
        imagen_modal.src = objUrl;
        myModal.show();
    }
}