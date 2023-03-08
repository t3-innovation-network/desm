# T3 Innovation Network Data Schema Converter

![T3 Innovation Network Logo](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273002/t3-desm/T3Logo_lv3xpn.png)

This application provides the means to map (crosswalk) data specifications (standards) using predefined sets of mapping predicates that indicate the degree of equivalency between mapped property pairs, or the lack of such equivalency. The mapping outcomes of the tool will support data interoperability between data specifications based on the probabilities of matching or closely matching semantics.

## Local installation 1 (docker)

> Precondition -> The following technolgoes are needed before starting the installation:
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

### Dependencies

1. Ruby (see [.ruby-version](.ruby-version) or [Gemfile](Gemfile) to find out the required version)
2. PostgreSQL 13
3. Node 14 and Yarn
4. libpq-dev

### Steps

1. Clone this project locally.
2. Create a database user and enable a password-based authentication method for the user (e.g. `md5`).
3. Create a `.env` file by copying the [.env.example](.env.example) file. Modify the `.env` file to use the database user's credentials.
4. Run `gem install bundler:<VERSION>` to install Bundler (see the very bottom of [Gemfile.lock](Gemfile.lock) to find out the required version).
5. Run `bin/bundle` to install the backend dependencies.
6. Run `yarn install` to install the frontend dependencies.
7. Run `bin/rails db:create db:migrate` to create the database.
8. (Optional) Run `bin/rails db:seed` to populate the database with sample data.
9. Run `bin/rails s` to start the server.
10. Visit the app URL specified in the `.env` file.

## Collaborate

> Please create an issue or a pull request. There's a GitHub Actions linting and testing workflow that will validate quality.

## Jobs

Jobs in production are being scheduled with server configuration running commands in a periodical basis.

If you want to run these jobs using a local scheduler, check out `whenever` gem. See gem [docs](https://github.com/javan/whenever).

Please check the wiki in order to know how to use the tool
