# ===== ETAPA 1: Construcción =====
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY frontend/package*.json ./

# Limpiar cache y reinstalar dependencias
# Esto es crítico en Docker para evitar conflictos de binarios nativos
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install

# Copiar resto del código
COPY frontend/ .

# ===== ETAPA 2: Runtime =====
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias instaladas de la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copiar código fuente
COPY frontend/ .

# Exponer puerto
EXPOSE 3000

# Comando para correr en desarrollo
CMD ["npm", "run", "dev"]
