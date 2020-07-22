#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)

echo "Installing hooks..."

# this command creates symlink to our pre-commit script
ln -s ../../scripts/pre-commit.sh $GIT_DIR/hooks/pre-commit
ln -s ../../scripts/pre-push.sh $GIT_DIR/hooks/pre-push

echo "Done!"
