import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Banknote, CreditCard, Landmark } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-[#305752] text-white mt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20 text-center">
                    {/* Brand */}
                    <div className="space-y-2 px-4 py-3 md:py-0 flex flex-col items-center">
                        <Image
                            src="/logo-footer.svg"
                            alt="Opulique"
                            width={120}
                            height={34}
                            className="h-8 w-auto"
                        />
                        <p className="text-xs text-gray-300">
                            Premium authentic handbags from luxury brands.
                        </p>
                    </div>

                    {/* Column 2: Links */}
                    <div className="px-4 py-3 md:py-0">
                        <h3 className="text-white font-semibold mb-2 text-sm">Quick Links</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/shop" className="text-xs hover:text-white transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-xs hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-xs hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/reviews" className="text-xs hover:text-white transition-colors">
                                    Reviews
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Socials Only */}
                    <div className="px-4 py-3 md:py-0 flex flex-col items-center justify-center">
                        <h3 className="text-white font-semibold mb-2 text-sm">Follow Us</h3>
                        <div className="flex items-center space-x-4">
                            <a
                                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors p-2 bg-white/10 rounded-full"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700/50 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p className="text-gray-400">© 2026 Opulique. All rights reserved.</p>
                        <span className="hidden md:inline text-gray-700">|</span>
                        <p className="text-gray-500">
                            powered by zenixa.pk
                        </p>
                    </div>

                    {/* Payment Icons */}
                    <div className="flex items-center gap-3">
                        {/* Active: Bank Transfer */}
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 shadow-sm overflow-hidden" title="Bank Transfer (Bank Muscat)">
                            <Landmark className="w-6 h-6 text-gray-700" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
