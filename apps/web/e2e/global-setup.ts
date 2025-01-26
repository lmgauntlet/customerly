import { seedDb } from '@customerly/db/scripts/seed';

async function globalSetup() {
    // Seed the database once before all tests
    await seedDb(true);
}

export default globalSetup; 