#!/usr/bin/env bash

# deletenpmfiles.sh
# A simple script to delete specific files/folders in the project.

echo "Removing specified files..."

# Remove top-level files/folders
rm -rf package-lock.json
rm -rf node_modules

# Go into 'client' folder and remove files
cd client || exit
rm -rf package-lock.json
rm -rf node_modules
rm -rf dist
cd ..

# Go into 'server' folder and remove files
cd server || exit
rm -rf package-lock.json
rm -rf node_modules
rm -rf dist
cd ..

echo "Files have been deleted (if they existed)."
