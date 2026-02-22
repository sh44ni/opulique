'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { Loader2, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/admin/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Error</h2>
                <p className="text-gray-500">{error || 'Product not found'}</p>
            </div>
        );
    }

    return (
        <div>
            <ProductForm initialData={product} isEdit />
        </div>
    );
}
