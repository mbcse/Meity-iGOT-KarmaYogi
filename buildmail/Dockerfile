# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml, and install dependencies
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install

# Copy the rest of the source code
COPY . .

# Build the React app
RUN pnpm run build

# Stage 2: Serve the React app
FROM node:20-alpine AS runner
WORKDIR /app

# Install a simple static server to serve the React app
RUN npm install -g serve

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist /app

# Expose the necessary port
EXPOSE 3001

# Start the React app using the 'serve' command
CMD ["serve", "-s", ".", "-l", "3001"]
