'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Home, Store, User, LogOut } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { getItemCount } = useCart();
    const itemCount = getItemCount();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            if (data.authenticated) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed', error);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
        router.refresh();
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="sticky top-0 z-50 bg-background border-b border-[#305752]/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center md:justify-between h-16 relative">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.svg"
                                alt="Opulique"
                                width={100}
                                height={28}
                                className="h-7 w-auto"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                Home
                            </Link>
                            <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                Shop
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                About
                            </Link>
                            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                Contact
                            </Link>
                        </div>

                        {/* Right Icons */}
                        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 md:static md:pr-0 md:space-x-4">
                            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Search className="w-5 h-5 text-foreground" />
                            </button>

                            {/* User Account / Login */}
                            <div className="hidden md:flex items-center">
                                {user ? (
                                    <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2">
                                        <User className="w-5 h-5 text-foreground" />
                                        <span className="text-xs font-medium max-w-[100px] truncate">{user.name}</span>
                                    </Link>
                                ) : (
                                    <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1">
                                        <User className="w-5 h-5 text-foreground" />
                                        <span className="text-sm font-medium">Login</span>
                                    </Link>
                                )}
                            </div>

                            <Link href="/cart" className="hidden md:block relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ShoppingCart className="w-5 h-5 text-foreground" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-secondary text-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                className="hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-[#305752]/20 bg-background">
                        <div className="px-4 py-3 space-y-3">
                            <Link
                                href="/"
                                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            <Link
                                href="/about"
                                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            {!user && (
                                <Link
                                    href="/login"
                                    className="block py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login / Sign Up
                                </Link>
                            )}
                            {user && (
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="block w-full text-left py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Logout ({user.name})
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-[#305752]/20">
                <div className="grid grid-cols-4 h-16">
                    <Link href="/" className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors">
                        <Home className="w-5 h-5 text-foreground" />
                        <span className="text-xs text-foreground">Home</span>
                    </Link>
                    <Link href="/shop" className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors">
                        <Store className="w-5 h-5 text-foreground" />
                        <span className="text-xs text-foreground">Shop</span>
                    </Link>
                    <Link href="/cart" className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors relative">
                        <ShoppingCart className="w-5 h-5 text-foreground" />
                        {itemCount > 0 && (
                            <span className="absolute top-2 right-1/4 bg-secondary text-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {itemCount > 9 ? '9+' : itemCount}
                            </span>
                        )}
                        <span className="text-xs text-foreground">Cart</span>
                    </Link>
                    {user ? (
                        <Link href="/account" className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors">
                            <User className="w-5 h-5 text-foreground" />
                            <span className="text-xs text-foreground">Account</span>
                        </Link>
                    ) : (
                        <Link href="/login" className="flex flex-col items-center justify-center space-y-1 hover:bg-gray-50 transition-colors">
                            <User className="w-5 h-5 text-foreground" />
                            <span className="text-xs text-foreground">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
