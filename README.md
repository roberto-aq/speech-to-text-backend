# Descripción
Este proyecto es una rest api desarrollada con express que utiliza una dependencia de una plataforma de transcripción de audio a texto (ASSEMBLYAI) 

# Guía de instalación
1. Instala las dependencias 
```bash
npm install
```
2. Renombrar el archivo .env.template a .env y llenar las variables de entorno necesarias
3. Ejecutar el servidor de desarrollo con el siguiente comando:
```bash
npm run start:dev
```

## Flujo de la API
Se recibe un audio a partir de un endpoint, realizamos la transcripcion usando AssemblyAI, si no tenemos la apiKey definida en nuestras variables o en el store del proyecto saltará un error. En caso de funcionar entonces ese endpoint se va a encargar de almacenar el audio en una carpeta llamada **uploads** y luego tomara de esa carpeta el audio, lo transcribirá y guardará un documento docx en una carpeta llamada **transcripciones**. En caso de no existir estas carpetas las creará. 


## Características del proyecto
- Permite subir audios y transcribirlos a texto y guardarlos en un documento de texto
- Obtiene todos los documentos 
- Permite modificar la apikey desde un endpoint
- Permite descargar el documento docx directamente