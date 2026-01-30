FROM node:18-alpine

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including dev for native compilation)
RUN npm ci --only=production

COPY . .

EXPOSE 8200

CMD ["npm", "start"]
 