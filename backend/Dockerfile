# Dockerfile pour le backend NestJS
FROM node:18-alpine

# Installer les dépendances nécessaires pour build
RUN apk add --no-cache python3 make g++

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Builder l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:prod"]
