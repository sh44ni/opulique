'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slider } from '@/types';

interface HeroSliderProps {
    sliders: Slider[];
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (sliders.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sliders.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [sliders.length]);

    if (sliders.length === 0) {
        return null;
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % sliders.length);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-2">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
                {/* Slides */}
                {sliders.map((slider, index) => (
                    <Link
                        key={slider.id}
                        href={slider.cta_link || '#'}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div className="relative w-full h-full">
                            {slider.image_url ? (
                                <Image
                                    src={slider.image_url}
                                    alt="Banner"
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">No Image</span>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}

                {/* Navigation Arrows */}
                {sliders.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Dots */}
                {sliders.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {sliders.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
