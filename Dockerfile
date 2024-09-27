# Base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the root
COPY package.json package-lock.json ./

# Copy the entire monorepo
COPY . .

# Install the root dependencies
RUN npm install --workspaces

# Navigate to the Next.js app directory
WORKDIR /app/apps/web

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
