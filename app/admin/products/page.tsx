'use client';

import { useEffect, useState } from 'react';
import { Package, Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface ProductRow {
    id: string;
    name: string;
    brand: string;
    price: string;
    status: string;
    condition_label: string;
    images: string[];
    created_at: string;
    stock: number;
    is_visible: boolean;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-600',
    sold: 'bg-blue-100 text-blue-800',
    archived: 'bg-red-100 text-red-800',
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [importing, setImporting] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter) params.set('status', statusFilter);
            params.set('page', String(page));
            params.set('limit', '20');
            const res = await fetch(`/api/admin/products?${params}`);
            const data = await res.json();
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 0);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [page, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to archive this product?')) return;
        try {
            await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleToggleVisibility = async (id: string, currentlyVisible: boolean) => {
        try {
            await fetch(`/api/admin/products/${id}/visibility`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_visible: !currentlyVisible }),
            });
            fetchProducts();
        } catch (error) {
            console.error('Visibility toggle error:', error);
        }
    };

    const handleRunImport = async () => {
        if (!confirm('Are you sure you want to run the Longchamp CSV import? This will seed new categories and variants.')) return;
        setImporting(true);
        try {
            const res = await fetch('/api/admin/import', { method: 'POST' });
            if (!res.ok) throw new Error('Import failed');
            alert('Import completed successfully!');
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Error running import');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    <p className="text-gray-500 mt-1">{total} total products</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRunImport}
                        disabled={importing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        {importing ? 'Importing...' : 'Run Import'}
                    </button>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium"
                        style={{ backgroundColor: '#305752' }}
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
                        />
                    </form>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="sold">Sold</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-16 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#305752' }}></div>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brand</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Condition</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => {
                                        const images = Array.isArray(product.images) ? product.images : [];
                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            {images[0] ? (
                                                                <img src={images[0]} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package className="w-4 h-4 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatPrice(Number(product.price))}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {product.stock === 0 ? (
                                                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Out of stock</span>
                                                    ) : (
                                                        <span className="text-gray-700 font-medium">{product.stock}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.condition_label}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[product.status] || 'bg-gray-100 text-gray-600'}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggleVisibility(product.id, product.is_visible)}
                                                            title={product.is_visible ? 'Hide from website' : 'Show on website'}
                                                            className={`p-1.5 transition-colors ${product.is_visible ? 'text-green-600 hover:text-gray-400' : 'text-gray-300 hover:text-green-600'
                                                                }`}
                                                        >
                                                            {product.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                        </button>
                                                        <Link href={`/admin/products/${product.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 text-gray-700">Previous</button>
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 text-gray-700">Next</button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-16 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mb-4">Add your first product to get started.</p>
                        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#305752' }}>
                            <Plus className="w-4 h-4" /> Add Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
