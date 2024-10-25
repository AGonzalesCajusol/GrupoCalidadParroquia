var modal = new bootstrap.Modal(document.getElementById('myModal11'));
var formulariopr_matrimonio = `
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Tema</th>
                    <th>Fecha</th>
                    <th>Hora Inicio</th>
                    <th>Hora Fin</th>
                    <th>Estado</th>
                    <th>Ministro</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><label>Tema 1</label></td>
                    <td><input type="date" class="form-control" name="fecha1"></td>
                    <td><input type="time" class="form-control" id="hora_inicio1" name="hora_inicio1" onchange="hora_fin('hora_inicio1','hora_fin1')"></td>
                    <td><input type="time" class="form-control" id="hora_fin1" name="hora_fin1" disabled></td>
                    <td><input type="checkbox" name="estado1">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro1" hidden>
                            <input type="text" class="form-control" id="ministro1" name="ministro1" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro1','idministro1')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 2</label></td>
                    <td><input type="date" class="form-control" name="fecha2"></td>
                    <td><input type="time" class="form-control" id="hora_inicio2" name="hora_inicio2" onchange="hora_fin('hora_inicio2','hora_fin2')"></td>
                    <td><input type="time" class="form-control" id="hora_fin2" name="hora_fin2" disabled></td>
                    <td><input type="checkbox" name="estado2">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro2" hidden>
                            <input type="text" class="form-control" id="ministro2" name="ministro2" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro2','idministro2')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 3</label></td>
                    <td><input type="date" class="form-control" name="fecha3"></td>
                    <td><input type="time" class="form-control" id="hora_inicio3" name="hora_inicio3" onchange="hora_fin('hora_inicio3','hora_fin3')"></td>
                    <td><input type="time" class="form-control" id="hora_fin3" name="hora_fin3" disabled></td>
                    <td><input type="checkbox" name="estado3">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro3" hidden>
                            <input type="text" class="form-control" id="ministro3" name="ministro3" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro3','idministro3')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 4</label></td>
                    <td><input type="date" class="form-control" name="fecha4"></td>
                    <td><input type="time" class="form-control" id="hora_inicio4" name="hora_inicio4" onchange="hora_fin('hora_inicio4','hora_fin4')"></td>
                    <td><input type="time" class="form-control" id="hora_fin4" name="hora_fin4" disabled></td>
                    <td><input type="checkbox" name="estado4">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro4" hidden>
                            <input type="text" class="form-control" id="ministro4" name="ministro4" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro4','idministro4')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 5</label></td>
                    <td><input type="date" class="form-control" name="fecha5"></td>
                    <td><input type="time" class="form-control" id="hora_inicio5" name="hora_inicio5" onchange="hora_fin('hora_inicio5','hora_fin5')"></td>
                    <td><input type="time" class="form-control" id="hora_fin5" name="hora_fin5" disabled></td>
                    <td><input type="checkbox" name="estado5">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro5" hidden>
                            <input type="text" class="form-control" id="ministro5" name="ministro5" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro5','idministro5')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 6</label></td>
                    <td><input type="date" class="form-control" name="fecha6"></td>
                    <td><input type="time" class="form-control" id="hora_inicio6" name="hora_inicio6" onchange="hora_fin('hora_inicio6','hora_fin6')"></td>
                    <td><input type="time" class="form-control" id="hora_fin6" name="hora_fin6" disabled></td>
                    <td><input type="checkbox" name="estado6">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro6" hidden>
                            <input type="text" class="form-control" id="ministro6" name="ministro6" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro6','idministro6')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 7</label></td>
                    <td><input type="date" class="form-control" name="fecha7"></td>
                    <td><input type="time" class="form-control" id="hora_inicio7" name="hora_inicio7" onchange="hora_fin('hora_inicio7','hora_fin7')"></td>
                    <td><input type="time" class="form-control" id="hora_fin7" name="hora_fin7" disabled></td>
                    <td><input type="checkbox" name="estado7">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro7" hidden>
                            <input type="text" class="form-control" id="ministro7" name="ministro7" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro7','idministro7')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 8</label></td>
                    <td><input type="date" class="form-control" name="fecha8"></td>
                    <td><input type="time" class="form-control" id="hora_inicio8" name="hora_inicio8" onchange="hora_fin('hora_inicio8','hora_fin8')"></td>
                    <td><input type="time" class="form-control" id="hora_fin8" name="hora_fin8" disabled></td>
                    <td><input type="checkbox" name="estado8">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro8" hidden>
                            <input type="text" class="form-control" id="ministro8" name="ministro8" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro8','idministro8')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 9</label></td>
                    <td><input type="date" class="form-control" name="fecha9"></td>
                    <td><input type="time" class="form-control" id="hora_inicio9" name="hora_inicio9" onchange="hora_fin('hora_inicio9','hora_fin9')"></td>
                    <td><input type="time" class="form-control" id="hora_fin9" name="hora_fin9" disabled></td>
                    <td><input type="checkbox" name="estado9">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro9" hidden>
                            <input type="text" class="form-control" id="ministro9" name="ministro9" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro9','idministro9')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 10</label></td>
                    <td><input type="date" class="form-control" name="fecha10"></td>
                    <td><input type="time" class="form-control" id="hora_inicio10" name="hora_inicio10" onchange="hora_fin('hora_inicio10','hora_fin10')"></td>
                    <td><input type="time" class="form-control" id="hora_fin10" name="hora_fin10" disabled></td>
                    <td><input type="checkbox" name="estado10">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro10" hidden>
                            <input type="text" class="form-control" id="ministro10" name="ministro10" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro10','idministro10')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 11</label></td>
                    <td><input type="date" class="form-control" name="fecha11"></td>
                    <td><input type="time" class="form-control" id="hora_inicio11" name="hora_inicio11" onchange="hora_fin('hora_inicio11','hora_fin11')"></td>
                    <td><input type="time" class="form-control" id="hora_fin11" name="hora_fin11" disabled></td>
                    <td><input type="checkbox" name="estado11">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro11" hidden>
                            <input type="text" class="form-control" id="ministro11" name="ministro11" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro11','idministro11')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Tema 12</label></td>
                    <td><input type="date" class="form-control" name="fecha12"></td>
                    <td><input type="time" class="form-control" id="hora_inicio12" name="hora_inicio12" onchange="hora_fin('hora_inicio12','hora_fin12')"></td>
                    <td><input type="time" class="form-control" id="hora_fin12" name="hora_fin12" disabled></td>
                    <td><input type="checkbox" name="estado12">&nbsp; (Realizado)</td>
                    <td>
                        <div class="d-inline-flex">
                            <input type="number" id="idministro12" hidden>
                            <input type="text" class="form-control" id="ministro12" name="ministro12" placeholder="Ministro">
                            <button class="btn btn-primary" onclick="abrir_modal('ministro12','idministro12')"><i class="bi bi-plus-circle-fill"></i></button>
                        </div>
                    </td>
                </tr>
            </tbody>
            
        </table>
`


function abrir_modal(ministro_f , id_ministro_f){
    var cuerpo_tabla = document.getElementById('cuerpo_ministros');
    $('#table_mini').DataTable().destroy(); // Destruir la tabla existente
    cuerpo_tabla.innerHTML = '';
    fetch('ministros_registro')
    .then(response  => response.json())
    .then(item => {
        item.forEach(ministro => {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var tdButton = document.createElement('td'); // Celda para el botón
            var bt1 = document.createElement('button');
            var icon = document.createElement('i');
            tdButton.addEventListener('click', function(){
                asignar(ministro.numero_doc, ministro.nombre_ministro, id_ministro_f,  ministro_f);
            })

            // Configura el contenido de las celdas
            td1.textContent = ministro.numero_doc;
            td2.textContent = ministro.nombre_ministro;
            td3.textContent = ministro.sede;
        
            // Configura el botón y el ícono
            bt1.classList.add('btn', 'btn-primary', 'btn-sm');
            bt1.innerHTML = '<i class="bi bi-check2-circle"></i>'; // Añade el ícono como HTML
        
            // Añade el botón a su propia celda
            tdButton.appendChild(bt1);
        
            // Añade las celdas y el botón a la fila
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(tdButton);
        
            // Añade la fila al cuerpo de la tabla
            cuerpo_tabla.appendChild(tr);
        
        });
        
        var table = $('#table_mini').DataTable({
            paging: false,        // Desactiva la paginación
            ordering: false,      // Desactiva la ordenación
            info: false,          // Desactiva la información
        });

        // Evento para el campo de búsqueda
        $('#searchInput').keyup(function() {
            //draw redibuja la tabla
            table.search(this.value).draw();
        });

    })
    modal.show();

}

function asignar(numero_doc,nombre_ministro,id_ministro_f , ministro_f){
    document.getElementById(id_ministro_f).value = numero_doc;
    document.getElementById(ministro_f).value = nombre_ministro;
    modal.hide();
}
function mostrar_frm(){
    var form_progra = document.getElementById('formulario_programa');
    var seleccion = document.getElementById('sacramentos').value;
    switch (seleccion){
        case 'matrimonio':
            form_progra.innerHTML = formulariopr_matrimonio;
        default:
            formContainer.innerHTML = '';   
    }
        
}


function hora_fin(hora_inicio, hora_fin) {
    var h_inicio = document.getElementById(hora_inicio).value;
    var [horas, minutos] = h_inicio.split(':').map(Number)

    var fecha = new Date();
    fecha.setHours(horas);
    fecha.setMinutes(minutos);

    fecha.setHours(fecha.getHours() + 2);

    var nueva_hora = String(fecha.getHours()).padStart(2, '0');
    var nuevos_minutos = String(fecha.getMinutes()).padStart(2, '0');

    document.getElementById(hora_fin).value = `${nueva_hora}:${nuevos_minutos}`;
}

