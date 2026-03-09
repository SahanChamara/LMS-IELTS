# Build Stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

# Production Stage
FROM nginx:alpine

RUN addgroup -S lmsclientgroup && adduser -S lmsclientuser -G lmsclientgroup

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R lmsclientuser:lmsclientgroup /usr/share/nginx/html \
    && chown -R lmsclientuser:lmsclientgroup /var/cache/nginx \
    && chown -R lmsclientuser:lmsclientgroup /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown lmsclientuser:lmsclientgroup /var/run/nginx.pid

USER lmsclientuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]