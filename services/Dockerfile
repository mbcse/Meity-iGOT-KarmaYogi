# Stage 1: Build
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies with pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy Prisma schema and source files
COPY prisma ./prisma
COPY . .

# Ensure the Prisma schema is available and generate Prisma Client
RUN pnpx prisma generate

# Compile TypeScript to JavaScript
RUN pnpm run build

# Stage 2: Production
FROM node:18 AS production

# Set the working directory
WORKDIR /app

# Install PM2
RUN npm install -g pm2

# Install pnpm
RUN npm install -g pnpm

# Copy the compiled code and environment files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules

# Copy Prisma schema
COPY --from=build /app/prisma ./prisma

# Copy all .env files (for completeness, but NODE_ENV will be passed as ARG)
COPY .env ./
COPY .env.dev ./
COPY .env.prod ./

# Install production dependencies with pnpm
RUN pnpm install --prod

# Ensure Prisma Client is available
RUN pnpx prisma generate

# Pass NODE_ENV as an environment variable
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

# Start the application using PM2
CMD ["pm2-runtime", "dist/server.js"]

# Expose the port on which the app will run
EXPOSE 3010
