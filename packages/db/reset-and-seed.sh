#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check for environment argument
ENV_FILE=".env"
if [ "$1" = "test" ]; then
  ENV_FILE="test.env"
  ENV_TYPE="TEST"
else
  ENV_TYPE="PRODUCTION"
fi

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: $ENV_FILE not found"
  exit 1
fi

echo "📁 Using environment file: $ENV_FILE"

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

echo "🔄 Resolving initial migration..."
set +e
npx dotenv -e $ENV_FILE -- prisma migrate resolve --applied 0_init
set -e

echo "🗑️  Resetting database..."
npx dotenv -e $ENV_FILE -- node --no-warnings=DEP0040 -r ts-node/register scripts/reset-db.ts

echo "📝 Creating new migration..."
npx dotenv -e $ENV_FILE -- prisma migrate dev --create-only --name initial_schema

echo "📝 Running post-migration tasks..."
npx dotenv -e $ENV_FILE -- ts-node prisma/migration-generator.ts

echo "🔄 Applying migrations..."
npx dotenv -e $ENV_FILE -- prisma migrate deploy

echo "🌱 Seeding database..."
npx dotenv -e $ENV_FILE -- node --no-warnings=DEP0040 -r ts-node/register scripts/seed.ts

echo "✅ Database reset and seeded successfully!"
