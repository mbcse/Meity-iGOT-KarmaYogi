FROM ubuntu:jammy

# Update and upgrade packages
RUN apt-get update && apt-get upgrade -y

# Install dependencies
RUN apt-get install -y curl

# Install Node.js (LTS) and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Install pnpm
RUN npm install -g pnpm

# Log npm version
RUN npm --version

#install playwright browser
RUN pnpx playwright install
RUN pnpx playwright install-deps
# Set the working directory
WORKDIR /app


# Install project dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install


COPY public/ /app/

# Copy the project files
COPY tests/e2e /app/
COPY . /app/

RUN chmod +x ./docker.sh
ENTRYPOINT [ "./docker.sh" ]