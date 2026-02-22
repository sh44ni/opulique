'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { ProductVariant } from '@/types';

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState<{ id: string, name: string, slug: string }[]>([]);

    useEffect(() => {
        fetch('/api/admin/brands')
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.error('Failed to load brands', err));
    }, []);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        brand: initialData?.brand || '',
        sku: initialData?.sku || '',
        category: initialData?.category || '',
        price: initialData?.price || '',
        original_price: initialData?.original_price || '',
        description: initialData?.description || '',
        status: initialData?.status || 'active',
        stock: initialData?.stock !== undefined ? Number(initialData.stock) : 1,
        is_visible: initialData?.is_visible !== undefined ? Boolean(initialData.is_visible) : true,
        images: initialData?.images || [] as string[],
        variants: initialData?.variants || [] as ProductVariant[],
    });

    const [newVariantColor, setNewVariantColor] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Main Images Handlers ---
    const handleAddMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setLoading(true);
        const files = Array.from(e.target.files);
        try {
            const uploadPromises = files.map(async (file) => {
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                if (!res.ok) throw new Error('Upload failed');
                const data = await res.json();
                return data.url;
            });
            const newUrls = await Promise.all(uploadPromises);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload main images');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMainImage = (imageToRemove: string) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((i: string) => i !== imageToRemove) }));
    };

    // --- Variant Handlers ---
    const handleAddVariant = () => {
        if (newVariantColor && !formData.variants.some((v: ProductVariant) => v.color.toLowerCase() === newVariantColor.toLowerCase())) {
            setFormData(prev => ({
                ...prev,
                variants: [...prev.variants, { color: newVariantColor, images: [] }]
            }));
            setNewVariantColor('');
        }
    };

    const handleRemoveVariant = (index: number) => {
        setFormData(prev => {
            const newVariants = [...prev.variants];
            newVariants.splice(index, 1);
            return { ...prev, variants: newVariants };
        });
    };

    const handleAddVariantImage = async (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setLoading(true);
        const files = Array.from(e.target.files);
        try {
            const uploadPromises = files.map(async (file) => {
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                if (!res.ok) throw new Error('Upload failed');
                const data = await res.json();
                return data.url;
            });
            const newUrls = await Promise.all(uploadPromises);

            setFormData(prev => {
                const newVariants = [...prev.variants];
                // Ensure we don't exceed 5 images
                const existingImages = newVariants[variantIndex].images || [];
                const combinedImages = [...existingImages, ...newUrls].slice(0, 5);
                newVariants[variantIndex] = { ...newVariants[variantIndex], images: combinedImages };
                return { ...prev, variants: newVariants };
            });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload variant images');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveVariantImage = (variantIndex: number, imageToRemove: string) => {
        setFormData(prev => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                images: newVariants[variantIndex].images.filter((img: string) => img !== imageToRemove)
            };
            return { ...prev, variants: newVariants };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Generate slug if empty
        let currentSlug = formData.slug;
        if (!currentSlug) {
            currentSlug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            setFormData(prev => ({ ...prev, slug: currentSlug }));
        }

        try {
            const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
            const method = isEdit ? 'PUT' : 'POST';

            const payload = { ...formData, slug: currentSlug };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let errMsg = `Server error ${res.status}`;
                try {
                    const errBody = await res.json();
                    errMsg = errBody?.error || errMsg;
                } catch { }
                throw new Error(errMsg);
            }

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'New Product'}</h1>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                    style={{ backgroundColor: '#305752' }}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Product
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Brand</label>
                                <select
                                    name="brand"
                                    required
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent bg-white"
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="Auto-generated if empty"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Main Product Images</h2>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleAddMainImage}
                                />
                                <div className="flex flex-col items-center justify-center pointer-events-none">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">Click to upload main images</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                            </div>
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {formData.images.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 p-2">
                                            <img src={img} alt="" className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMainImage(img)}
                                                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Color Variants</h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="E.g. Navy Blue"
                                value={newVariantColor}
                                onChange={(e) => setNewVariantColor(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200 text-sm flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Color
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.variants.map((variant: ProductVariant, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-gray-700">Color: {variant.color}</h3>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariant(index)}
                                            className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Upload button for this variant */}
                                        <div className="relative">
                                            <button type="button" className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 font-medium">
                                                Upload variant images (Max 5)
                                            </button>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="absolute inset-0 w-32 h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleAddVariantImage(index, e)}
                                                disabled={variant.images.length >= 5}
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {variant.images.map((img: string, imgIdx: number) => (
                                                <div key={imgIdx} className="relative group w-16 h-16 bg-white rounded border border-gray-200 p-1">
                                                    <img src={img} alt="" className="w-full h-full object-contain" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariantImage(index, img)}
                                                        className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-100 text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {variant.images.length === 0 && (
                                                <p className="text-xs text-gray-400 py-2">No images uploaded for this color.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {formData.variants.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No variants added yet. Add a color to start.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Pricing & Inventory</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price (OMR)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                step="0.001"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Original Price (Optional)</label>
                            <input
                                type="number"
                                name="original_price"
                                step="0.001"
                                value={formData.original_price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Stock (total quantity)</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent"
                            />
                            {formData.stock === 0 && (
                                <p className="text-xs text-red-500 font-medium">⚠ Out of stock</p>
                            )}
                        </div>

                        {/* Visibility Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Visible on Website</p>
                                <p className="text-xs text-gray-500">{formData.is_visible ? 'Shown to customers' : 'Hidden from customers'}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, is_visible: !prev.is_visible }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_visible ? 'bg-[#305752]' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.is_visible ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#305752] focus:border-transparent bg-white"
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="sold">Sold</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
