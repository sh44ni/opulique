import { Star, Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LeaveReviewButton from '@/components/storefront/LeaveReviewButton';

export const dynamic = 'force-dynamic';

async function getFeaturedReviews() {
    try {
        // Fetch latest 3 reviews. In production, you might want to filter by high rating or 'is_featured' flag.
        // Since we are server-side, we can import db directly or call the API.
        // Calling API requires full URL, so direct DB access is better here for RSC.

        const { db } = await import('@/lib/db');
        const { reviews, users, products } = await import('@/lib/db/schema');
        const { desc, eq } = await import('drizzle-orm');

        const data = await db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                comment: reviews.comment,
                user_name: users.full_name,
                product_name: products.name,
                product_image: products.images,
                product_slug: products.slug,
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.user_id, users.id))
            .leftJoin(products, eq(reviews.product_id, products.id))
            .where(eq(reviews.is_hidden, false))
            .orderBy(desc(reviews.created_at))
            .limit(3);

        return data;
    } catch (error) {
        console.error('Failed to fetch featured reviews', error);
        return [];
    }
}

export default async function FeaturedReviews() {
    const reviews = await getFeaturedReviews();

    // if (reviews.length === 0) {
    //     return null;
    // }

    return (
        <section className="pt-12 pb-8 bg-background relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#305752]/10 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-[#305752] tracking-tight mb-2">What Our Customers Say</h2>
                    <div className="h-1 w-20 bg-[#305752] mx-auto rounded-full"></div>
                </div>

                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 border-t-4 border-t-[#305752] hover:-translate-y-1 transition-all duration-300 relative flex flex-col">
                                <Quote className="absolute top-6 right-6 w-10 h-10 text-[#305752]/10" />

                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700 mb-6 line-clamp-4 italic flex-grow">"{review.comment}"</p>

                                <div className="flex items-center mt-auto pt-4 border-t border-gray-50">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#305752] font-bold text-sm mr-3 flex-shrink-0">
                                        {(review.user_name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{review.user_name || 'Anonymous'}</p>
                                        {review.product_slug ? (
                                            <Link href={`/product/${review.product_slug}`} className="text-xs text-[#305752] hover:underline block truncate max-w-[200px]">
                                                {review.product_name}
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-gray-500 block">Verified Buyer</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500 mb-6">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <Button asChild variant="outline" className="border-[#305752] text-[#305752] hover:bg-[#305752] hover:text-white">
                    <Link href="/reviews">
                        See All Reviews
                    </Link>
                </Button>

                <LeaveReviewButton />
            </div>
        </section>
    );
}
