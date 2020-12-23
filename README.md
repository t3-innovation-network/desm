# T3 Innovation Network Data Schema Converter

This application provides the means to map (crosswalk) data specifications (standards) using predefined sets of mapping predicates that indicate the degree of equivalency between mapped property pairs, or the lack of such equivalency. The mapping outcomes of the tool will support data interoperability between data specifications based on the probabilities of matching or closely matching semantics.


## Installation (development)

> Precondition: To have docker and docker compose locally installed.

1. Clone this project locally
2. Create a ".env" file by copying the ".env.example" file. (It can be modified before the docker images are created)
2. Execute `docker-compose build`
3. Execute `docker-compose up`
4. In a different command prompt, execute `docker-compose run --rm web rake db:create db:migrate db:seed`
5. Go to http://localhost:3000

The project will be accessible from any device within your network

## Collaborate

> In order to collaborate, please set up your environment with the git hooks, following the steps below:

1. Execute `chmod +x scripts/*.bash`
2. Execute `./scripts/install-hooks.sh`

> Admin user email: "admin@schema.com", and the password will be the one in the ".env" file.

# Jobs

Jobs in production are being scheduled with server configuration running commands in a periodical basis.
If you want to run these jobs using a local scheduler, check out `whenever` gem. See [docs](https://github.com/javan/whenever).
