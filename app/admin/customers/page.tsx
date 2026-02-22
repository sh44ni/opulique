'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CustomerRow {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    city: string;
    total_orders: number;
    total_spent: string;
    created_at: string;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<CustomerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            params.set('page', String(page));
            const res = await fetch(`/api/admin/customers?${params}`);
            const data = await res.json();
            setCustomers(data.customers || []);
            setTotalPages(data.totalPages || 0);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchCustomers();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete customer "${name}"? This cannot be undone.`)) return;
        try {
            await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
            fetchCustomers();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
                <p className="text-gray-500 mt-1">{total} total customers</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <form onSubmit={handleSearch} className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900" />
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-16 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#305752' }}></div></div>
                ) : customers.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Orders</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {customers.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{c.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{c.phone}</div>
                                                {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{c.city}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{c.total_orders}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatPrice(Number(c.total_spent))}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(c.id, c.name)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete customer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 text-gray-700">Previous</button>
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 text-gray-700">Next</button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-16 text-center text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">No customers found</p>
                        <p className="text-sm">Customer records will appear here as orders are placed.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
