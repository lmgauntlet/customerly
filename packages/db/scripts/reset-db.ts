import { Pool } from 'pg';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config();

console.log('Using DATABASE_URL:', process.env.DIRECT_URL);

const pool = new Pool({
    connectionString: process.env.DIRECT_URL
});

async function resetDb() {
    const client = await pool.connect();

    try {
        // First terminate idle connections
        const terminateSQL = `
            SELECT pg_terminate_backend(PSA.pid)
            FROM pg_locks AS PL
                INNER JOIN pg_stat_activity AS PSA ON PSA.pid = PL.pid
            WHERE PSA.state LIKE 'idle'
                AND PL.objid IN (72707369);
        `;

        await client.query(terminateSQL);
        console.log('Terminated idle connections...');

        console.log('Dropping all tables in public schema...');

        const dropAllSQL = `
            DO $$ 
            DECLARE 
                r RECORD;
            BEGIN
                -- Disable triggers temporarily
                SET session_replication_role = 'replica';

                -- Drop all tables in the 'public' schema except the _prisma_migrations table
                FOR r IN (
                    SELECT tablename
                    FROM pg_tables
                    WHERE schemaname = 'public'
                    AND tablename != '_prisma_migrations'
                )
                LOOP
                    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;

                -- Drop all enum types in the 'public' schema
                FOR r IN (
                    SELECT t.typname
                    FROM pg_type t
                    JOIN pg_namespace n ON t.typnamespace = n.oid
                    WHERE n.nspname = 'public'
                    AND t.typtype = 'e'
                )
                LOOP
                    EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
                END LOOP;

                -- Re-enable triggers
                SET session_replication_role = 'origin';

                -- Remove all migrations except the "0_init" one
                DELETE FROM _prisma_migrations
                WHERE migration_name != '0_init';
            END $$;
        `;

        await client.query(dropAllSQL);
        console.log('All tables and types in public schema dropped successfully');

        // Remove migration files except 0_init
        try {
            const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');
            if (fs.existsSync(migrationsDir)) {
                const files = fs.readdirSync(migrationsDir);
                for (const file of files) {
                    try {
                        const filePath = path.join(migrationsDir, file);
                        if (fs.statSync(filePath).isDirectory() && !file.endsWith('0_init')) {
                            fs.rmSync(filePath, { recursive: true, force: true });
                            console.log(`Removed migration directory: ${file}`);
                        }
                    } catch (err) {
                        console.log(`Skipping migration directory ${file}: ${err.message}`);
                    }
                }
            }
        } catch (err) {
            console.log(`Warning: Could not clean up migration files: ${err.message}`);
        }

        return true;
    } catch (error) {
        console.error('Error resetting database:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Execute if called directly
if (require.main === module) {
    resetDb()
        .catch((error) => {
            console.error('Failed to reset database:', error);
            process.exit(1);
        });
}

export { resetDb }; 