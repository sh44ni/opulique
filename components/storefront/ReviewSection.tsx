'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, LogIn } from 'lucide-react';
import ReviewForm from './ReviewForm';
import Link from 'next/link';

interface ReviewSectionProps {
    productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [userUser, setUserUser] = useState<any>(null);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            setIsAuthenticated(data.authenticated);
            if (data.authenticated) {
                setUserUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, [productId]);

    const handleReviewSubmitted = (newReview: any) => {
        setIsReviewFormOpen(false);
        // Maybe show a toast here?
    };

    return (
        <section className="py-8 bg-white rounded-2xl shadow-sm p-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#305752]">Have you bought this?</h2>
                    <p className="text-sm text-gray-500">Share your thoughts with the community.</p>
                </div>

                <div className="flex gap-4">
                    <Button asChild variant="outline" className="border-[#305752] text-[#305752] hover:bg-[#305752] hover:text-white">
                        <Link href="/reviews">
                            See All Reviews
                        </Link>
                    </Button>

                    {isAuthenticated ? (
                        <Button
                            onClick={() => setIsReviewFormOpen(true)}
                            className="bg-[#305752] hover:bg-[#1e3a2d] text-white"
                        >
                            <MessageSquarePlus className="w-4 h-4 mr-2" />
                            Leave a Review
                        </Button>
                    ) : (
                        <Button asChild variant="secondary">
                            <Link href="/login">
                                <LogIn className="w-4 h-4 mr-2" />
                                Sign in to Review
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <ReviewForm
                productId={productId}
                isOpen={isReviewFormOpen}
                onClose={() => setIsReviewFormOpen(false)}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </section>
    );
}
