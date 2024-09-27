# Use the official Node.js image as the base image
FROM node:20-alpine

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --workspaces

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]