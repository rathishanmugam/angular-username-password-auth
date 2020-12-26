# Create image based on the official Node 10 image from dockerhub
FROM node:10

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /app/

#ENV APIURL=<backend-app-service-ip>:<port>      "start": "ng serve --host 0.0.0.0",

#ENV API_KEY=192.168.64.3:31734


# Expose the port the app runs in
EXPOSE 4200
#EXPOSE 80

# Serve the app
CMD ["npm", "start"]


