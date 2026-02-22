'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addItem } = useCart();
    const router = useRouter();

    const [selectedColor, setSelectedColor] = useState<string>(
        product.variants && product.variants.length > 0 ? product.variants[0].color : ''
    );

    const [mainImage, setMainImage] = useState<string>(
        product.variants && product.variants.length > 0 && product.variants[0].images?.length > 0
            ? product.variants[0].images[0]
            : (product.images?.[0] || '/placeholder.png')
    );

    const currentVariant = product.variants?.find(v => v.color === selectedColor);
    const galleryImages = currentVariant?.images?.length ? currentVariant.images : (product.images || []);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        const variant = product.variants?.find(v => v.color === color);
        if (variant && variant.images && variant.images.length > 0) {
            setMainImage(variant.images[0]);
        }
    };

    const handleAddToCart = () => {
        if (product.variants && product.variants.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        const colorToAdd = selectedColor || 'Standard';
        addItem(product, colorToAdd, 1);

        toast.success('Added to Cart', {
            description: `${product.name} (${colorToAdd}) has been added to your cart.`
        });
    };

    const handleBuyNow = () => {
        if (product.variants && product.variants.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        const colorToAdd = selectedColor || 'Standard';
        addItem(product, colorToAdd, 1);
        router.push('/cart');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Left Column: Images */}
            <div>
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-transparent mix-blend-multiply rounded-2xl overflow-hidden relative p-4 mb-4">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Thumbnails */}
                    {galleryImages.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={cn(
                                        "aspect-square relative rounded-lg overflow-hidden border-2 transition-all p-1 bg-transparent mix-blend-multiply",
                                        mainImage === img ? "border-[#305752]" : "border-transparent hover:border-white"
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} view ${idx + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="space-y-6">
                <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide mb-1">
                        {product.brand}
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                    {/* Price row */}
                    <div className="flex items-center gap-3 flex-wrap bg-white/40 px-5 py-3 rounded-2xl inline-block mt-2">
                        {product.original_price && Number(product.original_price) > Number(product.price) ? (
                            <>
                                <p className="text-3xl font-bold text-[#305752]">
                                    {formatPrice(product.price)}
                                </p>
                                <p className="text-xl text-gray-400 line-through">
                                    {formatPrice(product.original_price)}
                                </p>
                                {/* % OFF Tag */}
                                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                    ⚡ {calculateDiscount(product.original_price, product.price)}% OFF
                                </span>
                            </>
                        ) : (
                            <p className="text-3xl font-bold text-[#305752]">
                                {formatPrice(product.price)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Color Selection */}
                {product.variants && product.variants.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="mb-3">
                            <span className="text-sm font-semibold text-gray-900">Color: </span>
                            <span className="text-sm text-gray-600 font-medium">{selectedColor}</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant) => {
                                const variantFirstImg = variant.images?.[0] || product.images?.[0] || '/placeholder.png';
                                const isSelected = selectedColor === variant.color;
                                return (
                                    <button
                                        key={variant.color}
                                        onClick={() => handleColorSelect(variant.color)}
                                        title={variant.color}
                                        className={cn(
                                            "relative w-16 h-16 rounded-xl border-2 p-1 transition-all outline-none bg-white/40",
                                            isSelected ? "border-[#305752] shadow-md scale-105" : "border-transparent hover:border-white hover:scale-105 shadow-sm"
                                        )}
                                    >
                                        <div className="w-full h-full rounded-lg overflow-hidden relative bg-transparent mix-blend-multiply">
                                            <Image
                                                src={variantFirstImg}
                                                alt={variant.color}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SKU / Category */}
                <div className="flex gap-6 text-sm text-gray-500 pt-2 pb-2">
                    {product.sku && (
                        <div><span className="font-semibold text-gray-700">SKU:</span> {product.sku}</div>
                    )}
                    {product.category && (
                        <div><span className="font-semibold text-gray-700">Category:</span> {product.category}</div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-[#305752] text-white font-bold py-4 rounded-xl hover:bg-[#254641] transition-all active:scale-[0.98] shadow-md uppercase tracking-wider"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="w-full border-2 border-[#305752] text-[#305752] font-bold py-4 rounded-xl hover:bg-[#305752] hover:text-white transition-all active:scale-[0.98] shadow-sm uppercase tracking-wider"
                    >
                        Buy Now
                    </button>
                </div>



                {/* Description */}
                <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Product Description</h3>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {product.description}
                    </div>
                </div>

                {/* Stock Urgency Indicator */}
                {product.stock !== undefined && product.stock <= 5 && (
                    <div className="pt-4">
                        {product.stock === 0 ? (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                <span className="text-lg">😔</span>
                                <div>
                                    <p className="text-sm font-bold text-red-700">Out of Stock</p>
                                    <p className="text-xs text-red-500">This item is currently unavailable</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 relative overflow-hidden">
                                {/* Pulse ring */}
                                <span className="relative flex h-3 w-3 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-amber-800 leading-tight">
                                        Only {product.stock} left in stock🔥
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
