#!/bin/bash

set -e

export CODACY_PROJECT_TOKEN=6b49b03a50254048ba094c28a04d62ab
rm -rf coverage

npm run test:coverage

cat coverage/lcov.info | node_modules/.bin/codacy-coverage
