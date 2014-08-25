#!/bin/bash

set -e

# Files that need to be checked out from master
masterDeps='package.json tasks index.js'

git checkout gh-pages
git checkout master $masterDeps

# Rebuild documentation and clean deps
npm run docs
cp docs/* .
rm -rf $masterDeps

# Commit and push
git add -A .
git commit -m "Rebuilds gh-pages for `git log master -1 | head -1`"
git push origin gh-pages

# Return to master
git checkout master

