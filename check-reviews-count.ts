
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './lib/db';
import { reviews } from './lib/db/schema';
import { sql } from 'drizzle-orm';

async function checkCount() {
    console.log('Checking review count...');
    try {
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(reviews);
        console.log('Total reviews in DB:', count);

        const allReviews = await db.select().from(reviews).limit(5);
        console.log('First 5 reviews:', JSON.stringify(allReviews, null, 2));
    } catch (error: any) {
        console.error('Error checking count FULL DETAILS:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        if (error.cause) console.error('Error cause:', error.cause);
    } finally {
        process.exit();
    }
}

checkCount();
