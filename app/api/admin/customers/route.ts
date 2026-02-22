import { NextRequest, NextResponse } from 'next/server';
import { adminGetCustomers } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { searchParams } = new URL(request.url);
        const result = await adminGetCustomers({
            search: searchParams.get('search') || undefined,
            page: Number(searchParams.get('page')) || 1,
            limit: Number(searchParams.get('limit')) || 20,
        });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}
