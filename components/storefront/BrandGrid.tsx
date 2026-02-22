import Link from 'next/link';
import Image from 'next/image';

interface Brand {
    id: string;
    name: string;
    slug: string;
    cover_image: string | null;
}

export default function BrandGrid({ brands }: { brands: Brand[] }) {
    if (!brands || brands.length === 0) return null;

    // Display up to 4 or 6 brands on desktop, maybe 2 col on mobile
    const displayBrands = brands.slice(0, 4);

    return (
        <section className="py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Shop by Brand</h2>
                        <div className="h-1 w-20 bg-[#305752] rounded-full"></div>
                    </div>
                    {brands.length > 4 && (
                        <Link href="/brands" className="hidden sm:inline-flex text-[#305752] font-semibold hover:text-[#1e3a2d] transition-colors">
                            View All Brands &rarr;
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {displayBrands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/shop?brand=${brand.slug}`}
                            className="group relative h-48 sm:h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 block"
                        >
                            {brand.cover_image ? (
                                <Image
                                    src={brand.cover_image}
                                    alt={brand.name}
                                    fill
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#305752]/5 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-[#305752]/30">{brand.name[0]}</span>
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-bold text-lg drop-shadow-md">{brand.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {brands.length > 4 && (
                    <div className="mt-8 text-center sm:hidden">
                        <Link href="/brands" className="inline-block border-2 border-[#305752] text-[#305752] font-semibold px-6 py-2 rounded-full hover:bg-[#305752] hover:text-white transition-colors">
                            View All Brands
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
