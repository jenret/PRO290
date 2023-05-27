# Use an official Node runtime as the parent image
FROM node:16

# Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# First copy only the package.json and lockfile, then run npm ci
COPY package.json ./
RUN npm install

# Now copy the rest of your application
COPY . .

# # Make sure your start.sh script is executable
# RUN ["chmod", "+x", "./start.sh"]

# Bind the application to port 5000
EXPOSE 5000

# Define the command to run your app using CMD
COPY start.sh /start.sh

CMD ["/bin/bash", "/start.sh"]