'use client';
import { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Edit, Trash2, Layers } from 'lucide-react';

interface BrandRow { id: string; name: string; slug: string; cover_image: string | null; sort_order: number; is_active: boolean; }

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState<BrandRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', slug: '', cover_image: '', sort_order: 0, is_active: true });

    const load = async () => { const r = await fetch('/api/admin/brands'); setBrands(await r.json()); setLoading(false); };
    useEffect(() => { load(); }, []);

    // Generate slug from name
    useEffect(() => {
        if (!editId && form.name) {
            setForm(prev => ({ ...prev, slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }));
        }
    }, [form.name, editId]);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageUrl = form.cover_image;

        // Handle file upload
        const fileInput = (document.getElementById('brand-image-upload') as HTMLInputElement);
        if (fileInput?.files?.length) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            try {
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    imageUrl = data.url;
                } else {
                    console.error('Upload failed');
                    return;
                }
            } catch (err) {
                console.error('Upload error:', err);
                return;
            }
        }

        const body = {
            name: form.name,
            slug: form.slug,
            cover_image: imageUrl || null,
            sort_order: form.sort_order,
            is_active: form.is_active
        };

        let response;
        if (editId) {
            response = await fetch(`/api/admin/brands/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        } else {
            response = await fetch('/api/admin/brands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        }

        if (!response.ok) {
            const err = await response.json();
            alert(err.error || 'Failed to save brand');
            return;
        }

        setShowForm(false); setEditId(null); load();
    };

    const edit = (b: BrandRow) => { setEditId(b.id); setForm({ name: b.name, slug: b.slug, cover_image: b.cover_image || '', sort_order: b.sort_order, is_active: b.is_active }); setShowForm(true); };
    const del = async (id: string) => { if (!confirm('Delete this brand?')) return; await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' }); load(); };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Brands</h1>
                <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', slug: '', cover_image: '', sort_order: 0, is_active: true }); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium shadow hover:opacity-90 transition-opacity" style={{ backgroundColor: '#305752' }}><Plus className="w-4 h-4" /> Add Brand</button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{editId ? 'Edit' : 'Create'} Brand</h2>
                    <form onSubmit={save} className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                                <input required placeholder="e.g. Dior" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#305752]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly) *</label>
                                <input required placeholder="dior" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#305752]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
                            <input
                                type="file"
                                id="brand-image-upload"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#305752]/10 file:text-[#305752]
                                hover:file:bg-[#305752]/20"
                            />
                            {form.cover_image && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                    <img src={form.cover_image} alt="Current" className="h-24 w-auto object-cover rounded shadow-sm" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                <input type="number" placeholder="0" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} className="w-24 px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#305752]" />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded text-[#305752] focus:ring-[#305752]" />
                                    Active (Visible on store)
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4 pt-4 border-t">
                            <button type="submit" className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#305752' }}>{editId ? 'Update Brand' : 'Create Brand'}</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="grid gap-4">
                {loading ? <div className="py-16 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#305752' }}></div></div>
                    : brands.length > 0 ? brands.map(b => (
                        <div key={b.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4 hover:border-gray-300 transition-colors">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                                {b.cover_image ? <img src={b.cover_image} alt={b.name} className="w-full h-full object-cover" /> : <Layers className="w-6 h-6 text-gray-300" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-800 text-lg">{b.name}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.is_active ? 'Active' : 'Hidden'}</span>
                                </div>
                                <p className="text-sm text-gray-500 font-mono mt-0.5">/{b.slug}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-400 mr-4 bg-gray-50 px-3 py-1 rounded-md">Order: {b.sort_order}</div>
                            <div className="flex gap-2">
                                <button onClick={() => edit(b)} className="p-2 text-gray-500 hover:text-[#305752] hover:bg-[#305752]/10 rounded-lg transition-colors" title="Edit Brand"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => del(b.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Brand"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )) : <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300"><Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-semibold text-gray-900 mb-1">No brands found</h3><p className="text-gray-500 mb-4">Get started by creating your first brand.</p><button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', slug: '', cover_image: '', sort_order: 0, is_active: true }); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#305752' }}><Plus className="w-4 h-4" /> Add Brand</button></div>}
            </div>
        </div>
    );
}
