'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Store, Loader2 } from 'lucide-react';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');

    return (
        <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
                <p className="text-gray-600">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>

                {orderNumber && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Order Number</p>
                        <p className="text-2xl font-bold text-primary font-mono">{orderNumber}</p>
                    </div>
                )}

                <p className="text-sm text-gray-500">
                    You will receive an email confirmation shortly.
                </p>

                <div className="flex flex-col space-y-3 pt-4">
                    <Link
                        href="/shop"
                        className="w-full bg-secondary text-foreground font-semibold py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Store className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                    <Link
                        href="/"
                        className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Loading Order Confirmation...</h2>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
