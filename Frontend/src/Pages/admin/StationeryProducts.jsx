import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaGift, FaTag, FaBoxOpen, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthProvider';
import { authAxios } from '../../utils/authAxios';

const emptyForm = {
    name: '',
    description: '',
    image: '',
    category: '',
    price: '',
    oldPrice: '',
    stockQuantity: '',
};

// A small pill toggle used for the three admin-controlled switches:
// gift, in-stock and on-sale.
const ToggleChip = ({ label, active, onClick, Icon }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'
            }`}
    >
        <Icon size={12} /> {label}
    </button>
);

const StationeryProducts = () => {
    const { accessToken } = useContext(AuthContext);
    const api = authAxios(() => accessToken);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/stationery-products');
            setProducts(data);
        } catch (err) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.image || !formData.price) {
            toast.error('Name, image URL and price are required');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/stationery-products', {
                ...formData,
                price: Number(formData.price),
                oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
                stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : 0,
                inStock: formData.stockQuantity ? Number(formData.stockQuantity) > 0 : true,
            });
            toast.success('Product added successfully!');
            setFormData(emptyForm);
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error adding product');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleField = async (product, field) => {
        try {
            const { data } = await api.put(`/stationery-products/${product._id}`, {
                [field]: !product[field],
            });
            setProducts((prev) => prev.map((p) => (p._id === product._id ? data : p)));
        } catch (err) {
            toast.error('Could not update product');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product permanently?')) return;
        try {
            await api.delete(`/stationery-products/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            toast.success('Product deleted');
        } catch (err) {
            toast.error('Could not delete product');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 md:px-10 lg:px-20 py-12 relative top-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                        Stationery Products
                    </h1>
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="btn-primary"
                    >
                        {showForm ? <FaTimes /> : <FaPlus />} {showForm ? 'Close' : 'Add Product'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="card-surface p-6 mb-10 grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                            <input
                                name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-4 py-2 rounded-md border border-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                placeholder="e.g. Watercolour Pan Set, 24 Shades"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                            <textarea
                                name="description" value={formData.description} onChange={handleChange} rows={2}
                                className="w-full px-4 py-2 rounded-md border border-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                placeholder="Short description shown to customers"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                            <input
                                name="image" value={formData.image} onChange={handleChange} required
                                className="w-full px-4 py-2 rounded-md border border-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                            <input
                                name="category" value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border border-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                placeholder="e.g. Journaling"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Quantity</label>
                            <input
                                type="number" min="0" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border border-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                            <input
                                type="number" min="0" name="price" value={formData.price} onChange={handleChange} required
                                className="w-full px-4 py-2 rounded-md border border-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                placeholder="299"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Old Price (optional)</label>
                            <input
                                type="number" min="0" name="oldPrice" value={formData.oldPrice} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border border-slate-300 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                placeholder="499"
                            />
                        </div>

                        <div className="sm:col-span-2 flex justify-end">
                            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                                {submitting ? 'Adding…' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <p className="text-center text-slate-400">Loading products…</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-slate-400">No products yet — add your first one above.</p>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((p) => (
                            <div key={p._id} className="card-surface overflow-hidden">
                                <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">{p.category}</p>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="font-bold text-brand-600">₹{p.price}</span>
                                        {p.oldPrice > p.price && (
                                            <span className="text-xs text-slate-400 line-through">₹{p.oldPrice}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Stock: {p.stockQuantity}</p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <ToggleChip label="Gift" Icon={FaGift} active={p.isGift} onClick={() => toggleField(p, 'isGift')} />
                                        <ToggleChip label="On Sale" Icon={FaTag} active={p.onSale} onClick={() => toggleField(p, 'onSale')} />
                                        <ToggleChip label="In Stock" Icon={FaBoxOpen} active={p.inStock} onClick={() => toggleField(p, 'inStock')} />
                                    </div>

                                    <button
                                        onClick={() => deleteProduct(p._id)}
                                        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
                                    >
                                        <FaTrash size={11} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationeryProducts;
