# Use official Node.js image as base
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
# Ensure Prisma client is generated
RUN npm ci --production && npx prisma generate
EXPOSE 5000
CMD ["node", "dist/index.js"]
