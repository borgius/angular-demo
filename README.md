## Setup

Clone the repository, install the dependencies and get started right away.

    $ git clone git@github.com:borgius/angular-demo.git
    $ cd angular-demo
    $ npm install
    $ cd front
    $ npm install

Make a copy of `.env.example` as `.env` and update your application details and database credentials. Now, run the migrations and seed the database.

    $ createdb angular_demo 
    $ createdb angular_demo_test 
    $ yarn migrate
    $ yarn seed

Finally, start the application.

  Backend:

    $ yarn start:dev (For development)
    $ yarn start (For production)

  Frontend:

    $ cd front
    $ ng serve --open

## Tests
### BackEnd 
    $ npm test
### FrontEnd
    $ cd front
    $ ng test

## Setup Using Docker

### Build Images
    $ docker build -f Dockerfile --target nginx -t borgius/demo-front .
    $ docker build -f Dockerfile --target node -t borgius/demo-back .


Use [docker-compose](https://docs.docker.com/compose/) to quickly bring up a stack with pre-configured Postgres database container. Data is ephemeral and containers will disappear when stack is removed.

Specific configuration for Docker is in `.env.docker`
- `0.0.0.0` as `$APP_HOST` to expose app on Docker network interface
- Pre-configured Postgres settings - can be updated to point to another Postgres host

Bring up stack,

    $ docker-compose up

Bring down stack,

    $ docker-compose down


###### [based on express-api-es6-starter](https://github.com/mesaugat/express-api-es6-starter)
