'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage('Failed to send message. Please check your internet connection.');
        }
    }

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#305752] mb-4">Get in Touch</h1>
                    <p className="text-xl text-gray-600">We'd love to hear from you. Here's how you can reach us.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 text-[#305752] rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                            <p className="text-gray-500 text-sm mb-4">Fastest response time</p>
                            <a href="https://wa.me/923132319987" target="_blank" rel="noopener noreferrer" className="text-[#305752] font-semibold hover:underline">
                                +92 313 2319987
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 text-[#305752] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                            <p className="text-gray-500 text-sm mb-4">For order inquiries</p>
                            <a href="mailto:footfits.pk@gmail.com" className="text-[#305752] font-semibold hover:underline">
                                footfits.pk@gmail.com
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 text-[#305752] rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Office</h3>
                            <p className="text-gray-500 text-sm">
                                Suite 611, Anum Estate,<br />Shahrah-e-Faisal, Karachi
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

                            {status === 'success' ? (
                                <div className="bg-green-50 text-green-800 p-8 rounded-xl text-center border border-green-100 animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-green-700 mb-6">Thanks for reaching out. We will get back to you within 24 hours.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="bg-[#305752] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1e3a2d] transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {status === 'error' && (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            <p>{errorMessage}</p>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                disabled={status === 'submitting'}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#305752] focus:ring-1 focus:ring-[#305752] outline-none transition-all bg-gray-50 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                disabled={status === 'submitting'}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#305752] focus:ring-1 focus:ring-[#305752] outline-none transition-all bg-gray-50 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                                placeholder="03XX XXXXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            disabled={status === 'submitting'}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#305752] focus:ring-1 focus:ring-[#305752] outline-none transition-all bg-gray-50 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            disabled={status === 'submitting'}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#305752] focus:ring-1 focus:ring-[#305752] outline-none transition-all bg-gray-50 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <option value="Order Inquiry">Order Inquiry</option>
                                            <option value="Return/Refund">Return/Refund</option>
                                            <option value="Product Question">Product Question</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            required
                                            disabled={status === 'submitting'}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#305752] focus:ring-1 focus:ring-[#305752] outline-none transition-all bg-gray-50 focus:bg-white block disabled:opacity-60 disabled:cursor-not-allowed"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-[#305752] text-white font-bold py-4 rounded-xl hover:bg-[#1e3a2d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {status === 'submitting' ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
