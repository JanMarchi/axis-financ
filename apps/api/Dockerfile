FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package-lock.json ./apps/api/
COPY packages/shared/package.json packages/shared/package-lock.json ./packages/shared/

# Instalar dependências
RUN npm ci

# Copiar código
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Compilar TypeScript
RUN npm run build -w apps/api

EXPOSE 3001

CMD ["npm", "run", "start:prod", "-w", "apps/api"]
