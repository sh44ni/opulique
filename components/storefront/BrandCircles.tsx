'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const brands = [
    { name: 'New Balance', slug: 'new-balance', iconSlug: 'newbalance' },
    { name: 'Adidas', slug: 'adidas', iconSlug: 'adidas' },
    { name: 'Skechers', slug: 'skechers', iconSlug: 'skechers' },
    { name: 'Puma', slug: 'puma', iconSlug: 'puma' },
    { name: 'Nike', slug: 'nike', iconSlug: 'nike' },
    { name: 'Under Armour', slug: 'under-armour', iconSlug: 'underarmour' },
];

export default function BrandCircles() {
    // Embla Carousel with Autoplay
    // stopOnInteraction: false keeps it scrolling even after swipe
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        dragFree: true // Allows smooth free scrolling
    }, [
        AutoScroll({ delay: 3000, stopOnInteraction: false, rootNode: (emblaRoot) => emblaRoot.parentElement })
    ]);

    return (
        <div className="pt-6 pb-4 bg-[#F6F9F8] relative border-t border-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Shop by Brand</h2>
                    <div className="h-1 w-20 bg-[#305752] mx-auto rounded-full"></div>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden cursor-grab active:cursor-grabbing mask-gradient" ref={emblaRef}>
                    <div className="flex touch-pan-y -ml-4">
                        {/* Duplicate brands to ensure smooth infinite loop even on large screens */}
                        {[...brands, ...brands, ...brands].map((brand, index) => (
                            <div
                                key={`${brand.slug}-${index}`}
                                className="flex-[0_0_28%] sm:flex-[0_0_18%] md:flex-[0_0_14%] lg:flex-[0_0_10%] min-w-0 pl-4"
                            >
                                <Link
                                    href={`/shop?brand=${brand.slug}`}
                                    className="flex flex-col items-center group select-none"
                                >
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center p-5 transition-all duration-300 group-hover:border-[#305752] group-hover:shadow-md group-hover:-translate-y-1">
                                        <img
                                            src={`/brands/${brand.slug}.svg?v=2`}
                                            alt={brand.name}
                                            className="w-12 h-12 md:w-14 md:h-14 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                    <span className="mt-3 text-sm font-medium text-gray-600 group-hover:text-[#305752] transition-colors">
                                        {brand.name}
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
