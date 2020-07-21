#!/usr/bin/env bash

set -e

cd "${0%/*}/.."

echo "Running tests"
docker-compose run --rm web bundle exec rspec