FROM node:20 AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# RUN npm run build
RUN npm run build && ls -R public


FROM nginx:alpine

# 🔥 TA BORT DEFAULT HTML
RUN rm -rf /usr/share/nginx/html/*

# 🔥 KOPIERA DIN BUILD
COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80