# Imagen base liviana de Node.js
FROM node:22-alpine

# Crear y usar el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias (usa `--omit=dev` si prefieres sin las dev en prod)
RUN npm install

# Copiar el resto del código (incluye ts, env, etc.)
COPY . .

# Compilar TypeScript
RUN npm run build

# Puerto expuesto (ajústalo si es otro)
EXPOSE 8000

# Comando para iniciar la app
CMD ["node", "dist/app.js"]
