#!/bin/bash

set -e

export CODACY_PROJECT_TOKEN=13fb91d00cde41639fe71eb088cad5a1
rm -rf coverage

npm run test:coverage

cat coverage/lcov.info | node_modules/.bin/codacy-coverage
