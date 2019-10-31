#!/bin/bash

set -e

NODE_ENV=development

cp env.default .env

# Install dependencies
npm install
npm run build

exec npm run production