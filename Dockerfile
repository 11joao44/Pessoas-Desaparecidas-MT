# =================================================================
# ESTÁGIO 1: Build da Aplicação React
# =================================================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# =================================================================
# ESTÁGIO 2: Servidor de Produção (Nginx)
# =================================================================
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]