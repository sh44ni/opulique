import { NextRequest, NextResponse } from 'next/server';
import { adminGetVouchers, adminCreateVoucher, adminUpdateVoucher, adminDeleteVoucher } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function GET() {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const data = await adminGetVouchers();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const data = await request.json();

        if (data.expires_at) {
            data.expires_at = new Date(data.expires_at);
        }

        const voucher = await adminCreateVoucher(data);
        return NextResponse.json(voucher, { status: 201 });
    } catch (error: any) {
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Voucher code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
    }
}
