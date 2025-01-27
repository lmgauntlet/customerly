import pkg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pkg

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize database connection
const pool = new Pool({
    connectionString: process.env.DIRECT_URL
})

async function applyStoragePolicies() {
    const client = await pool.connect()
    
    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, '..', 'supabase', 'access', 'migrations', '00001_storage_policies.sql')
        const sql = fs.readFileSync(sqlPath, 'utf8')

        // Split the SQL into individual statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0)

        // Execute each statement
        for (const statement of statements) {
            try {
                await client.query(statement)
                console.log('Successfully executed:', statement.split('\n')[0])
            } catch (error) {
                console.error(`Error executing statement: ${statement}`)
                console.error(error)
                throw error
            }
        }

        console.log('Successfully applied all storage policies')
    } catch (error) {
        console.error('Error applying storage policies:', error)
        process.exit(1)
    } finally {
        client.release()
        await pool.end()
    }
}

// Run the script
applyStoragePolicies() 