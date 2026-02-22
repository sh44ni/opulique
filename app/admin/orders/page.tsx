'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface OrderRow {
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    total: string;
    status: string;
    payment_method: string;
    city: string;
    created_at: string;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
};

const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter) params.set('status', statusFilter);
            params.set('page', String(page));
            const res = await fetch(`/api/admin/orders?${params}`);
            const data = await res.json();
            setOrders(data.orders || []);
            setTotalPages(data.totalPages || 0);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [page, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchOrders();
        } catch (error) {
            console.error('Status update error:', error);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
                <p className="text-gray-500 mt-1">{total} total orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by customer name..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900" />
                    </form>
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700">
                        <option value="">All Status</option>
                        {allStatuses.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-16 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#305752' }}></div></div>
                ) : orders.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 group">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                <Link href={`/admin/orders/${order.id}`} className="text-[#305752] hover:underline flex items-center gap-2">
                                                    #{order.order_number}
                                                    <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-800">{order.customer_name}</div>
                                                <div className="text-xs text-gray-500">{order.customer_phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.city}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatPrice(Number(order.total))}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 uppercase">{order.payment_method}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                                                >
                                                    {allStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
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
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Orders will appear here when customers make purchases.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
