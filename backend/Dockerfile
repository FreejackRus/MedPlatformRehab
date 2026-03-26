FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY README.md ./README.md

ENV PORT=4010
EXPOSE 4010

CMD ["node", "src/server.js"]
