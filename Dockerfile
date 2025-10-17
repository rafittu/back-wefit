FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose application port
EXPOSE 3008

# Start in development mode
CMD ["npm", "run", "start:dev"]

