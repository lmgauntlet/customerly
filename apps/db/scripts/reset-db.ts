import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function resetDb() {
    const client = await pool.connect();

    try {
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