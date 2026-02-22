import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        await db.delete(customers).where(eq(customers.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/admin/customers/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
    }
}
