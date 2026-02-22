'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface OrderDetails {
    order_number: string;
    status: string;
    created_at: string;
    items: any[];
    subtotal: string;
    delivery_fee: string;
    discount: string;
    total: string;
    tracking_number: string | null;
    courier_name: string | null;
    shipping_address: string;
    city: string;
    payment_method: string;
}

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setError('');
        setOrder(null);

        try {
            const res = await fetch('/api/storefront/track-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber, phone }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to find order');
            }

            const data = await res.json();
            setOrder(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSearching(false);
        }
    };

    const statusSteps = [
        { key: 'pending', label: 'Pending', icon: Package },
        { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
        { key: 'shipped', label: 'Shipped', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const getStatusIndex = (status: string) => {
        // Map simplified statuses if needed
        if (status === 'processing') return 1; // Treat as confirmed/processing
        const index = statusSteps.findIndex(step => step.key === status);
        return index === -1 ? 0 : index;
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Track Your Order</h1>
            <p className="text-gray-500 text-center mb-8">Enter your details to see current status and delivery info.</p>

            {/* Search Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order Number
                            </label>
                            <input
                                type="text"
                                required
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                placeholder="E.g. #ORD-12345"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="E.g. 03001234567"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="w-full bg-[#305752] text-white font-bold py-3 rounded-lg hover:bg-[#305752]/90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isSearching ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Searching...
                            </>
                        ) : (
                            'Track Order'
                        )}
                    </button>
                </form>
            </div>

            {/* Order Details Result */}
            {order && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Status Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Order #{order.order_number}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative px-4">
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon;
                                const currentIndex = getStatusIndex(order.status);
                                const isCompleted = index <= currentIndex;

                                return (
                                    <div key={step.key} className="flex items-start mb-8 last:mb-0 relative z-10">
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted
                                                ? 'bg-[#305752] border-[#305752] text-white'
                                                : 'bg-white border-gray-300 text-gray-300'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        <div className="ml-4 pt-2">
                                            <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </p>
                                        </div>

                                        {/* Line */}
                                        {index < statusSteps.length - 1 && (
                                            <div
                                                className={`absolute left-5 top-10 w-0.5 h-full -z-10 ${index < currentIndex ? 'bg-[#305752]' : 'bg-gray-200'
                                                    }`}
                                                style={{ height: 'calc(100% - 10px)' }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tracking Info (if available) */}
                    {(order.tracking_number || order.courier_name) && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
                                <Truck className="w-5 h-5" />
                                Shipment Tracking
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-blue-700/70 mb-1">Courier Service</p>
                                    <p className="font-medium text-blue-900">{order.courier_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-blue-700/70 mb-1">Tracking Number</p>
                                    <p className="font-medium text-blue-900 font-mono text-lg">{order.tracking_number || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Items
                            </h3>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item: any, i: number) => {
                                    const name = item.name || item.product?.name || 'Unknown Product';
                                    const price = item.price || item.product?.price || 0;
                                    const image = item.image || item.product?.images?.[0] || null;
                                    const size = item.size;
                                    const quantity = item.quantity;

                                    return (
                                        <div key={i} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0 border border-gray-200">
                                                {image ? (
                                                    <Image src={image} alt={name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{name}</p>
                                                <p className="text-sm text-gray-500">Size: {size} × {quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{formatPrice(Number(price) * Number(quantity))}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery</span>
                                    <span>{formatPrice(order.delivery_fee)}</span>
                                </div>
                                {Number(order.discount) > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatPrice(order.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200 mt-2">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Delivery Address
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {order.shipping_address}<br />
                                    {order.city}
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payment Method
                                </h3>
                                <p className="text-sm text-gray-600 uppercase font-medium">
                                    {order.payment_method}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
