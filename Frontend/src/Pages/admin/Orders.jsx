import React, { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthProvider';
import instance from '../../utils/axios';

const statusStyles = {
  paid: { icon: <FaCheckCircle />, classes: 'text-green-700 bg-green-50 border-green-200' },
  created: { icon: <FaClock />, classes: 'text-amber-700 bg-amber-50 border-amber-200' },
  failed: { icon: <FaTimesCircle />, classes: 'text-red-700 bg-red-50 border-red-200' },
};

const Orders = () => {
  const { accessToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await instance.get('/payments', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchOrders();
  }, [accessToken]);

  const totalRevenuePaise = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-10 lg:px-20 py-12 relative top-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Orders</h1>
          <div className="card-surface px-5 py-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Total Revenue</p>
            <p className="text-xl font-bold text-brand-600">₹{(totalRevenuePaise / 100).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-slate-400">No orders yet.</p>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const style = statusStyles[o.status] || statusStyles.created;
                  return (
                    <tr key={o._id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{o.user?.name}</p>
                        <p className="text-xs text-slate-400">{o.user?.email}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-700">{o.course?.title}</td>
                      <td className="px-5 py-3 text-slate-700">₹{(o.amount / 100).toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-2.5 py-1 capitalize ${style.classes}`}>
                          {style.icon} {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
