import { seedDb } from '@customerly/db/scripts/seed';
import { createClient } from '@supabase/supabase-js';

async function globalSetup() {
    // Initialize Supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // Clean up storage bucket
        console.log('Cleaning up storage bucket...');
        const { data: files, error: listError } = await supabase.storage
            .from('customerly')
            .list();

        if (listError) {
            console.error('Error listing files:', listError);
        } else if (files && files.length > 0) {
            const filePaths = files.map(file => file.name);
            const { error: deleteError } = await supabase.storage
                .from('customerly')
                .remove(filePaths);

            if (deleteError) {
                console.error('Error deleting files:', deleteError);
            } else {
                console.log(`Deleted ${filePaths.length} files from storage`);
            }
        } else {
            console.log('No files to clean up in storage');
        }
    } catch (error) {
        console.error('Storage cleanup error:', error);
    }

    // Seed the database
    console.log('Seeding database...');
    await seedDb(true);
    console.log('Database seeded successfully');
}

export default globalSetup; 