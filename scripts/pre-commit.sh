#!/usr/bin/env bash

echo "Running pre-commit hook"
./scripts/run-rubocop.sh

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 cowsay "Code must be clean before commiting"
 exit 1
fi
