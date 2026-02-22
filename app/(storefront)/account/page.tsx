'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Order {
    id: string;
    order_number: string;
    total: string;
    status: string;
    created_at: string;
    items: any[];
}

export default function AccountPage() {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                // 1. Check Session
                const sessionRes = await fetch('/api/auth/session');
                const sessionData = await sessionRes.json();

                if (!sessionData.authenticated) {
                    router.push('/login?redirect=/account');
                    return;
                }

                setUser(sessionData.user);

                // 2. Fetch Orders
                const ordersRes = await fetch('/api/orders');
                const ordersData = await ordersRes.json();

                if (ordersRes.ok) {
                    setOrders(ordersData.orders);
                }
            } catch (error) {
                console.error('Failed to load account data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null; // Redirecting

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gray-100 p-3 rounded-full">
                                <User className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium py-2 rounded-md hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Main Content (Orders) */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Package className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-foreground">Order History</h2>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                                <Link
                                    href="/shop"
                                    className="inline-block bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <p className="font-semibold text-foreground">Order #{order.order_number}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex flex-col md:items-end gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                    <p className="font-bold text-foreground">{formatPrice(parseFloat(order.total))}</p>
                                                </div>
                                                <Link
                                                    href={`/account/orders/${order.id}`}
                                                    className="text-sm text-[#305752] hover:underline font-medium"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
