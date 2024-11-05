from flask import Flask, render_template, request, redirect, url_for
import routers.router_actosliturgicos
import routers.router_celebracion
import routers.router_charlas
import routers.router_diocesis
import routers.router_feligres
import routers.router_main  # Importa las rutas generales
import routers.router_ministro
import routers.router_solicitud
import routers.router_recaudaciones
import routers.router_gestionar_intencionactos
import routers.router_tema
import routers.router_tipo_recaudacion  # Importa las rutas relacionadas con
import routers.router_sede
import routers.router_tipo_ministro # Importa las rutas relacionadas con tipos de ministro
import routers.router_congregacion  # Importa las rutas relacionadas con
import routers.router_cargo
import routers.router_egresos
import routers.router_charlas
import routers.router_programacion
app = Flask(__name__)
app.secret_key = 'super-secret'


#decorador ministros


# Ruta para la página de inicio de sesión
@app.route('/')
def raiz():
    print('11223344')
    return render_template('inicio_sesion.html')

#ruta_envio


# Registrar las rutas definidas en router_main.pyw
routers.router_main.registrar_rutas(app)

# Registrar las rutas definidas en router_tipo_ministro.py
routers.router_tipo_ministro.registrar_rutas(app)

# Registrar las rutas definidas en router_congregacion.py
routers.router_congregacion.registrar_rutas(app)

# Registrar las rutas definidas en router_sede.py
routers.router_sede.registrar_rutas(app)
# Secretaria
routers.router_solicitud.registrar_rutas(app)

# Registrar las rutas definidas en router_recaudaciones.py
routers.router_recaudaciones.registrar_rutas(app)
# registrar las rutas definidas en router_intenciones.py
routers.router_gestionar_intencionactos.registrar_rutas(app)
# Registrar las rutas definidas en router_recaudaciones.py
routers.router_tipo_recaudacion.registrar_rutas(app)

# Registrar las rutas definidas en router_egresos.py
routers.router_egresos.registrar_rutas(app)


# Registrar las rutas definidas en router_diocesis.py
routers.router_diocesis.registrar_rutas(app)

routers.router_ministro.registrar_rutas(app)

routers.router_cargo.registrar_rutas(app)
routers.router_actosliturgicos.registrar_rutas(app)

routers.router_feligres.registrar_rutas(app)

routers.router_tema.registrar_rutas(app)

routers.router_celebracion.registrar_rutas(app)

routers.router_programacion.registrar_rutas(app)

#charlka nueva
routers.router_charlas.registrar_rutas(app)



if __name__ == '__main__':
    app.run(debug=True)
