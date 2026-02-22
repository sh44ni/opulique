import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderNumber, phone } = body;

        if (!orderNumber || !phone) {
            return NextResponse.json(
                { error: 'Order Number and Phone Number are required' },
                { status: 400 }
            );
        }

        // Find order matching both number and phone
        // Phone match should probably be exact or close.
        // For security, strict match is best.
        // User input phone might vary in format, but let's assume raw string for now.
        // Ideal: Normalize phone numbers. For now, direct match.

        const result = await db
            .select()
            .from(orders)
            .where(
                and(
                    eq(orders.order_number, orderNumber),
                    eq(orders.customer_phone, phone)
                )
            );

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Order not found or details incorrect' },
                { status: 404 }
            );
        }

        const order = result[0];

        // Return safe order details
        return NextResponse.json({
            id: order.id,
            order_number: order.order_number,
            status: order.status,
            created_at: order.created_at,
            items: order.items,
            subtotal: order.subtotal,
            delivery_fee: order.delivery_fee,
            discount: order.discount,
            total: order.total,
            tracking_number: order.tracking_number,
            courier_name: order.courier_name,
            shipping_address: order.shipping_address,
            city: order.city,
            payment_method: order.payment_method
        });

    } catch (error) {
        console.error('Track Order API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
