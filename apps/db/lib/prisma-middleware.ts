import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

// Logging middleware
export const loggingMiddleware: Prisma.Middleware = async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();

    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
    return result;
};

// Validation middleware
export const validationMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.model === 'Agent' && (params.action === 'create' || params.action === 'update')) {
        const data = params.args.data;
        if ('currentTickets' in data && 'maxTickets' in data) {
            if (data.currentTickets < 0 || data.currentTickets > data.maxTickets) {
                throw new Error('Current tickets must be between 0 and max tickets');
            }
        }
    }
    return next(params);
};

// Migration middleware to add updated_at triggers
export const migrationMiddleware: Prisma.Middleware = async (params, next) => {
    const result = await next(params);

    // Only process during schema changes
    if (params.action === 'create') {
        await addUpdatedAtTriggers();
    }

    return result;
};

async function addUpdatedAtTriggers() {
    try {
        const migrationsDir = join(process.cwd(), 'prisma', 'migrations');

        // Get latest migration
        const migrations = readdirSync(migrationsDir)
            .filter(dir => {
                const stat = statSync(join(migrationsDir, dir));
                return stat.isDirectory() && !dir.startsWith('.');
            })
            .sort((a, b) => b.localeCompare(a));

        if (migrations.length === 0) return;

        const latestMigration = migrations[0];
        const migrationFile = join(migrationsDir, latestMigration, 'migration.sql');

        if (!existsSync(migrationFile)) return;

        const content = readFileSync(migrationFile, 'utf8');
        const modifiedContent = addTriggerFunction(content);

        if (content !== modifiedContent) {
            writeFileSync(migrationFile, modifiedContent);
            console.log('Added updated_at triggers to migration file');
        }
    } catch (error) {
        console.error('Error adding updated_at triggers:', error);
    }
}

function addTriggerFunction(content: string): string {
    const triggerFunction = `
-- CreateUpdatedAtFunction
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

`;

    const tableRegex = /CREATE TABLE "([^"]+)"\s*\(([\s\S]*?)\);/g;
    let modifiedContent = content;
    let match;
    let hasUpdatedAtTables = false;

    while ((match = tableRegex.exec(content)) !== null) {
        const tableName = match[1];
        const tableContent = match[2];

        if (tableContent.includes('updated_at')) {
            hasUpdatedAtTables = true;
            const trigger = `
-- CreateTrigger${tableName}UpdatedAt
CREATE TRIGGER update_${tableName}_updated_at
    BEFORE UPDATE ON "${tableName}"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

`;
            modifiedContent += trigger;
        }
    }

    if (hasUpdatedAtTables) {
        modifiedContent = triggerFunction + modifiedContent;
    }

    return modifiedContent;
}

// Helper to add all middlewares
export function addMiddlewares(prisma: PrismaClient) {
    prisma.$use(loggingMiddleware);
    prisma.$use(validationMiddleware);
    prisma.$use(migrationMiddleware);
} 