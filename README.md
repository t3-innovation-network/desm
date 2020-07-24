# T3 Innovation Network Data Schema Converter

This application is meant to serve as a way to reach interoperability between different data schemas.
There are different official data schemas like CEDS, Dublin Core, among others. With this application it's possible to convert metadata from one specification to another.

## Installation (development)

> Precondition: To have docker and docker compose locally installed.

1. Clone this project locally
2. Execute `docker-compose build`
3. Execute `docker-compose up`
4. In a different command prompt, execute `docker-compose run --rm web rake db:create`
4. Then, execute `docker-compose run --rm web rake db:migrate`
4. And finally, to get all the initial data, execute `docker-compose run --rm web rake db:seed`
5. Go to http://localhost:3000

The project will be accessible from any device within your network

## Collaborate

> In order to collaborate, please set up your environment with the git hooks, following the steps below:

1. Execute `chmod +x scripts/*.bash`
2. Execute `./scripts/install-hooks.sh`

> Admin user email: "admin@t3converter.com", pass: "t3admin"
