#!/usr/bin/env bash

# This script installs dependencies, builds the project, and seeds the database.

npm install
npm run build
npm run seed
