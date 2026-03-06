# ---- Build stage: install all deps (including dev) for potential build steps ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

# ---- Production stage: lean, secure image ----
FROM node:20-alpine AS production

RUN apk add --no-cache tini

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=build /app/ ./

RUN rm -rf .git .env* Dockerfile docker-compose* *.md tests

RUN chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]