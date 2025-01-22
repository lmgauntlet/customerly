/* scripts/add-updated-at-triggers.ts */

import fs from 'fs';
import path from 'path';

function addUpdatedAtTriggers(migrationContent: string): string {
    // Trigger function that updates 'updated_at'
    const triggerFunction = `
-- CreateTrigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

    // Regex to match CREATE TABLE statements
    const tableRegex = /CREATE TABLE "([^"]+)"\s*\(([\s\S]*?)\);/g;

    // We'll prepend the trigger function, then append triggers as needed
    let modifiedContent = triggerFunction + migrationContent;
    let match;

    while ((match = tableRegex.exec(migrationContent)) !== null) {
        const tableName = match[1];
        const tableBody = match[2];

        // If the table has an 'updated_at' column, add a BEFORE UPDATE trigger
        if (tableBody.includes('updated_at')) {
            const trigger = `
-- CreateTrigger
CREATE TRIGGER update_${tableName}_updated_at
    BEFORE UPDATE ON "${tableName}"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;
            modifiedContent += trigger;
        }
    }

    return modifiedContent;
}

function run() {
    try {
        const prismaDir = path.join(process.cwd(), 'prisma');
        const migrationsDir = path.join(prismaDir, 'migrations');

        // Ensure migrations directory exists
        if (!fs.existsSync(migrationsDir)) {
            console.warn(`No migrations directory found at: ${migrationsDir}`);
            return;
        }

        // Get all migration folders, sorted descending
        const allMigrations = fs
            .readdirSync(migrationsDir)
            .filter((f) => fs.statSync(path.join(migrationsDir, f)).isDirectory())
            .sort((a, b) => b.localeCompare(a));

        if (allMigrations.length === 0) {
            console.warn('No migrations to modify.');
            return;
        }

        // Latest migration folder
        const latestMigration = allMigrations[0];
        const migrationFilePath = path.join(migrationsDir, latestMigration, 'migration.sql');

        if (!fs.existsSync(migrationFilePath)) {
            console.warn(`No migration.sql file found in ${latestMigration}`);
            return;
        }

        // Read, modify, and rewrite the migration file
        const content = fs.readFileSync(migrationFilePath, 'utf-8');
        const modified = addUpdatedAtTriggers(content);
        fs.writeFileSync(migrationFilePath, modified, 'utf-8');

        console.log(`Added updated_at triggers to migration: ${latestMigration}`);
    } catch (err) {
        console.error('Error adding updated_at triggers:', err);
        process.exit(1);
    }
}

// Execute if called directly
if (require.main === module) {
    run();
}

// Also export if needed by other scripts
export { run };
