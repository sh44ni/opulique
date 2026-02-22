import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';

const badges = [
    {
        icon: Truck,
        title: 'Free Delivery',
        subtitle: 'On orders above OMR 50.000',
        color: 'text-[#305752]',
        bg: 'bg-[#305752]/8',
    },
    {
        icon: ShieldCheck,
        title: '100% Authentic',
        subtitle: 'Every bag personally verified',
        color: 'text-[#305752]',
        bg: 'bg-[#305752]/8',
    },
    {
        icon: RotateCcw,
        title: 'Hassle-Free Returns',
        subtitle: '3-day return window, no drama',
        color: 'text-[#305752]',
        bg: 'bg-[#305752]/8',
    },
];

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100 rounded-2xl mt-8 overflow-hidden">
            {badges.map(({ icon: Icon, title, subtitle, color, bg }) => (
                <div
                    key={title}
                    className="flex items-center gap-3 px-6 py-5 bg-white hover:bg-gray-50/70 transition-colors duration-150"
                >
                    <div className={`shrink-0 p-2.5 rounded-xl ${bg}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
