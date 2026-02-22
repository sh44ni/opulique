'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Footprints } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/lib/context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

// removed condition colors

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);

    // ... (inside component)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        const color = product.variants && product.variants.length > 0 ? product.variants[0].color : 'Standard';
        addItem(product, color, 1);
        toast.success('Added to Cart', {
            description: `${product.name} (${color}) added.`
        });
    };

    return (
        <Link href={`/product/${product.slug}`}>
            <div className="group w-full relative bg-white/40 border border-white/60 rounded-2xl overflow-hidden hover:bg-white/60 hover:border-white transition-all duration-300 shadow-sm hover:shadow-md">
                {/* Image Container */}
                <div className="relative aspect-square mix-blend-multiply rounded-t-2xl overflow-hidden bg-transparent mb-1">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                        />
                    ) : product.variants && product.variants.length > 0 && product.variants[0].images?.length > 0 ? (
                        <Image
                            src={product.variants[0].images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <span className="text-gray-300 text-xs">No image</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start">

                        {product.original_price && Number(product.original_price) > Number(product.price) && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded ml-2">
                                {calculateDiscount(Number(product.original_price), Number(product.price))}% OFF
                            </span>
                        )}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsWishlisted(!isWishlisted);
                            }}
                            className="ml-auto bg-white/90 p-1.5 rounded-full hover:bg-white transition-colors"
                        >
                            <Heart
                                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                        </button>
                    </div>

                </div>

                {/* Content */}
                <div className="space-y-1 px-4 pb-4 pt-2">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                        {product.brand}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {product.name}
                    </h3>

                    {/* Variant Colors line */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            {product.variants.slice(0, 4).map((v) => (
                                <div key={v.color} className="w-3 h-3 rounded-full border border-gray-200 overflow-hidden relative" title={v.color}>
                                    <Image src={v.images?.[0] || '/placeholder.png'} alt={v.color} fill className="object-cover" />
                                </div>
                            ))}
                            {product.variants.length > 4 && (
                                <span className="text-[10px] text-gray-400 pl-1">+{product.variants.length - 4}</span>
                            )}
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            {product.original_price && Number(product.original_price) > Number(product.price) ? (
                                <div className="flex items-center space-x-2">
                                    <p className="text-base font-bold text-foreground">
                                        {formatPrice(product.price)}
                                    </p>
                                    <p className="text-xs text-gray-400 line-through">
                                        {formatPrice(product.original_price)}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-base font-bold text-[#305752]">
                                    {formatPrice(product.price)}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="w-full mt-3 bg-white hover:bg-[#305752] text-[#305752] hover:text-white border border-[#305752] font-semibold py-2 rounded-xl transition-all shadow-sm text-sm"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
}
