'use client';

import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, Footprints } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getSubtotal } = useCart();
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedVoucher, setAppliedVoucher] = useState('');
    const [voucherError, setVoucherError] = useState('');
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);

    useEffect(() => {
        fetch('/api/settings?key=delivery_fee')
            .then(res => res.json())
            .then(data => {
                if (data && data.fee !== undefined) {
                    setDeliveryFee(Number(data.fee));
                }
            })
            .catch(err => console.error('Failed to fetch delivery fee', err));
    }, []);

    const subtotal = getSubtotal();
    const total = subtotal + deliveryFee - discount;

    const handleApplyVoucher = async () => {
        setVoucherError('');
        setIsApplyingVoucher(true);
        try {
            const res = await fetch('/api/vouchers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: voucherCode, subtotal }),
            });
            const data = await res.json();

            if (data.valid) {
                setDiscount(data.discount);
                setAppliedVoucher(data.code);
                setVoucherCode(data.code); // Normalize case
            } else {
                setDiscount(0);
                setAppliedVoucher('');
                setVoucherError(data.error || 'Invalid voucher');
            }
        } catch (error) {
            console.error('Voucher check error:', error);
            setVoucherError('Failed to apply voucher');
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Add some products to get started!</p>
                <Link
                    href="/shop"
                    className="inline-block bg-secondary text-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={`${item.product.id}-${item.color}`}
                            className="bg-white border border-gray-200 rounded-lg p-4 flex gap-3 sm:gap-4"
                        >
                            {/* Image */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                {(() => {
                                    const variant = item.product.variants?.find(v => v.color === item.color);
                                    const imageSrc = variant?.images?.[0] || item.product.images?.[0] || '/placeholder.png';
                                    return (
                                        <Image
                                            src={imageSrc}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    );
                                })()}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{item.product.brand}</p>
                                        <p className="text-xs sm:text-sm text-gray-600">Color: {item.color}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.product.id, item.color)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <p className="font-bold text-foreground text-sm sm:text-base">{formatPrice(item.product.price)}</p>
                                    <div className="flex items-center border border-gray-300 rounded h-8">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.color, item.quantity - 1)}
                                            className="px-2 hover:bg-gray-100 transition-colors h-full flex items-center"
                                        >
                                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.color, item.quantity + 1)}
                                            className="px-2 hover:bg-gray-100 transition-colors h-full flex items-center"
                                        >
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 sticky top-20">
                        <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

                        {/* Voucher Code */}
                        <div className="mb-4">
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Voucher Code
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    placeholder="Enter code"
                                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-gray-100"
                                    disabled={isApplyingVoucher}
                                />
                                <button
                                    onClick={handleApplyVoucher}
                                    disabled={!voucherCode || isApplyingVoucher}
                                    className="px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isApplyingVoucher ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Applying...</span>
                                        </>
                                    ) : (
                                        'Apply'
                                    )}
                                </button>
                            </div>
                            {voucherError && <p className="text-xs text-red-500 mt-1">{voucherError}</p>}
                            {appliedVoucher && <p className="text-xs text-green-600 mt-1">Voucher applied!</p>}
                        </div>

                        {/* Summary */}
                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatPrice(discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-bold text-foreground border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={() => {
                                window.location.href = `/checkout${appliedVoucher ? `?voucher=${appliedVoucher}` : ''}`;
                            }}
                            className="block w-full mt-6 bg-secondary text-foreground font-bold py-3 rounded-lg text-center hover:bg-secondary/90 transition-colors"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
