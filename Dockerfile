# Utiliza una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Compila la aplicación
RUN npm run build

# Instala un servidor HTTP simple para servir el contenido
RUN npm install -g serve

# Expone el puerto 5000 y define el comando de inicio
EXPOSE 8086
CMD ["serve", "-s", "build", "-l", "8086"]
