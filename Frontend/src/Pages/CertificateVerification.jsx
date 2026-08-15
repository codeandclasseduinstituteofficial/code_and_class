import React, { useState } from 'react';
import { FaUser, FaBook, FaCalendarAlt, FaShieldAlt, FaSearch, FaIdBadge } from 'react-icons/fa';
import { BsCheckCircleFill, BsExclamationTriangleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import instance from '../utils/axios';

const CertificateVerification = () => {
  const [certNumber, setCertNumber] = useState('');
  const [certDetails, setCertDetails] = useState(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchCertificate = async () => {
    if (!certNumber.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://codeandclass.onrender.com/api"}/certificates/${encodeURIComponent(
          certNumber.toUpperCase()
        )}`
      );

      if (!response.ok) {
        throw new Error("Certificate not found");
      }

      const data = await response.json();

      setHasSearched(true);

      if (data && data.name) {
        setCertDetails(data);
        setError("");
      } else {
        setCertDetails(null);
        setError("No certificate found with this number.");
      }
    } catch (err) {
      console.error(err);
      setHasSearched(true);
      setCertDetails(null);
      setError("No certificate found with this number.");
    } finally {
      setLoading(false);
    }
  };

  const isVerified = certDetails?.status === 'Verified';

  return (
    <div className="bg-slate-50 min-h-screen px-4 md:px-10 lg:px-20 py-16 relative top-16">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-100 flex items-center justify-center">
            <FaIdBadge className="text-2xl text-brand-600" />
          </div>
          <h1 className="section-heading mb-2">Certificate Verification</h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
            Officially verify the authenticity of a Code and Class certificate using the certificate number issued to the student.
          </p>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-8">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Certificate Number
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchCertificate();
                }}
                placeholder="e.g. CNC2024XXXX"
                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono text-sm"
              />
            </div>
            <button
              onClick={handleSearchCertificate}
              disabled={loading || !certNumber.trim()}
              className="btn-primary sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            The certificate number is printed on the top-left corner of the certificate document.
          </p>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
            <BsExclamationTriangleFill className="text-red-500 text-lg mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-700 text-sm">Verification Failed</p>
              <p className="text-red-600 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Result — official document style */}
        {certDetails && !loading && (
          <div className="bg-white rounded-xl border-2 border-green-200 shadow-md overflow-hidden">
            {/* Status banner */}
            <div className={`px-6 py-4 flex items-center gap-3 ${isVerified ? 'bg-green-50' : 'bg-amber-50'}`}>
              {isVerified ? (
                <BsCheckCircleFill className="text-green-600 text-2xl shrink-0" />
              ) : (
                <BsExclamationTriangleFill className="text-amber-500 text-2xl shrink-0" />
              )}
              <div>
                <h2 className={`text-lg font-bold ${isVerified ? 'text-green-700' : 'text-amber-700'}`}>
                  {isVerified ? 'Certificate Verified' : 'Certificate Status: ' + certDetails?.status}
                </h2>
                <p className="text-xs text-slate-500">
                  This record was retrieved directly from Code and Class's official database.
                </p>
              </div>
            </div>

            {/* Details table */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaUser className="text-brand-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Student Name</p>
                    <p className="text-slate-900 font-semibold">{certDetails?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaBook className="text-brand-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Course</p>
                    <p className="text-slate-900 font-semibold">{certDetails?.course}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-brand-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Date of Completion</p>
                    <p className="text-slate-900 font-semibold">{certDetails?.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-brand-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Status</p>
                    <p
                      className={`font-bold ${certDetails?.status === 'Verified'
                        ? 'text-green-600'
                        : certDetails?.status === 'Pending'
                          ? 'text-amber-600'
                          : 'text-red-600'
                        }`}
                    >
                      {certDetails?.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-mono">
                  Certificate No: {certDetails?.certificate_no || certNumber.toUpperCase()}
                </p>
              </div>

              {isVerified && (
                <Link to={`/dashboard/certificate/${certDetails?.certificate_no}`}>
                  <button className="btn-primary w-full mt-2">Download Certificate PDF</button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Trust footer */}
        <div className="text-center mt-10">
          <p className="text-xs text-slate-400">
            For bulk verification requests (HR/university use), contact{' '}
            <Link to="/contact" className="text-brand-600 font-semibold hover:underline">
              our verification team
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;