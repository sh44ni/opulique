'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { addItem } = useCart();
    const router = useRouter();
    const [error, setError] = useState('');

    const handleAddToCart = () => {
        addItem(product, 'Standard', 1);
        setError('');

        // Optional: Show toast or feedback
        toast.success('Added to Cart', {
            description: `${product.name} has been added to your cart.`
        });
    };

    const handleBuyNow = () => {
        addItem(product, 'Standard', 1);
        router.push('/cart');
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3 pt-2">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#305752] text-white font-bold py-3.5 rounded-lg hover:bg-[#305752]/90 transition-all active:scale-[0.98] shadow-sm uppercase tracking-wide"
                >
                    Add to Cart
                </button>
                <button
                    onClick={handleBuyNow}
                    className="w-full border-2 border-[#305752] text-[#305752] font-bold py-3.5 rounded-lg hover:bg-[#305752] hover:text-white transition-all active:scale-[0.98] shadow-sm uppercase tracking-wide"
                >
                    Buy Now
                </button>

            </div>
        </div>
    );
}
