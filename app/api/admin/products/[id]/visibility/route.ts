import { NextRequest, NextResponse } from 'next/server';
import { adminToggleProductVisibility } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const { is_visible } = await request.json();
        const product = await adminToggleProductVisibility(id, Boolean(is_visible));
        return NextResponse.json(product);
    } catch (error) {
        console.error('PATCH /visibility error:', error);
        return NextResponse.json({ error: 'Failed to update visibility' }, { status: 500 });
    }
}
