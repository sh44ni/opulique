import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews, users, products } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Fetch Reviews with User and Product details
        const reviewsData = await db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                comment: reviews.comment,
                is_verified_purchase: reviews.is_verified_purchase,
                is_featured: reviews.is_featured,
                is_hidden: reviews.is_hidden,
                admin_reply: reviews.admin_reply,
                created_at: reviews.created_at,
                user: {
                    name: users.full_name,
                    email: users.email,
                },
                product: {
                    name: products.name,
                    slug: products.slug,
                    image: products.images,
                },
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.user_id, users.id))
            .leftJoin(products, eq(reviews.product_id, products.id))
            .orderBy(desc(reviews.created_at))
            .limit(limit)
            .offset(offset);

        // Get Total Count
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(reviews);

        return NextResponse.json({
            reviews: reviewsData,
            pagination: {
                total: Number(count),
                page,
                limit,
                totalPages: Math.ceil(Number(count) / limit),
            },
        });

    } catch (error: any) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
