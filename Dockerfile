################## BEGIN INSTALLATION ######################
# Set the base image to ubuntu
FROM node:latest
WORKDIR /src/

# File Author / Maintainer
MAINTAINER Simon Meoni

## COPY PROJECT FILES
COPY . .
RUN  npm install

##################### INSTALLATION END #####################
EXPOSE 3000
CMD npm start
