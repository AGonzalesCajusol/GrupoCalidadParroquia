function finalizar_sesion(){
    document.cookie = "token=; path=/;"; 
    document.cookie = "dni=; path=/;"; 
    document.cookie = "tipo=; path=/;"; 

}