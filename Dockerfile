# Utiliza una imagen oficial de Node.js
FROM node:18-alpine AS build

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

# Instala Nginx y configura para servir la aplicación
FROM nginx:alpine

# Elimina el archivo de configuración predeterminado de Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copia los archivos compilados desde la etapa de construcción
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando de inicio de Nginx
CMD ["nginx", "-g", "daemon off;"]
