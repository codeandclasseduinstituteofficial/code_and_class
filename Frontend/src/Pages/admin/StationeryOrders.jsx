import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaTruck, FaCheckCircle, FaClock, FaBoxOpen } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthProvider';
import { authAxios } from '../../utils/authAxios';

const statusStyles = {
    placed: { icon: <FaClock />, label: 'Placed', classes: 'text-amber-700 bg-amber-50 border-amber-200' },
    out_for_delivery: { icon: <FaTruck />, label: 'Out for delivery', classes: 'text-blue-700 bg-blue-50 border-blue-200' },
    delivered: { icon: <FaCheckCircle />, label: 'Delivered', classes: 'text-green-700 bg-green-50 border-green-200' },
};

const StationeryOrders = () => {
    const { accessToken } = useContext(AuthContext);
    const api = authAxios(() => accessToken);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/stationery-orders/admin/all');
            setOrders(data);
        } catch (err) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateStatus = async (order, status) => {
        setUpdatingId(order._id);
        try {
            const { data } = await api.patch(`/stationery-orders/admin/${order._id}/status`, { status });
            setOrders((prev) => prev.map((o) => (o._id === order._id ? data.order : o)));
            toast.success('Order status updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not update order status');
        } finally {
            setUpdatingId(null);
        }
    };

    const totalRevenue = orders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.amount, 0);

    return (
        <div className="min-h-screen bg-slate-50 px-4 md:px-10 lg:px-20 py-12 relative top-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Stationery Orders</h1>
                    <div className="card-surface px-5 py-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Collected Revenue</p>
                        <p className="text-xl font-bold text-brand-600">₹{(totalRevenue / 100).toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-slate-400">Loading orders…</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-slate-400">No orders placed yet.</p>
                ) : (
                    <div className="flex flex-col gap-5">
                        {orders.map((order) => {
                            const style = statusStyles[order.deliveryStatus] || statusStyles.placed;
                            return (
                                <div key={order._id} className="card-surface p-5">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-slate-800">{order.user?.name}</p>
                                            <p className="text-xs text-slate-400">{order.user?.email}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-2.5 py-1 ${style.classes}`}>
                                                {style.icon} {style.label}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500 capitalize">
                                                {order.paymentMode === 'offline' ? 'Cash on delivery' : 'Paid online'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Deliver to</p>
                                            <p className="text-sm text-slate-800">{order.shipping?.name} · {order.shipping?.phone}</p>
                                            <p className="text-sm text-slate-500 mt-0.5">{order.shipping?.address}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                                <FaBoxOpen size={11} /> Items
                                            </p>
                                            <ul className="text-sm text-slate-700 space-y-0.5">
                                                {order.items?.map((item, idx) => (
                                                    <li key={idx}>{item.name} × {item.quantity} — ₹{item.price * item.quantity}</li>
                                                ))}
                                            </ul>
                                            <p className="mt-1.5 text-sm font-semibold text-slate-900">
                                                Total: ₹{(order.amount / 100).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        {order.deliveryStatus === 'placed' && (
                                            <button
                                                onClick={() => updateStatus(order, 'out_for_delivery')}
                                                disabled={updatingId === order._id}
                                                className="btn-outline text-sm disabled:opacity-60"
                                            >
                                                Mark Out for Delivery
                                            </button>
                                        )}
                                        {order.deliveryStatus === 'out_for_delivery' && (
                                            <button
                                                onClick={() => updateStatus(order, 'delivered')}
                                                disabled={updatingId === order._id}
                                                className="btn-primary text-sm disabled:opacity-60"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                        {order.deliveryStatus === 'delivered' && (
                                            <span className="text-sm font-semibold text-green-700">
                                                Delivered {order.deliveredAt ? `on ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}` : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationeryOrders;
