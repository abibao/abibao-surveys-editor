#!/bin/bash

node batchs/dump-surveys.js
node batchs/dump-answers.js
node batchs/dump-individuals.js

node batchs/dump-stats.js
