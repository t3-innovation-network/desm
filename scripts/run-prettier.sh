#!/usr/bin/env bash

FILES=$(git diff --name-only --diff-filter=ACMR "*.js" "*.jsx" | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

# Prettify all selected files
echo "$FILES" | docker-compose run --rm web xargs ./node_modules/.bin/prettier --write && git add "*.js" "*.jsx"

# Add back the modified/prettified files to staging
echo "$FILES" | docker-compose run --rm web xargs git add

exit 0