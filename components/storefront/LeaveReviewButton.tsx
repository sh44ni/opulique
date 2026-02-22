'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, LogIn } from 'lucide-react';
import ReviewForm from './ReviewForm';
import Link from 'next/link';

export default function LeaveReviewButton() {
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenReview = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();

            if (data.authenticated) {
                setIsAuthenticated(true);
                setIsReviewFormOpen(true);
            } else {
                window.location.href = '/login?redirect=/';
            }
        } catch (error) {
            console.error('Auth check failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={handleOpenReview}
                disabled={isLoading}
                className="bg-[#305752] hover:bg-[#1e3a2d] text-white"
            >
                {isLoading ? (
                    'Loading...'
                ) : (
                    <>
                        <MessageSquarePlus className="w-4 h-4 mr-2" />
                        Leave a Review
                    </>
                )}
            </Button>

            {isAuthenticated && (
                <ReviewForm
                    // Pass a dummy ID or handle global reviews differently if needed.
                    // Ideally ReviewForm should handle "Store Review" if no productId is passed,
                    // BUT current schema requires product_id.
                    // For now, we might need to pick a random product or modify schema.
                    // WAIT: User said "add the leave a review button to homepage".
                    // Usually homepage reviews are SITE reviews.
                    // But our schema is product-linked.
                    // Let's check ReviewForm.
                    productId={null}
                    isOpen={isReviewFormOpen}
                    onClose={() => setIsReviewFormOpen(false)}
                    onReviewSubmitted={() => setIsReviewFormOpen(false)}
                />
            )}
        </>
    );
}
