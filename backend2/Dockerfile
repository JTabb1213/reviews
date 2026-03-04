# Use Node LTS (alpine = smaller image → faster Cloud Run cold starts)
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install production dependencies only (clean install from lock file)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source (see .dockerignore for what is excluded)
COPY . .

# Cloud Run injects PORT at runtime; 8080 is the expected default
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "server.js"]
