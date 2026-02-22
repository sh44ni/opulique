'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
}

interface RecentOrder {
    id: string;
    order_number: string;
    customer_name: string;
    total: string;
    status: string;
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

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.stats) setStats(data.stats);
                if (data.recentOrders) setRecentOrders(data.recentOrders);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Products', value: stats.totalProducts, icon: Package, color: '#305752', link: '/admin/products' },
        { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: '#2563eb', link: '/admin/orders' },
        { title: 'Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: '#DCAA2D', link: '/admin/orders' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: '#ea580c', link: '/admin/orders' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#305752' }}></div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={card.title}
                                    href={card.link}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                        </div>
                                        <div className="p-3 rounded-xl" style={{ backgroundColor: card.color + '15' }}>
                                            <Icon className="w-6 h-6" style={{ color: card.color }} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                            <Link href="/admin/orders" className="text-sm font-medium" style={{ color: '#305752' }}>
                                View All →
                            </Link>
                        </div>
                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">#{order.order_number}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatPrice(Number(order.total))}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center text-gray-400">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-lg font-medium">No orders yet</p>
                                <p className="text-sm">Orders will appear here when customers make purchases.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/admin/products" className="p-4 border-2 rounded-xl hover:text-white transition-colors text-center font-semibold" style={{ borderColor: '#305752', color: '#305752' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#305752'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#305752'; }}
                            >
                                Manage Products
                            </Link>
                            <Link href="/admin/orders" className="p-4 border-2 rounded-xl hover:text-white transition-colors text-center font-semibold" style={{ borderColor: '#305752', color: '#305752' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#305752'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#305752'; }}
                            >
                                View Orders
                            </Link>
                            <Link href="/admin/sliders" className="p-4 border-2 rounded-xl hover:text-white transition-colors text-center font-semibold" style={{ borderColor: '#305752', color: '#305752' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#305752'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#305752'; }}
                            >
                                Manage Sliders
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
