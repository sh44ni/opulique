
import { db } from '@/lib/db';
import { reviews, users, products } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import ReviewList from '@/components/storefront/ReviewList';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GlobalReviewsPage() {
    // Fetch all reviews for the store
    const allReviews = await db
        .select({
            id: reviews.id,
            rating: reviews.rating,
            comment: reviews.comment,
            is_verified_purchase: reviews.is_verified_purchase,
            created_at: reviews.created_at,
            admin_reply: reviews.admin_reply,
            user_name: users.full_name,
            product_name: products.name,
            product_slug: products.slug,
            product_image: products.images,
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.user_id, users.id))
        .leftJoin(products, eq(reviews.product_id, products.id))
        .where(eq(reviews.is_hidden, false))
        .orderBy(desc(reviews.created_at));

    // Format for ReviewList component
    const formattedReviews = allReviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        isVerified: review.is_verified_purchase || false,
        createdAt: review.created_at?.toISOString() || new Date().toISOString(),
        userName: review.user_name || 'Anonymous',
        adminReply: review.admin_reply,
        productName: review.product_name,
        productSlug: review.product_slug,
        productImage: Array.isArray(review.product_image) ? review.product_image[0] : review.product_image,
    }));

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-[#305752] mb-4">Customer Reviews</h1>
                <p className="text-gray-600">See what our community is saying about their finds.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
                <ReviewList reviews={formattedReviews} showProductInfo={true} />
            </div>
        </div>
    );
}
