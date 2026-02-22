'use client';

import { useEffect, useState, use } from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Package, Truck, Save, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface OrderItem {
    id: string; // product id
    name: string;
    price: number;
    quantity: number;
    size?: string;
    image?: string;
}

interface OrderDetails {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    payment_method: string;
    subtotal: string;
    delivery_fee: string;
    discount: string;
    total: string;
    status: string;
    tracking_number: string | null;
    courier_name: string | null;
    items: OrderItem[];
    payment_proof: string | null;
    created_at: string;
    notes?: string;
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

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [status, setStatus] = useState('');
    const [courierName, setCourierName] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setOrder(data);
            setStatus(data.status);
            setCourierName(data.courier_name || '');
            setTrackingNumber(data.tracking_number || '');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    courier_name: courierName,
                    tracking_number: trackingNumber,
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setOrder(updated);
                alert('Order updated successfully!');
            } else {
                alert('Failed to update order');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating order');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            Order #{order.order_number}
                            <span className={`text-sm px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'} capitalize`}>
                                {order.status}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500">
                            Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#305752] text-white px-6 py-2.5 rounded-lg hover:bg-[#305752]/90 disabled:opacity-50 transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items & Payment */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Package className="w-4 h-4 text-gray-500" />
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, index) => (
                                <div key={index} className="p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-200">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50/50 p-6 space-y-2 text-sm border-t border-gray-100">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(Number(order.subtotal))}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>{formatPrice(Number(order.delivery_fee))}</span>
                            </div>
                            {Number(order.discount) > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatPrice(Number(order.discount))}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                                <span>Total</span>
                                <span>{formatPrice(Number(order.total))}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer, Delivery, Actions */}
                <div className="space-y-6">
                    {/* Management Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h2 className="font-semibold text-gray-800">Order Management</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                            >
                                {allStatuses.map(s => (
                                    <option key={s} value={s} className="capitalize">{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-gray-500" />
                                Tracking Details
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Courier Name</label>
                                    <input
                                        type="text"
                                        value={courierName}
                                        onChange={(e) => setCourierName(e.target.value)}
                                        placeholder="e.g. TCS, Leopards"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Tracking Number</label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="e.g. 123456789"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h2 className="font-semibold text-gray-800">Customer Details</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-full">
                                    <Package className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                                    <p className="text-gray-500">Customer</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-full">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 break-all">{order.customer_email || 'No email'}</p>
                                    <p className="text-gray-500">Email</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-full">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{order.customer_phone}</p>
                                    <p className="text-gray-500">Phone</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-full">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{order.shipping_address}</p>
                                    <p className="text-gray-500">{order.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-semibold text-gray-800 mb-3">Payment Information</h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-900 uppercase">{order.payment_method.replace('_', ' ')}</p>
                                <p className="text-xs text-gray-500 mt-1">Payment Method</p>
                            </div>
                            {order.payment_proof && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-800">Payment Proof</p>
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                                        <Image
                                            src={order.payment_proof}
                                            alt="Payment Proof"
                                            fill
                                            className="object-contain"
                                        />
                                        <a
                                            href={order.payment_proof}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium"
                                        >
                                            <ExternalLink className="w-5 h-5 mr-2" />
                                            View Full Size
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
