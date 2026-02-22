import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Mail, Phone, Calendar, CheckCircle, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
    const allMessages = await db.select().from(messages).orderBy(desc(messages.created_at));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-8 h-8 text-[#305752]" />
                Customer Messages
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {allMessages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No messages found.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {allMessages.map((msg) => (
                            <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{msg.subject || 'No Subject'}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                                            <span className="flex items-center gap-1">
                                                <span className="font-semibold">{msg.name}</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                <a href={`mailto:${msg.email}`} className="hover:underline hover:text-[#305752]">{msg.email}</a>
                                            </span>
                                            {msg.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    <a href={`tel:${msg.phone}`} className="hover:underline hover:text-[#305752]">{msg.phone}</a>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${msg.status === 'unread' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {msg.status.toUpperCase()}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(msg.created_at!).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap">
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
