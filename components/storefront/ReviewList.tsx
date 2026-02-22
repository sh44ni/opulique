import { Star, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    isVerified: boolean;
    createdAt: string;
    adminReply?: string | null;
    productName?: string | null;
    productSlug?: string | null;
    productImage?: any;
}

interface ReviewListProps {
    reviews: Review[];
    showProductInfo?: boolean;
}

export default function ReviewList({ reviews, showProductInfo = false }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{review.userName}</span>
                                    {review.isVerified && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center text-green-600 text-xs font-medium cursor-help bg-green-50 px-2 py-0.5 rounded-full">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Verified Purchase</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            <div className="flex items-center mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-4">{review.comment}</p>

                            {/* Product Info (Optional) */}
                            {showProductInfo && review.productName && (
                                <Link href={`/product/${review.productSlug}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors mb-4 w-fit">
                                    <div className="relative w-10 h-10 rounded overflow-hidden bg-white">
                                        <Image
                                            src={review.productImage || '/placeholder.png'}
                                            alt={review.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{review.productName}</span>
                                </Link>
                            )}

                            {review.adminReply && (
                                <div className="bg-gray-50 border-l-4 border-green-800 p-4 rounded-r-md">
                                    <div className="flex items-center mb-1">
                                        <span className="font-semibold text-green-800 text-sm">Response from Store</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.adminReply}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
