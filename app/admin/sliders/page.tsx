'use client';
import { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Edit, Trash2, GripVertical } from 'lucide-react';

interface SliderRow { id: string; title: string; subtitle: string; cta_text: string; cta_link: string; background_color: string; image_url: string; sort_order: number; is_active: boolean; }

export default function AdminSlidersPage() {
    const [sliders, setSliders] = useState<SliderRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', subtitle: '', cta_text: 'Shop Now', cta_link: '/shop', background_color: '#305752', image_url: '', sort_order: 0, is_active: true });

    const load = async () => { const r = await fetch('/api/admin/sliders'); setSliders(await r.json()); setLoading(false); };
    useEffect(() => { load(); }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageUrl = form.image_url;

        // Handle file upload
        const fileInput = (document.getElementById('slider-image-upload') as HTMLInputElement);
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
            title: form.title || 'Banner',
            subtitle: form.subtitle || 'Banner Subtitle',
            cta_text: form.cta_text || 'Shop Now',
            cta_link: form.cta_link || '/shop',
            background_color: form.background_color || '#ffffff',
            image_url: imageUrl,
            sort_order: form.sort_order,
            is_active: form.is_active
        };

        if (editId) await fetch(`/api/admin/sliders/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        else await fetch('/api/admin/sliders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

        setShowForm(false); setEditId(null); load();
    };

    const edit = (s: SliderRow) => { setEditId(s.id); setForm({ title: s.title, subtitle: s.subtitle, cta_text: s.cta_text, cta_link: s.cta_link, background_color: s.background_color, image_url: s.image_url, sort_order: s.sort_order, is_active: s.is_active }); setShowForm(true); };
    const del = async (id: string) => { if (!confirm('Delete this slider?')) return; await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' }); load(); };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Sliders</h1>
                <button onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', subtitle: '', cta_text: '', cta_link: '/shop', background_color: '#ffffff', image_url: '', sort_order: 0, is_active: true }); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium" style={{ backgroundColor: '#305752' }}><Plus className="w-4 h-4" /> Add Slider</button>
            </div>
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{editId ? 'Edit' : 'Create'} Slider</h2>
                    <form onSubmit={save} className="grid grid-cols-1 gap-4">

                        {/* Hidden fields / Auto-filled defaults */}
                        <input type="hidden" value={form.title} />
                        <input type="hidden" value={form.subtitle} />
                        <input type="hidden" value={form.cta_text} />
                        <input type="hidden" value={form.background_color} />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slider Image (1920x1080 recommended)</label>
                            <input
                                type="file"
                                id="slider-image-upload"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100"
                            />
                            {form.image_url && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                    <img src={form.image_url} alt="Current" className="h-24 w-auto object-cover rounded shadow-sm" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Where clicking takes the user)</label>
                            <input required placeholder="/shop" value={form.cta_link} onChange={e => setForm({ ...form, cta_link: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900" />
                        </div>

                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                <input type="number" placeholder="0" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} className="w-24 px-3 py-2 border rounded-lg text-sm text-gray-900" />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded text-green-600 focus:ring-green-500" />
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button type="submit" className="px-6 py-2 rounded-lg text-white" style={{ backgroundColor: '#305752' }}>{editId ? 'Update' : 'Create'}</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg text-gray-700">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
            <div className="grid gap-4">
                {loading ? <div className="py-16 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#305752' }}></div></div>
                    : sliders.length > 0 ? sliders.map(s => (
                        <div key={s.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
                            <div className="w-24 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: s.background_color }}>
                                {s.image_url ? <img src={s.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-white/50" /></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-800 truncate">{s.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{s.is_active ? 'Active' : 'Hidden'}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{s.subtitle}</p>
                            </div>
                            <div className="text-sm text-gray-400 mr-2">#{s.sort_order}</div>
                            <div className="flex gap-1">
                                <button onClick={() => edit(s)} className="p-2 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => del(s.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )) : <div className="py-16 text-center text-gray-400"><ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" /><p className="text-lg font-medium">No sliders yet</p></div>}
            </div>
        </div>
    );
}
