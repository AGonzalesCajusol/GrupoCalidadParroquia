function finalizar_sesion(){
    document.cookie = "token=; path=/;"; 
    document.cookie = "dni=; path=/;"; 
    document.cookie = "tipo=; path=/;"; 
    document.cookie = "nombre=;path=/; "
    location.reload();
}
