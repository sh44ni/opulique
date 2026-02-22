
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './lib/db';
import { orders } from './lib/db/schema';
import { desc } from 'drizzle-orm';

async function checkOrders() {
    console.log('Checking recent orders...');
    try {
        const recentOrders = await db.select().from(orders).orderBy(desc(orders.created_at)).limit(5);
        console.log('Recent 5 orders:');
        recentOrders.forEach(o => {
            console.log(`Order #${o.order_number} | ID: ${o.id} | Status: ${o.status} | Email: ${o.customer_email}`);
        });
    } catch (error) {
        console.error('Error checking orders:', error);
    } finally {
        process.exit();
    }
}

checkOrders();
