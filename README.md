# T3 Innovation Network Data Schema Converter

![T3 Innovation Network Logo](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273002/t3-desm/T3Logo_lv3xpn.png)

This application provides the means to map (crosswalk) data specifications (standards) using predefined sets of mapping predicates that indicate the degree of equivalency between mapped property pairs, or the lack of such equivalency. The mapping outcomes of the tool will support data interoperability between data specifications based on the probabilities of matching or closely matching semantics.

## Installation (development)

> Precondition: To have docker and docker compose locally installed.

1. Clone this project locally

2. Create a ".env" file by copying the ".env.example" file. (It can be modified before the docker images are created)

3. Execute `docker-compose build`

4. Execute `docker-compose up`

5. In a different command prompt, execute `docker-compose run --rm web rake db:create db:migrate db:seed`

6. Go to http://localhost:3000

The project will be accessible from any device within your network

## Collaborate

> Please create an issue or a pull request. There's a GitHub Actions linting and testing workflow that will validate quality.

## Jobs

Jobs in production are being scheduled with server configuration running commands in a periodical basis.

If you want to run these jobs using a local scheduler, check out `whenever` gem. See gem [docs](https://github.com/javan/whenever).

Please check the wiki in order to know how to use the tool
