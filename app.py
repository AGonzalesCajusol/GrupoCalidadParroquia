from flask import Flask, render_template
import controladores.controlador_diocesis
import routers.router_diocesis
import routers.router_main  # Importa las rutas generales
import routers.router_secretaria
import routers.router_recaudaciones
import routers.router_tipo_ministro  # Importa las rutas relacionadas con tipos de ministro
import routers.router_congregacion  # Importa las rutas relacionadas con

app = Flask(__name__)
app.secret_key = 'super-secret'

# Ruta para la página de inicio de sesión
@app.route('/')
def raiz():
    return render_template('inicio_sesion.html')

# Registrar las rutas definidas en router_main.py
routers.router_main.registrar_rutas(app)

# Registrar las rutas definidas en router_tipo_ministro.py
routers.router_tipo_ministro.registrar_rutas(app)

# Registrar las rutas definidas en router_congregacion.py
routers.router_congregacion.registrar_rutas(app)

# Secretaria
routers.router_secretaria.registrar_rutas(app)

# Registrar las rutas definidas en router_recaudaciones.py
routers.router_recaudaciones.registrar_rutas(app)

# Registrar las rutas definidas en router_diocesis.py
routers.router_diocesis.registrar_rutas(app)

if __name__ == '__main__':
    app.run(debug=True)
