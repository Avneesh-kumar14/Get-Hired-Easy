FROM node:18-alpine as server
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server .
EXPOSE 8000
CMD ["npm", "run", "dev"]
