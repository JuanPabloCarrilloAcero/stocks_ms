# Use a base image with Node.js and npm pre-installed
FROM node:18.17.1

# Create a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your Nest.js application is listening on
EXPOSE 3000

# Start the Nest.js application
CMD ["npm", "run", "start:prod"]
