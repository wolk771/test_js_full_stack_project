# --- STAGE 1: Build (Alles vorbereiten und kompilieren) ---
FROM node:20-alpine AS builder

# Build-Tools NUR hier installieren
RUN apk add --no-cache python3 make g++ gcc libc-dev

WORKDIR /app

# 1. Backend & Bcrypt bauen
COPY package*.json ./
RUN npm install
# Jetzt ist bcrypt für Linux/Alpine fertig gebaut

# 2. Frontend bauen (Vite)
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
COPY tsconfig.json knexfile.js ./
COPY src ./src

# Erst Frontend (schreibt nach ./public)
RUN cd frontend && npm run build
# Dann Backend (schreibt nach ./dist)
RUN npx tsc

# --- STAGE 2: Run (Das saubere Endprodukt) ---
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Kopiere die fertigen JS-Dateien
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/knexfile.js ./
COPY --from=builder /app/package*.json ./

# Kopiere die bereits fertig gebauten node_modules rüber!
# Dadurch sparen wir uns das 'npm install' und 'rebuild' in Stage 2
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Dein Code macht die Migrationen beim Start selbst
CMD ["node", "dist/app.js"]
