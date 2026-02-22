
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { reviews, users } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import ReviewList from '@/components/storefront/ReviewList';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import Image from 'next/image';

export default async function ProductReviewsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Fetch all reviews for this product
    const productReviews = await db
        .select({
            id: reviews.id,
            rating: reviews.rating,
            comment: reviews.comment,
            is_verified_purchase: reviews.is_verified_purchase,
            created_at: reviews.created_at,
            admin_reply: reviews.admin_reply,
            user_name: users.full_name,
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.user_id, users.id))
        .where(
            and(
                eq(reviews.product_id, product.id),
                eq(reviews.is_hidden, false)
            )
        )
        .orderBy(desc(reviews.created_at));

    // Format for ReviewList component
    const formattedReviews = productReviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        isVerified: review.is_verified_purchase || false,
        createdAt: review.created_at?.toISOString() || new Date().toISOString(),
        userName: review.user_name || 'Anonymous',
        adminReply: review.admin_reply,
    }));

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href={`/product/${product.slug}`} className="inline-flex items-center text-sm text-gray-500 hover:text-[#305752] mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Product
            </Link>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={Array.isArray(product.images) ? (product.images[0] as string) : (product.images as string || '/placeholder.png')}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-yellow-500">
                                <span className="font-bold mr-1">5.0</span>
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-gray-500">• {formattedReviews.length} Reviews</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-[#305752] mb-6">All Reviews</h2>
                <ReviewList reviews={formattedReviews} />
            </div>
        </div>
    );
}
