import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import WhatsAppWidget from '@/components/storefront/WhatsAppWidget';

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>

            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <WhatsAppWidget />
        </>
    );
}
