# ---- Stage 1: builder ----
# Cai du dependencies (bao gom devDependencies) va compile TypeScript -> dist/
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package.json + lockfile truoc de tan dung Docker layer cache:
# neu chi sua code (khong doi dependency) thi buoc "npm ci" khong phai chay lai
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: production ----
# Chi giu lai dependencies production + output da compile (dist/)
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Chay bang user thuong, khong dung root, de tang bao mat container
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

EXPOSE 3001
CMD ["node", "dist/index.js"]
