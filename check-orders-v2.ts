
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './lib/db';
import { orders } from './lib/db/schema';
import { desc } from 'drizzle-orm';
import * as fs from 'fs';

async function checkOrders() {
    try {
        const recentOrders = await db.select().from(orders).orderBy(desc(orders.created_at)).limit(5);
        const logContent = JSON.stringify(recentOrders, null, 2);
        fs.writeFileSync('orders_dump.json', logContent);
        console.log('Orders dumped to orders_dump.json');
    } catch (error: any) {
        console.error('Error checking orders FULL DETAILS:', error);
        const errorLog = {
            message: error.message,
            stack: error.stack,
            query: error.query, // if available
            params: error.params, // if available
            cause: error.cause
        };
        fs.writeFileSync('orders_error.txt', JSON.stringify(errorLog, null, 2));
    } finally {
        // Wait a bit before exit
        setTimeout(() => process.exit(), 1000);
    }
}

checkOrders();
