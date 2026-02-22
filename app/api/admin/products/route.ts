import { NextRequest, NextResponse } from 'next/server';
import { adminGetProducts, adminCreateProduct } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { searchParams } = new URL(request.url);
        const result = await adminGetProducts({
            search: searchParams.get('search') || undefined,
            status: searchParams.get('status') || undefined,
            brand: searchParams.get('brand') || undefined,
            page: Number(searchParams.get('page')) || 1,
            limit: Number(searchParams.get('limit')) || 20,
        });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const data = await request.json();
        const product = await adminCreateProduct(data);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('POST /api/admin/products error:', error);
        const message = error instanceof Error ? error.message : 'Failed to create product';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
