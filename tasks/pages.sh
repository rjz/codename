#!/bin/bash

set -e

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Files that need to be checked out from master
masterDeps='package.json tasks index.js'

git checkout -B gh-pages

rm -rf $masterDeps
git checkout master $masterDeps

# Rebuild documentation and clean deps
npm run docs
cp -r docs/* .
rm -rf $masterDeps

# Commit and push
git add -A .
git commit -m "Rebuilds gh-pages for `git log master -1 | head -1`"
git push origin gh-pages

# Return to master
git checkout $GIT_BRANCH

