#!/usr/bin/env bash

echo "Running pre-push hook"
./scripts/run-tests.sh

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 cowsay "Tests must pass before pushing!"
 exit 1
fi