'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tag,
    Image as ImageIcon,
    Settings,
    LogOut,
    Menu,
    X,
    MessageSquare,
    Star,
    Layers,
} from 'lucide-react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/brands', label: 'Brands', icon: Layers },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/vouchers', label: 'Vouchers', icon: Tag },
    { href: '/admin/sliders', label: 'Sliders', icon: ImageIcon },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/admin/session');
            const data = await response.json();

            if (!data.authenticated && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            if (pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    if (pathname === '/admin/login') {
        return children;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar text-white rounded-lg"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-60 bg-sidebar text-white transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="px-5 py-5 border-b border-gray-700">
                        <Link href="/admin">
                            <Image
                                src="/logo-footer.svg"
                                alt="Opulique"
                                width={148}
                                height={34}
                                priority
                            />
                        </Link>
                        <span className="block text-xs text-gray-400 mt-1 pl-0.5">Admin Panel</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-60 p-4 lg:p-8">
                {children}
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
