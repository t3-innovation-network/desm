#!/usr/bin/env bash

echo "Running pre-commit hook --- Rubocop processing..."
./scripts/run-rubocop.sh

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 cowsay "Code must be clean before commiting, please review your 'rb' files"
 exit 1
fi

echo "Running pre-commit hook --- Prettier processing"
./scripts/run-prettier.sh

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 cowsay "Code must be clean before commiting, please review your '.js', and '.jsx' files"
 exit 1
fi