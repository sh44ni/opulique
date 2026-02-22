import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const [brand] = await db.select().from(brands).where(eq(brands.id, id));
        if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

        return NextResponse.json(brand);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const [updated] = await db.update(brands)
            .set({
                ...body,
                updated_at: new Date()
            })
            .where(eq(brands.id, id))
            .returning();

        if (!updated) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

        return NextResponse.json(updated);
    } catch (error: any) {
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const [deleted] = await db.delete(brands)
            .where(eq(brands.id, id))
            .returning();

        if (!deleted) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
    }
}
