import React, { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaGlobe, FaBuilding } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthProvider';
import instance from '../../utils/axios';
import { toast } from 'react-toastify';

const TABS = [
  { key: 'course', label: 'Course Applications', endpoint: '/courseApplication' },
  { key: 'tuition', label: 'Tuition Applications', endpoint: '/tutionForm' },
  { key: 'toss', label: 'TOSS Applications', endpoint: '/tossApplication' },
];

const Applications = () => {
  const { accessToken } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('course');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeMeta = TABS.find((t) => t.key === activeTab);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, accessToken]);

  const fetchApplications = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const { data } = await instance.get(activeMeta.endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setApplications(data?.data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await instance.put(
        `${activeMeta.endpoint}/${id}`,
        { paymentStatus: 'paid' },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchApplications();
    } catch (err) {
      console.error('Failed to update payment status', err);
      toast.error('Could not update payment status.');
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await instance.delete(`${activeMeta.endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchApplications();
    } catch (err) {
      console.error('Failed to delete application', err);
      toast.error('Could not delete application.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-10 lg:px-20 py-12 relative top-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-8">
          Applications
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading applications…</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-slate-400">No {activeMeta.label.toLowerCase()} yet.</p>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">
                    {activeTab === 'course' ? 'Course' : activeTab === 'toss' ? 'TOSS Level' : 'Joining Date'}
                  </th>
                  <th className="px-5 py-3 font-semibold">Payment Mode</th>
                  <th className="px-5 py-3 font-semibold">Payment Status</th>
                  <th className="px-5 py-3 font-semibold">Submitted</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{app.salutation} {app.studentName}</p>
                      <p className="text-xs text-slate-400">{app.category}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <p>{app.mobileNumber}</p>
                      <p className="text-xs text-slate-400">{app.email}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {activeTab === 'course' && app.course}
                      {activeTab === 'toss' && app.tossLevel}
                      {console.log(app)}
                      {activeTab === 'tuition' && (app.joiningDate ? new Date(app.joiningDate).toLocaleDateString('en-IN') : '—')}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        {app.paymentMode === 'online' ? <FaGlobe /> : <FaBuilding />}
                        {app.paymentMode === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {app.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                          <FaCheckCircle /> Paid
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                            <FaClock /> Pending
                          </span>
                          {app.paymentMode === 'offline' && (
                            <button
                              onClick={() => markPaid(app._id)}
                              className="text-xs font-semibold text-brand-600 hover:underline"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteApplication(app._id)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
