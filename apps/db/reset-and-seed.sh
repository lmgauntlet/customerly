#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Detect environment type
if [[ $DATABASE_URL == *"cypress"* ]] || [[ $TEST_USER == *"cypress"* ]]; then
    ENV_TYPE="CYPRESS"
else
    ENV_TYPE="REAL"
fi

echo "🔍 Running in ${ENV_TYPE} environment"
echo "-------------------"

# Check if there are any migrations other than 0_init
if [ $(ls prisma/migrations | grep -v "0_init" | wc -l) -gt 0 ]; then
    echo "🗑️  Resetting database..."
    npm run db:reset

    echo "🧹 Cleaning up migrations except 0_init..."
    find prisma/migrations/* -type d ! -name "0_init" -exec rm -rf {} +
fi

echo "📝 Creating new migration..."
npm run db:createmigration "initial_schema"

echo "🔧 Running post-migration generator..."
npm run db:createmigrationpost

echo "⚡ Running migrations..."
npm run db:migrate

echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Done!"
