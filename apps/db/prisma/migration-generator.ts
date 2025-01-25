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

        // Get all migration folders except 0_init, sorted descending
        const allMigrations = fs
            .readdirSync(migrationsDir)
            .filter((f) => {
                const stats = fs.statSync(path.join(migrationsDir, f));
                return stats.isDirectory() && f !== '0_init';
            })
            .sort((a, b) => b.localeCompare(a));

        if (allMigrations.length === 0) {
            console.warn('No migrations found to process');
            return;
        }

        // Get the most recent migration
        const latestMigration = allMigrations[0];
        const migrationPath = path.join(migrationsDir, latestMigration, 'migration.sql');

        if (!fs.existsSync(migrationPath)) {
            console.warn(`No migration.sql found in ${latestMigration}`);
            return;
        }

        // Read and process the migration
        const migrationContent = fs.readFileSync(migrationPath, 'utf8');
        const modifiedContent = addUpdatedAtTriggers(migrationContent);

        // Write back the modified content
        fs.writeFileSync(migrationPath, modifiedContent);
        console.log(`✅ Successfully updated migration: ${latestMigration}`);
    } catch (error) {
        console.error('Error processing migration:', error);
        process.exit(1);
    }
}

// Execute if called directly
if (require.main === module) {
    run();
}

// Also export if needed by other scripts
export { run };
