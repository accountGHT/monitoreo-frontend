# Etapa 1: Construcción de la aplicación
FROM node:16-alpine AS builder

# Crear el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm ci

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con nginx
FROM nginx:alpine

# Copiar los archivos de build al directorio que nginx utiliza para servir archivos
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar el archivo de configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
