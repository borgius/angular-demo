 [//]: <> (https://github.com/mesaugat/express-api-es6-starter)

## Setup

Clone the repository, install the dependencies and get started right away.

    $ git clone git@github.com:borgius/angular-demo.git <application-name>
    $ cd <application-name>
    $ rm -rf .git
    $ yarn   # or npm install

Make a copy of `.env.example` as `.env` and update your application details and database credentials. Now, run the migrations and seed the database.

    $ createdb mapp-dev 
    $ yarn migrate
    $ yarn seed

Finally, start the application.

    $ yarn start:dev (For development)
    $ yarn start (For production)

Navigate to http://localhost:8848/api-docs/ to verify installation.

## Creating new Migrations and Seeds

These are the commands to create a new migration and corresponding seed file.

    $ yarn make:migration <name>
    $ yarn make:seeder <name>

Example,

    $ yarn make:migration create_tags_table
    $ yarn make:seeder 02_insert_tags

## Setup Using Docker

Use [docker-compose](https://docs.docker.com/compose/) to quickly bring up a stack with pre-configured Postgres database container. Data is ephemeral and containers will disappear when stack is removed.

Specific configuration for Docker is in `.env.docker`
- `0.0.0.0` as `$APP_HOST` to expose app on Docker network interface
- Pre-configured Postgres settings - can be updated to point to another Postgres host

Bring up stack,

    $ docker-compose up

Navigate to http://localhost:8848/api-docs/ to verify application is running from docker.

Bring down stack,

    $ docker-compose down
