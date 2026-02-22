import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/utils';

// PATCH: Update review status or reply
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;
        const body = await request.json();
        const { is_hidden, is_featured, admin_reply } = body;

        const updateData: any = { updated_at: new Date() };
        if (is_hidden !== undefined) updateData.is_hidden = is_hidden;
        if (is_featured !== undefined) updateData.is_featured = is_featured;
        if (admin_reply !== undefined) updateData.admin_reply = admin_reply;

        const updatedReview = await db
            .update(reviews)
            .set(updateData)
            .where(eq(reviews.id, id))
            .returning();

        return NextResponse.json(updatedReview[0]);
    } catch (error: any) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove a review
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const { id } = await params;

        await db.delete(reviews).where(eq(reviews.id, id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
