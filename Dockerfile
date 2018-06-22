################## BEGIN INSTALLATION ######################
# Set the base image to ubuntu
FROM node:9.7.0
WORKDIR /src/

ENV ELASTIC_DEMONETTE http://localhost:9200
ENV URL_ROOT_PATH /

# File Author / Maintainer
MAINTAINER Simon Meoni

## COPY PROJECT FILES
COPY . .
RUN  npm install

##################### INSTALLATION END #####################
EXPOSE 3000
CMD npm start ELASTIC_DEMONETTE=$ELASTIC_DEMONETTE URL_ROOT_PATH=$ELASTIC_DEMONETTE
