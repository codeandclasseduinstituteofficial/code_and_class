import React, { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaGlobe, FaBuilding } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthProvider';
import instance from '../../utils/axios';
import { toast } from 'react-toastify';

/*
  Each tab config supports two shapes:

  1) "Simple" tabs (course / tuition / toss / homeschooling) — admin list,
     mark-paid, and delete all hit the SAME base endpoint:
       GET    {endpoint}
       PUT    {endpoint}/:id   (mark paid)
       DELETE {endpoint}/:id

  2) "Admin-namespaced" tabs (abroad) — list/mark-paid/delete live under
     an /admin sub-path with a different HTTP verb for mark-paid:
       GET    {endpoint}/admin/all
       PATCH  {endpoint}/admin/:id/mark-paid
       DELETE {endpoint}/admin/:id

  listEndpoint / markPaid / remove let each tab override the default
  "simple" behavior without branching all over the component.
*/
const TABS = [
  {
    key: 'course',
    label: 'Course Applications',
    endpoint: '/courseApplication',
  },
  {
    key: 'tuition',
    label: 'Tuition Applications',
    endpoint: '/tutionForm',
  },
  {
    key: 'toss',
    label: 'TOSS Applications',
    endpoint: '/tossApplication',
  },
  {
    key: 'homeschooling',
    label: 'Home Schooling Applications',
    endpoint: '/homeSchoolingApplication',
  },
  {
    key: 'abroad',
    label: 'Abroad Applications',
    endpoint: '/abroadApplication',
    listEndpoint: '/abroadApplication/admin/all',
    // this controller responds with { applications: [...] } instead of { data: [...] }
    dataKey: 'applications',
    markPaid: {
      method: 'patch',
      url: (id) => `/abroadApplication/admin/${id}/mark-paid`,
    },
    remove: {
      url: (id) => `/abroadApplication/admin/${id}`,
    },
  },
];

// Label for the tab-specific third column header
const THIRD_COLUMN_LABEL = {
  course: 'Course',
  toss: 'TOSS Level',
  tuition: 'Joining Date',
  homeschooling: 'Batch Timing',
  abroad: 'Country',
};

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
      const url = activeMeta.listEndpoint || activeMeta.endpoint;
      const { data } = await instance.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const key = activeMeta.dataKey || 'data';
      setApplications(data?.[key] || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    try {
      if (activeMeta.markPaid) {
        const { method, url } = activeMeta.markPaid;
        await instance[method](
          url(id),
          { paymentStatus: 'paid' },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        await instance.put(
          `${activeMeta.endpoint}/${id}`,
          { paymentStatus: 'paid' },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
      fetchApplications();
    } catch (err) {
      console.error('Failed to update payment status', err);
      toast.error('Could not update payment status.');
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      const url = activeMeta.remove
        ? activeMeta.remove.url(id)
        : `${activeMeta.endpoint}/${id}`;

      await instance.delete(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchApplications();
    } catch (err) {
      console.error('Failed to delete application', err);
      toast.error('Could not delete application.');
    }
  };

  // Resolve the primary name / sub-label shown in the first column
  const renderPrimaryColumn = (app) => {
    if (activeTab === 'homeschooling') {
      return (
        <>
          <p className="font-medium text-slate-800">{app.childName}</p>
          <p className="text-xs text-slate-400">
            Parent: {app.salutation} {app.parentName}
          </p>
        </>
      );
    }

    if (activeTab === 'abroad') {
      return (
        <>
          <p className="font-medium text-slate-800">{app.fullName}</p>
          <p className="text-xs text-slate-400">{app.qualification || '—'}</p>
        </>
      );
    }

    return (
      <>
        <p className="font-medium text-slate-800">
          {app.salutation} {app.studentName}
        </p>
        <p className="text-xs text-slate-400">{app.category}</p>
      </>
    );
  };

  // Resolve contact column (phone/email field names differ for abroad)
  const renderContactColumn = (app) => {
    if (activeTab === 'abroad') {
      return (
        <>
          <p>{app.phone}</p>
          <p className="text-xs text-slate-400">{app.email}</p>
        </>
      );
    }

    return (
      <>
        <p>{app.mobileNumber}</p>
        <p className="text-xs text-slate-400">{app.email}</p>
      </>
    );
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
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab.key
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
                  <th className="px-5 py-3 font-semibold">
                    {activeTab === 'homeschooling' ? 'Child' : 'Student'}
                  </th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">{THIRD_COLUMN_LABEL[activeTab]}</th>
                  <th className="px-5 py-3 font-semibold">Payment Mode</th>
                  <th className="px-5 py-3 font-semibold">Payment Status</th>
                  <th className="px-5 py-3 font-semibold">Submitted</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3">{renderPrimaryColumn(app)}</td>

                    <td className="px-5 py-3 text-slate-600">
                      {renderContactColumn(app)}
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {activeTab === 'course' && app.course}
                      {activeTab === 'toss' && app.tossLevel}
                      {activeTab === 'tuition' && (app.joiningDate ? new Date(app.joiningDate).toLocaleDateString('en-IN') : '—')}
                      {activeTab === 'homeschooling' && (app.preferredBatchTiming || '—')}
                      {activeTab === 'abroad' && (app.country || '—')}
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