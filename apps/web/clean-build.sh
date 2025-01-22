#!/bin/bash

# Remove build artifacts and dependencies
rm -rf .next
rm -rf node_modules
rm -rf .turbo

# Reinstall dependencies and rebuild
npm install
npx turbo build
