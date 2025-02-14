# Use the official Node.js image.
FROM node:18

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the NestJS app.
RUN npm run build

# Run the NestJS app.
CMD ["npm", "run", "start:prod"]

# Expose the app port.
EXPOSE 3000