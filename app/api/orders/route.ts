import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    const token = (await cookies()).get('user_session')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifySession(token);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch orders for the logged-in user (by email) -> Assuming customer_email matches
        // Ideally we should link by user_id but currently orders stores customer_email
        // We can treat email as the link for now.
        const userOrders = await db.query.orders.findMany({
            where: eq(orders.customer_email, session.email),
            orderBy: [desc(orders.created_at)],
        });

        return NextResponse.json({ orders: userOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
