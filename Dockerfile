# Usa una imagen base con Node.js
FROM node:18 AS build

# Define el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de tu proyecto
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instala las dependencias
RUN npm install

# Compila el proyecto
RUN npm run build

# Define una segunda etapa para la imagen de producción
FROM node:18 AS production

# Define el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos compilados desde la etapa de construcción
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --only=production

# Expone el puerto que usa tu aplicación
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
