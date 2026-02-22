'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, MapPin, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface OrderDetails {
    id: string;
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

export default function AccountOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${id}`);
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                if (!res.ok) throw new Error('Failed to load order');
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, router]);

    const statusSteps = [
        { key: 'pending', label: 'Pending', icon: Package },
        { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
        { key: 'shipped', label: 'Shipped', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const getStatusIndex = (status: string) => {
        if (status === 'processing') return 1;
        const index = statusSteps.findIndex(step => step.key === status);
        return index === -1 ? 0 : index;
    };

    if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-[#305752]" /></div>;
    if (error || !order) return <div className="p-8 text-center text-red-500">{error || 'Order not found'}</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/account" className="inline-flex items-center text-sm text-gray-500 hover:text-[#305752] mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to My Account
            </Link>

            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Status Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4 pb-6 border-b border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Order #{order.order_number}
                            </h1>
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
        </div>
    );
}
