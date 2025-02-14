# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the React app.
RUN npm run build

# Expose the app port.
EXPOSE 3000

# Serve the React app using a static file server.
RUN npm install -g serve
CMD ["serve", "-s", "build"]