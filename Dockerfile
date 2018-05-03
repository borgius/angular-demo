#########################
### build environment ###
#########################

# base image
FROM node as builder

# OPTIONAL: Install dumb-init (Very handy for easier signal handling of SIGINT/SIGTERM/SIGKILL etc.)
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64.deb
RUN dpkg -i dumb-init_*.deb
ENTRYPOINT ["dumb-init"]

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

RUN npm install -g yarn knex codeceptjs-puppeteer @angular/cli@latest --unsafe

# set working directory
RUN mkdir /usr/src/app

WORKDIR /usr/src/app
COPY package.json /usr/src/app/package.json
RUN npm install --ignore-engines

WORKDIR /usr/src/front
COPY front/package.json /usr/src/front/package.json
RUN npm install --ignore-engines

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:/usr/src/front/node_modules/.bin:$PATH

# add app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm run build

# move front
RUN tar cf - front |(cd /usr/src; tar xvf -)

WORKDIR /usr/src/front
RUN npm run build
# run tests
RUN ng test --watch=false --browsers ChromeCustom

# generate build
RUN npm run build

########################
### production nginx ###
########################

# base image
FROM nginx:alpine as nginx

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/front/dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]

########################
### production node  ###
########################

# base image
FROM node:alpine as node

WORKDIR /usr/src/app

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app /usr/src/app

# run node
EXPOSE 8080
CMD [ "npm", "start" ]
