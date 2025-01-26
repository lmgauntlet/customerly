import { Command } from 'commander'
import { resetDb } from './scripts/reset-db'
import { seedDb } from './seeds/seed'

const program = new Command()

program
    .name('db-cli')
    .description('CLI to manage database operations')

program
    .command('reset')
    .description('Drop all tables in public schema')
    .action(async () => {
        try {
            await resetDb()
        } catch (error) {
            console.error('Failed to reset database:', error)
            process.exit(1)
        }
    })

program
    .command('seed')
    .description('Seed database with data from seeds/data directory')
    .option('-f, --force', 'Empty database before seeding')
    .action(async (options) => {
        try {
            await seedDb(options.force)
        } catch (error) {
            console.error('Failed to seed database:', error)
            process.exit(1)
        }
    })

program.parse()