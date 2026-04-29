# Stage 1: Build and Dependencies
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend assets
RUN npm run build

# Stage 2: Production Runtime
FROM node:22-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built frontend from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the server and types (since node 22+ can run TS directly)
COPY server.ts ./
COPY types.ts ./
COPY tsconfig.json ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
