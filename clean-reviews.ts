
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './lib/db';
import { reviews, products } from './lib/db/schema';
import { sql } from 'drizzle-orm';

async function cleanReviews() {
    console.log('Cleaning reviews...');

    try {
        // 1. Delete all reviews
        const result = await db.delete(reviews);
        console.log('Delete result:', result);
        console.log('All reviews deleted.');

        // 2. Ratings are no longer stored on products table
        console.log('Product ratings are computed dynamically now.');

    } catch (error: any) {
        console.error('Error cleaning reviews FULL DETAILS:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        if (error.cause) console.error('Error cause:', error.cause);
    } finally {
        console.log('Exiting...');
        process.exit();
    }
}

cleanReviews();
