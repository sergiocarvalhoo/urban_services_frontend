FROM node:20-alpine as builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Imagem de produção
FROM nginx:alpine

# Copiar arquivos estáticos da build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]