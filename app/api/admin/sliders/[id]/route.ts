import { NextRequest, NextResponse } from 'next/server';
import { adminUpdateSlider, adminDeleteSlider } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const data = await request.json();
        const slider = await adminUpdateSlider(id, data);
        return NextResponse.json(slider);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update slider' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        await adminDeleteSlider(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete slider' }, { status: 500 });
    }
}
