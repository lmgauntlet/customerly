import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

const DB_DIR = path.resolve(__dirname, '..')
const WEB_DIR = path.resolve(DB_DIR, '..', 'web')

function loadEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    console.error(`Environment file not found: ${filePath}`)
    process.exit(1)
  }
  return dotenv.parse(fs.readFileSync(filePath))
}

function switchToEnvironment(envType: 'cypress' | 'real') {
  const currentEnv = loadEnvFile(path.join(DB_DIR, '.env'))
  
  // Backup current .env if it doesn't exist
  const backupPath = path.join(DB_DIR, '.env.backup')
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, fs.readFileSync(path.join(DB_DIR, '.env')))
    console.log('✅ Current environment backed up to .env.backup')
  }

  // Load the target environment
  const targetEnvPath = envType === 'cypress' 
    ? path.join(WEB_DIR, 'cypress.env')
    : path.join(DB_DIR, '.env.backup')
  
  const targetEnv = loadEnvFile(targetEnvPath)

  // Update DATABASE_URL and DIRECT_URL
  const newEnv = {
    ...currentEnv,
    DATABASE_URL: targetEnv.DATABASE_URL,
    DIRECT_URL: targetEnv.DIRECT_URL
  }

  // Write the new environment
  const envContent = Object.entries(newEnv)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  fs.writeFileSync(path.join(DB_DIR, '.env'), envContent)
  
  console.log(`✅ Switched to ${envType} environment`)
  console.log(`DATABASE_URL and DIRECT_URL updated from ${targetEnvPath}`)
}

// Handle command line argument
const envType = process.argv[2] as 'cypress' | 'real'
if (!envType || !['cypress', 'real'].includes(envType)) {
  console.error('Please specify environment type: cypress or real')
  process.exit(1)
}

switchToEnvironment(envType)
