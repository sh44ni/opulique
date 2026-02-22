import { NextRequest, NextResponse } from 'next/server';
import { adminGetProductById, adminUpdateProduct, adminDeleteProduct } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const product = await adminGetProductById(id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const data = await request.json();
        const product = await adminUpdateProduct(id, data);
        return NextResponse.json(product);
    } catch (error) {
        console.error('PUT /api/admin/products/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Failed to update product';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        await adminDeleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
