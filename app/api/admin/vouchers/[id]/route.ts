import { NextRequest, NextResponse } from 'next/server';
import { adminUpdateVoucher, adminDeleteVoucher } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const data = await request.json();

        if (data.expires_at) {
            data.expires_at = new Date(data.expires_at);
        }

        const voucher = await adminUpdateVoucher(id, data);

        if (!voucher) {
            return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
        }

        return NextResponse.json(voucher);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        await adminDeleteVoucher(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete voucher' }, { status: 500 });
    }
}
