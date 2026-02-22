'use client';
import { useEffect, useState } from 'react';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

interface VoucherRow { id: string; code: string; discount_type: string; discount_value: string; min_order_amount: string; max_uses: number; used_count: number; is_active: boolean; expires_at: string | null; }

export default function AdminVouchersPage() {
    const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '0', max_uses: 0, is_active: true, expires_at: '' });

    const load = async () => { const r = await fetch('/api/admin/vouchers'); setVouchers(await r.json()); setLoading(false); };
    useEffect(() => { load(); }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = { ...form, expires_at: form.expires_at || null };
        try {
            const res = editId
                ? await fetch(`/api/admin/vouchers/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                : await fetch('/api/admin/vouchers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save voucher');
            }

            setShowForm(false);
            setEditId(null);
            load();
        } catch (error: any) {
            console.error('Save error:', error);
            alert(error.message || 'An error occurred while saving.');
        }
    };

    const edit = (v: VoucherRow) => { setEditId(v.id); setForm({ code: v.code, discount_type: v.discount_type, discount_value: v.discount_value, min_order_amount: v.min_order_amount, max_uses: v.max_uses, is_active: v.is_active, expires_at: v.expires_at?.slice(0, 10) || '' }); setShowForm(true); };
    const del = async (id: string) => { if (!confirm('Delete?')) return; await fetch(`/api/admin/vouchers/${id}`, { method: 'DELETE' }); load(); };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Vouchers</h1>
                <button onClick={() => { setShowForm(true); setEditId(null); setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '0', max_uses: 0, is_active: true, expires_at: '' }); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium" style={{ backgroundColor: '#305752' }}><Plus className="w-4 h-4" /> Add Voucher</button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{editId ? 'Edit' : 'Create'} Voucher</h2>
                    <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input required placeholder="CODE" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900">
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                            <input required type="number" step="0.01" placeholder="0.00" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                            <input type="number" step="0.01" placeholder="0.00" value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (0 for unlimited)</label>
                            <input type="number" placeholder="0" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: +e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                            <input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900" />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2 mt-2">
                            <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 text-[#305752] border-gray-300 rounded focus:ring-[#305752]" />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 select-none cursor-pointer">Active</label>
                        </div>
                        <div className="flex gap-3 mt-4 md:col-span-2">
                            <button type="submit" className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#305752' }}>{editId ? 'Update Voucher' : 'Create Voucher'}</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="py-16 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#305752' }}></div></div>
                    : vouchers.length > 0 ? (
                        <table className="w-full"><thead className="bg-gray-50"><tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr></thead><tbody className="divide-y divide-gray-100">
                                {vouchers.map(v => <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-bold text-sm text-gray-800">{v.code}</td>
                                    <td className="px-6 py-4 text-sm">{v.discount_type === 'percentage' ? `${v.discount_value}%` : `OMR ${v.discount_value}`}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{v.used_count}/{v.max_uses || '∞'}</td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${v.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v.is_active ? 'Active' : 'Off'}</span></td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => edit(v)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button><button onClick={() => del(v.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                                </tr>)}
                            </tbody></table>
                    ) : <div className="py-16 text-center text-gray-400"><Tag className="w-12 h-12 mx-auto mb-3 opacity-50" /><p className="text-lg font-medium">No vouchers yet</p></div>}
            </div>
        </div>
    );
}
