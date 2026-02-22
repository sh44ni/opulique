import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brands } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const allBrands = await db.select().from(brands).orderBy(desc(brands.created_at));
        return NextResponse.json(allBrands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const [newBrand] = await db.insert(brands).values({
            name: data.name,
            slug: data.slug,
            cover_image: data.cover_image || null,
            sort_order: data.sort_order || 0,
            is_active: data.is_active !== undefined ? data.is_active : true,
        }).returning();

        return NextResponse.json(newBrand);
    } catch (error: any) {
        console.error('Error creating brand:', error);
        if (error.code === '23505') { // Unique violation
            return NextResponse.json({ error: 'Brand slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
    }
}
