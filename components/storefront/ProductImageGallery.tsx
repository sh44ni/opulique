'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0] || '/placeholder.png');

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
                <Image
                    src="/placeholder.png"
                    alt={productName}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
                <Image
                    src={mainImage}
                    alt={productName}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={cn(
                                "aspect-square relative rounded-lg overflow-hidden border-2 transition-all",
                                mainImage === img ? "border-[#305752] ring-2 ring-[#305752]/20" : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${productName} view ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
