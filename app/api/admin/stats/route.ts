import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getRecentOrders } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const [stats, recentOrders] = await Promise.all([
            getDashboardStats(),
            getRecentOrders(5),
        ]);

        return NextResponse.json({ stats, recentOrders });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
