import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Credenciales
user = "grupoparroquia955@gmail.com"
password = "gincuijajketznry"  # Asegúrate de que esta sea la contraseña correcta
asunto = "Envio de requisitos del acto liturgico"

def enviar(destinatario,html):
    # Configurar el mensaje
    msg = MIMEMultipart()
    msg['Subject'] = asunto
    msg['From'] = user
    msg['To'] = destinatario

    msg.attach(MIMEText(html, 'html'))  # Asegúrate de usar MIMEText aquí

    # Iniciar el servidor Gmail
    server = smtplib.SMTP('smtp.gmail.com', 587)
    # Conexión segura
    server.starttls()
    server.login(user, password)

    # Enviar el correo
    server.sendmail(
        user,
        destinatario,
        msg.as_string()
    )

    # Cerrar la conexión
    server.quit()

