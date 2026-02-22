import { getProducts } from '@/lib/db/queries';
import { Product } from '@/types';
import ProductCard from '@/components/storefront/ProductCard';
import { ChevronDown } from 'lucide-react';

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ brand?: string; gender?: string; condition?: string; sort?: string }>;
}) {
    const params = await searchParams;
    const products = await getProducts(params);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Shop All Products</h1>

            {/* TODO: Add filters sidebar/drawer */}
            {/* TODO: Add active filter pills */}
            {/* TODO: Add sort dropdown */}

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center">
                        {params.brand ? (
                            <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Hold Your Horses! <br />
                                    <span className="text-[#305752] capitalize">{params.brand}</span> is Coming Soon.
                                </h2>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    We're currently stocking up on the freshest kicks from {params.brand}.
                                    Check back in a few days for the drop!
                                </p>
                                <div className="pt-4">
                                    <a
                                        href="/shop"
                                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#305752] hover:bg-[#1e3a2d] rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Explore Other Brands
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No products found.</p>
                                <a href="/shop" className="text-[#305752] font-medium hover:underline mt-2 inline-block">Clear Filters</a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* TODO: Add load more button */}
        </div>
    );
}
