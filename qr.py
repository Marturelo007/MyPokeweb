import qrcode
from PIL import Image

# Función para generar un código QR con la forma de Pikachu
def generar_qr_pikachu(https://mbpokedex.netlify.app/):
    # Crear un objeto QRCode
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )

    # Añadir los datos (enlace) al código QR
    qr.add_data(enlace)
    qr.make(fit=True)

    # Crear una imagen QR
    img = qr.make_image(fill_color="black", back_color="white")

    # Cargar la imagen de Pikachu
    pikachu = Image.open("pikachu.png")

    # Obtener las dimensiones de la imagen QR y redimensionar Pikachu
    img_size = img.size
    pikachu = pikachu.resize((img_size[0], img_size[1]))

    # Combinar las imágenes (superponer Pikachu sobre el código QR)
    img.paste(pikachu, (0, 0), pikachu)

    # Guardar la imagen resultante
    img.save(nombre_archivo)

if __name__ == "__main__":
    # Enlace que deseas codificar en el QR
    enlace = "https://www.ejemplo.com"

    # Nombre del archivo de salida
    nombre_archivo = "qr_pikachu.png"

    # Generar el código QR con la forma de Pikachu
    generar_qr_pikachu(enlace, nombre_archivo)

    print(f"Se ha generado el código QR en {nombre_archivo}.")
