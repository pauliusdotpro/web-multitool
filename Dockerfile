# Base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the root
COPY package.json package-lock.json ./

# Copy the workspace config (if you have a .npmrc or similar)
COPY .npmrc ./

# Install the root dependencies
RUN npm instal --workspaces

# Copy the entire monorepo
COPY . .

# Navigate to the Next.js app directory
WORKDIR /app/apps/web

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
