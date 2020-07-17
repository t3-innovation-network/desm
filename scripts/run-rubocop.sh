#!/usr/bin/env bash

set -e

cd "${0%/*}/.."

echo "Running rubocop"
docker-compose run --rm web bundle exec rubocop
