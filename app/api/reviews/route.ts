import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews, orders, products, users } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get('productId');
        const featured = searchParams.get('featured');
        const limit = parseInt(searchParams.get('limit') || '10');

        const conditions = [];

        if (productId) {
            conditions.push(eq(reviews.product_id, productId));
        }

        if (featured === 'true') {
            conditions.push(eq(reviews.is_featured, true));
        }

        let query = db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                comment: reviews.comment,
                is_verified_purchase: reviews.is_verified_purchase,
                admin_reply: reviews.admin_reply,
                created_at: reviews.created_at,
                user_name: users.full_name,
                product_name: products.name,
                product_slug: products.slug,
                product_image: products.images,
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.user_id, users.id))
            .leftJoin(products, eq(reviews.product_id, products.id))
            .$dynamic();

        if (conditions.length > 0) {
            query = query.where(and(...conditions, eq(reviews.is_hidden, false)));
        } else {
            query = query.where(eq(reviews.is_hidden, false));
        }

        const data = await query
            .orderBy(desc(reviews.created_at))
            .limit(limit);

        // Format data to handle null joins if necessary, though leftJoin ensures structure
        const formattedData = data.map(review => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            isVerified: review.is_verified_purchase,
            createdAt: review.created_at,
            adminReply: review.admin_reply,
            userName: review.user_name || 'Anonymous', // Fallback if user deleted
            productName: review.product_name,
            productSlug: review.product_slug,
            productImage: Array.isArray(review.product_image) ? review.product_image[0] : review.product_image,
        }));

        return NextResponse.json({ success: true, reviews: formattedData });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // 1. Verify Session
        const cookieStore = await cookies();
        const token = cookieStore.get('user_session')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = verifySession(token);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { productId, rating, comment } = body;

        if (!rating || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Verify Purchase & Delivery Status
        // Get all delivered orders for this user
        const userOrders = await db
            .select()
            .from(orders)
            .where(
                and(
                    eq(orders.customer_email, session.email),
                    eq(orders.status, 'delivered')
                )
            );

        if (userOrders.length === 0) {
            return NextResponse.json({ error: 'You have no delivered orders eligible for review.' }, { status: 403 });
        }

        if (productId) {
            // Check if product is in any of the orders items
            const hasPurchased = userOrders.some(order => {
                const items = order.items as any[]; // Type assertion for JSONB
                return items.some((item: any) => item.product_id === productId);
            });

            if (!hasPurchased) {
                return NextResponse.json({
                    error: 'You can only review products you have purchased and received (Delivered status).'
                }, { status: 403 });
            }

            // Check if already reviewed this product
            const existingReview = await db
                .select()
                .from(reviews)
                .where(
                    and(
                        eq(reviews.product_id, productId),
                        eq(reviews.user_id, session.userId)
                    )
                );

            if (existingReview.length > 0) {
                return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 409 });
            }
        } else {
            // General Site Review - Check if they already left a general review? 
            // Maybe allow multiple? Let's limit to 1 per user for now to be safe, or allow.
            // Let's allow multiple for site reviews for now, or maybe check unrelated logic.
            // Review table unique constraint is not set for user_id only.
            // Proceed.
        }

        const [newReview] = await db.insert(reviews).values({
            product_id: productId || null,
            user_id: session.userId,
            rating: rating,
            comment: comment,
            is_verified_purchase: true, // Since we verified they have at least one delivered order
        }).returning();

        // 4. Product rating update removed since rating column is removed from products schema
        if (productId) {
            // Ratings are dynamically fetched or handled in page components directly
        }

        return NextResponse.json({ success: true, review: newReview });

    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
