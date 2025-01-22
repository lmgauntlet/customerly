#!/bin/bash

echo "🗑️  Resetting database..."
npm run db:reset

echo "🧹 Cleaning up migrations except 0_init..."
find prisma/migrations/* -type d ! -name "0_init" -exec rm -rf {} +

echo "📝 Creating new migration..."
read -p "Enter migration name: " migration_name
npm run db:createmigration "$migration_name"

echo "🔧 Running post-migration generator..."
npm run db:createmigrationpost

echo "⚡ Running migrations..."
npm run db:migrate

echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Done!" 
