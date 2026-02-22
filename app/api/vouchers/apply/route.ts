import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vouchers } from '@/lib/db/schema';
import { eq, and, gte, lte, or, isNull } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { code, subtotal } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Voucher code is required' }, { status: 400 });
        }

        const [voucher] = await db.select().from(vouchers).where(eq(vouchers.code, code)).limit(1);

        if (!voucher) {
            return NextResponse.json({ error: 'Invalid voucher code' }, { status: 404 });
        }

        if (!voucher.is_active) {
            return NextResponse.json({ error: 'Voucher is inactive' }, { status: 400 });
        }

        const now = new Date();
        if (voucher.expires_at && new Date(voucher.expires_at) < now) {
            return NextResponse.json({ error: 'Voucher has expired' }, { status: 400 });
        }

        if (voucher.max_uses && voucher.max_uses > 0 && (voucher.used_count || 0) >= voucher.max_uses) {
            return NextResponse.json({ error: 'Voucher usage limit reached' }, { status: 400 });
        }

        if (Number(voucher.min_order_amount) > subtotal) {
            return NextResponse.json({
                error: `Minimum order amount of ${Number(voucher.min_order_amount)} required`
            }, { status: 400 });
        }

        let discountAmount = 0;
        if (voucher.discount_type === 'percentage') {
            discountAmount = (subtotal * Number(voucher.discount_value)) / 100;
        } else {
            discountAmount = Number(voucher.discount_value);
        }

        // Cap discount at subtotal (cannot be negative total)
        discountAmount = Math.min(discountAmount, subtotal);

        return NextResponse.json({
            valid: true,
            code: voucher.code,
            discount: discountAmount,
            type: voucher.discount_type,
            value: Number(voucher.discount_value)
        });

    } catch (error) {
        console.error('Voucher apply error:', error);
        return NextResponse.json({ error: 'Failed to apply voucher' }, { status: 500 });
    }
}
