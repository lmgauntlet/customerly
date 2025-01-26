#!/bin/bash

# Load environment variables
source .env

# Check if we're in a test environment
if [ "$NODE_ENV" = "test" ]; then
  ENV_TYPE="TEST"
else
  ENV_TYPE="PRODUCTION"
fi

# Warn if we're in production
if [ "$ENV_TYPE" = "PRODUCTION" ]; then
  echo "⚠️  WARNING: You are about to reset the PRODUCTION database!"
  read -p "Are you sure you want to continue? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 1
  fi
fi

echo "🗑️  Dropping database..."
npx prisma db push --force-reset

echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Database reset and seeded successfully!"
