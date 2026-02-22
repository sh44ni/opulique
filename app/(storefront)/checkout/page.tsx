'use client';

import { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Loader2, Upload, X, CheckCircle, Copy, Check, Lock } from 'lucide-react';
import Image from 'next/image';

const omanCities = [
    'Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur',
    'Seeb', 'Rustaq', 'Ibri', 'Khasab', 'Barka', 'Other'
];

function CheckoutContent() {
    const { items, getSubtotal, clearCart, isLoaded } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const voucherFromUrl = searchParams.get('voucher');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [voucherCode, setVoucherCode] = useState(voucherFromUrl || '');
    const [discount, setDiscount] = useState(0);
    const [bankDetails, setBankDetails] = useState<any>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [proofUrl, setProofUrl] = useState('');
    const [uploadingProof, setUploadingProof] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isEmailLocked, setIsEmailLocked] = useState(false);
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

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated && data.user?.email) {
                    setFormData(prev => ({ ...prev, email: data.user.email }));
                    setIsEmailLocked(true);
                }
            })
            .catch(err => console.error('Auth check failed', err));
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'bank_transfer',
    });

    const subtotal = getSubtotal();

    // Validate voucher on load
    useEffect(() => {
        if (voucherFromUrl) {
            fetch('/api/vouchers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: voucherFromUrl, subtotal }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.valid) {
                        setDiscount(data.discount);
                    }
                })
                .catch(err => console.error('Voucher calc error', err));
        }
    }, [voucherFromUrl, subtotal]);

    // Fetch Bank Details
    useEffect(() => {
        fetch('/api/settings?key=bank_details')
            .then(res => res.json())
            .then(data => setBankDetails(data))
            .catch(err => console.error('Failed to fetch bank details', err));
    }, []);

    const total = subtotal + deliveryFee - discount;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            alert('Only JPG and PNG images are allowed.');
            return;
        }

        if (file.size > 1 * 1024 * 1024) { // 1MB
            alert('File size must be under 1MB.');
            return;
        }

        setPaymentProof(file);
        setUploadingProof(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setProofUrl(data.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload proof. Please try again.');
            setPaymentProof(null);
        } finally {
            setUploadingProof(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Phone number validation
        const cleanedPhone = formData.phone.replace(/[^0-9+]/g, '');
        if (cleanedPhone.length < 8) {
            alert('Please enter a valid phone number with at least 8 digits.');
            return;
        }

        if (formData.paymentMethod === 'bank_transfer' && !proofUrl) {
            alert('Please upload a screenshot of your payment proof.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    paymentMethod: formData.paymentMethod,
                    items,
                    subtotal,
                    deliveryFee,
                    discount,
                    voucherCode: voucherCode || null,
                    total,
                    paymentProofUrl: proofUrl || null,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit order');
            }

            const data = await res.json();
            clearCart();
            router.push(`/order-confirmation?order=${data.orderNumber}`);
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (items.length === 0) {
        // We use useEffect for redirection to avoid side effects during rendering
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+92 300 1234567"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => !isEmailLocked && setFormData({ ...formData, email: e.target.value })}
                                    readOnly={isEmailLocked}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary ${isEmailLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                                />
                                {isEmailLocked && (
                                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Shipping Address *
                            </label>
                            <textarea
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                City *
                            </label>
                            <select
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select City</option>
                                {omanCities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>
                    <div className="space-y-3">
                        {[
                            { value: 'bank_transfer', label: 'Bank Transfer' },
                        ].map((method) => (
                            <div key={method.value}>
                                <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-colors ${formData.paymentMethod === method.value
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.value}
                                        checked={formData.paymentMethod === method.value}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span className={`font-medium text-foreground`}>
                                        {method.label}
                                    </span>
                                </label>

                                {/* Bank Details & Upload Section */}
                                {method.value === 'bank_transfer' && formData.paymentMethod === 'bank_transfer' && (
                                    <div className="ml-7 mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-in slide-in-from-top-2">
                                        {bankDetails ? (
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <p className="font-semibold text-gray-900">Bank Details:</p>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                    <span className="text-gray-500">Bank Name:</span>
                                                    <span className="font-medium">{bankDetails.bankName}</span>

                                                    <span className="text-gray-500">Account Title:</span>
                                                    <span className="font-medium">{bankDetails.accountTitle}</span>

                                                    <span className="text-gray-500">Account No:</span>
                                                    <div className="flex items-center gap-2 max-w-full overflow-hidden">
                                                        <span className="font-medium break-all">{bankDetails.accountNumber}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(bankDetails.accountNumber)}
                                                            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 flex-shrink-0"
                                                            title="Copy Account Number"
                                                        >
                                                            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>

                                                    {bankDetails.iban && (
                                                        <>
                                                            <span className="text-gray-500">Mobile Payment number:</span>
                                                            <span className="font-medium break-all">{bankDetails.iban}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {bankDetails.instructions && (
                                                    <p className="mt-2 text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-100">
                                                        Note: {bankDetails.instructions}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Loading bank details...
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Upload Payment Proof *
                                                <span className="block text-xs font-normal text-gray-500 mt-0.5">
                                                    Upload screenshot (JPG/PNG, max 1MB)
                                                </span>
                                            </label>

                                            {!proofUrl ? (
                                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-white transition-colors relative cursor-pointer group">
                                                    <div className="space-y-1 text-center">
                                                        {uploadingProof ? (
                                                            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                                                        ) : (
                                                            <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500" />
                                                        )}
                                                        <div className="flex text-sm text-gray-600 justify-center">
                                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    id="file-upload"
                                                                    name="file-upload"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept="image/png, image/jpeg, image/jpg"
                                                                    onChange={handleFileUpload}
                                                                    disabled={uploadingProof}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative mt-2 p-2 bg-white border border-green-200 rounded-lg flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-green-50 rounded flex items-center justify-center text-green-600">
                                                            <CheckCircle className="w-6 h-6" />
                                                        </div>
                                                        <div className="text-sm">
                                                            <p className="font-medium text-green-900">Proof Uploaded</p>
                                                            <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs">View Image</a>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProofUrl('');
                                                            setPaymentProof(null);
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal ({items.length} items)</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span className="flex items-center gap-2">
                                <span className="text-[#305752] font-bold">
                                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                                </span>
                            </span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount {voucherCode && `(${voucherCode})`}</span>
                                <span>-{formatPrice(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold text-foreground border-t border-gray-200 pt-2">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || (formData.paymentMethod === 'bank_transfer' && !proofUrl)}
                    className="w-full bg-secondary text-foreground font-semibold py-4 rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}

export default function CheckoutPage() {
    const { items, isLoaded } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && items.length === 0) {
            router.push('/cart');
        }
    }, [items, isLoaded, router]);

    return (
        <Suspense fallback={
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Loading Checkout...</h2>
                <p className="text-gray-500 mt-2">Please wait while we prepare your order.</p>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
