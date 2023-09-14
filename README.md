# T3 Innovation Network Data Schema Converter

![T3 Innovation Network Logo](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273002/t3-desm/T3Logo_lv3xpn.png)

This application provides the means to map (crosswalk) data specifications (standards) using predefined sets of mapping predicates that indicate the degree of equivalency between mapped property pairs, or the lack of such equivalency. The mapping outcomes of the tool will support data interoperability between data specifications based on the probabilities of matching or closely matching semantics.

## Local installation 1 (docker)

> Precondition -> The following technologies are needed before starting the installation:
> - docker
> - docker compose

1. Clone this project locally
2. Create an ".env" file by copying the ".env.example" file. (It can be modified before the docker images are created).
    - **2.a** Make sure the APP_DOMAIN environment variable is `http://localhost:3030`
    - **2.b.** Make sure the DB environment variables (starting with `POSTGRESQL_`) are the same as in the .env.example file.
3. Execute `docker compose build`
4. Execute `docker compose up`
5. In a different command prompt, execute `docker compose run --rm web rake db:create db:migrate db:seed`
6. Go to http://localhost:3000

## Local installation 2

> Precondition -> The following technologies are needed before starting the installation:
> - ruby 2.7.1
> - postgreSQL 13
> - npm
> - node
> - yarn

1. Clone this project locally.
2. Create an ".env" file by copying the ".env.example" file.
3. Make sure the version of ruby on your system is the same as declared in the Gemfile.
4. Run `bundle install` (backend dependencies).
5. Run `yarn install` (frontend dependencies).
6. Create a user in postgres to manage the db creation/migration. Or use postgres credentials.
7. Make sure the ennvironment variables for the database are set into the .env file (the user and password should be the same as on the step 6.)
8. Run `rake db:create db:migrate db:seed` (Database structure creation and population).
9. Run `rails s`
10. Go to http://localhost:3000

## Collaborate

> Please create an issue or a pull request. There's a GitHub Actions linting and testing workflow that will validate quality.

## Jobs

Jobs in production are being scheduled with server configuration running commands in a periodical basis.

If you want to run these jobs using a local scheduler, check out `whenever` gem. See gem [docs](https://github.com/javan/whenever).

Please check the wiki in order to know how to use the tool
