# T3 Innovation Network Data Schema Converter
![tests](https://github.com/t3-innovation-network/desm/actions/workflows/test.yml/badge.svg) ![linters](https://github.com/t3-innovation-network/desm/actions/workflows/lint.yml/badge.svg)

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
> - ruby 3.2.2
> - postgreSQL 13
> - node 16.20 & yarn

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

For running the wepack-dev-server alongside rails use:
```
gem install foreman
foreman start -f Procfile.local --env ./.env.development
```

## Customization

### Adjust the text on the Homepage

In order to update the text on the homepage, you have to adjust the file contents inside of the `RightCol.jsx` file located in the following directory: `/main/app/javascript/components/home/`
- In order to see the updates, the system has to be redeployed
- Don't break the syntax of the currently set-up structure


## Collaborate

> Please create an issue or a pull request. There's a GitHub Actions linting and testing workflow that will validate quality.
All tasks are at [project board](https://github.com/orgs/t3-innovation-network/projects/1), issue card should be moved to the column that meets its status.

Development process:
1. All commits should be meaningful, preferably contain some feature or feedback changes/fixes.
2. Add number of issue (#issue_number) at commit message, that way it's easier to track changes.
3. Prefer rebase over merge if there is need to updated branch with master updates.
4. When creating PR add issue number to the PR body, it'll be linked to the issue that way.
5. After merging (only when QA passed and merge is approved by PM) delete the branch and squash commits if needed.

It's highly recommended to setup linters (`rubocop/eslint/stylelint/prettier`) at IDE and `overcommit` hooks (`overcommit --install`) or run manualy before comitting to GH `overcommit -r`.

## Jobs

No background jobs at the moment.
