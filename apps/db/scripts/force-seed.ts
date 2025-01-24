import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
)

async function forceSeed() {
  try {
    console.log('🗑️  Clearing all tables...')
    
    // List of tables to clear - order matters due to foreign key constraints
    // Tables with foreign key dependencies must be cleared first
    const tables = [
      'audit_logs',        // Has FK to multiple tables
      'agent_metrics',     // Has FK to users and agents
      'daily_metrics',     // Has FK to teams
      'ticket_messages',   // Has FK to tickets and users
      'attachments',       // Has FK to tickets and messages
      'webhook_deliveries',
      'tickets',          // Has FK to users and teams
      'kb_articles',      // Has FK to categories and users
      'kb_categories',    // Has FK to users
      'response_templates', // Has FK to users
      'automation_rules',  // Has FK to teams
      'agents',           // Has FK to users
      'users',            // Referenced by many tables
      'teams'             // Referenced by many tables
    ]

    // Clear each table
    for (const table of tables) {
      console.log(`   Clearing ${table}...`)
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '') // Delete all rows
      
      if (error) {
        throw new Error(`Error clearing ${table}: ${error.message}`)
      }
    }

    console.log('✅ All tables cleared')
    
    // Run the normal seed script
    const { spawn } = require('child_process')
    const seed = spawn('npm', ['run', 'db:seed'], { stdio: 'inherit' })
    
    seed.on('error', (error: Error) => {
      console.error('Error running seed script:', error)
      process.exit(1)
    })

    seed.on('close', (code: number) => {
      if (code !== 0) {
        console.error('Seed script failed')
        process.exit(1)
      }
      console.log('✅ Database reseeded successfully')
    })

  } catch (error) {
    console.error('Error in force-seed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  forceSeed()
}
