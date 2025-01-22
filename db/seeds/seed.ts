import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

config()

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
)

// Order matters for foreign key relationships
const tableOrder = [
    'users',              // Base table, no dependencies
    'teams',              // Depends on users (manager)
    'agents',             // Depends on users and teams
    'kb_categories',      // Self-referential but no other dependencies
    'kb_articles',        // Depends on kb_categories and users (author)
    'tickets',            // Depends on users (customer), teams, agents
    'ticket_messages',    // Depends on tickets and users
    'automation_rules',   // Depends on teams
    'response_templates', // Depends on users (creator) and teams
    'audit_logs',         // Depends on users (actor) and tickets
    'agent_metrics',      // Depends on agents
    'webhook_deliveries', // No dependencies but related to system events
    'attachments',        // Depends on users (uploader) and tickets
    'daily_metrics'       // Depends on teams
]

export async function emptyDb() {
    try {
        console.log('Emptying database...')

        for (const table of [...tableOrder].reverse()) { // Reverse again for deletion order
            const { error } = await supabase
                .from(table)
                .delete()
                .neq('id', '')

            if (error) {
                console.error(`Error emptying ${table}:`, error)
                throw error
            }
            console.log(`Emptied ${table}`)
        }

        console.log('Database emptied successfully')
    } catch (error) {
        console.error('Error emptying database:', error)
        throw error
    }
}

export async function seedDb(force = false) {
    try {
        if (force) {
            await emptyDb()
        }

        for (const table of tableOrder) {
            const dataPath = path.join(__dirname, 'data', `${table}.json`)
            const rawData = fs.readFileSync(dataPath, 'utf8')
            const data = JSON.parse(rawData)

            if (!Array.isArray(data)) {
                throw new Error(`Data in ${table}.json must be an array`)
            }

            const { error } = await supabase
                .from(table)
                .upsert(data)

            if (error) {
                console.error(`Error seeding ${table}:`, error)
                throw error
            }
            console.log(`Seeded ${table}`)
        }
        console.log('Database seeding completed')
    } catch (error) {
        console.error('Error seeding database:', error)
        throw error
    }
}

// Allow direct execution
if (require.main === module) {
    const force = process.argv.includes('--force')
    seedDb(force).catch(console.error)
}
