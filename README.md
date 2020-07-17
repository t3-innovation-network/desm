# T3 Metadata Converter

This application is meant to serve as a way to reach interoperability between different data schemas.
There are different official data schemas like CEDS, Dublin Core, among others. With this application it's possible to convert metadata from one specification to another.

## Installation (development)

> Precondition: To have docker and docker compose locally installed.

1. Clone this project locally
2. Execute `docker-compose build`
3. Execute `docker-compose up`
4. In a different command prompt, execute`docker-compose run web rake db:create`
5. Go to http://localhost:3000