import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { getProductBySlug, getProducts } from '@/lib/db/queries';
import ProductCard from '@/components/storefront/ProductCard';
import ProductDetailClient from '@/components/storefront/ProductDetailClient';

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const similarProducts = await getProducts({ brand: product.brand, limit: 4 });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProductDetailClient product={product} />

            {/* Similar Products */}
            {similarProducts.length > 1 && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {similarProducts.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
