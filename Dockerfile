# Use Node 21.7.3 as the base image
FROM node:21.7.3-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (for caching dependencies)
COPY package*.json ./

# Install all dependencies (including dev dependencies for local dev)
RUN npm ci

# Copy all remaining source code into the container
COPY . .

# Expose the port your backend runs on (Nest default is 3000)
EXPOSE 3000

# Run the app in development mode (auto-reloads if code changes)
# We'll use volumes in docker-compose to link local code.
CMD ["npm", "run", "start:dev"]
