import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
// import instance from '../utils/axios';
import { authAxios } from '../utils/authAxios';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = ({ courseId,
  courseTitle,
  isOnlineCourse = false,
  courseType = null, }) => {
  const { accessToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const allowsModeChoice = courseType === 'online-offline';
  const [selectedMode, setSelectedMode] = useState(
    isOnlineCourse ? 'online' : 'offline'
  );


  const api = authAxios(() => accessToken);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken || !courseId) {
      setCheckingAccess(false);
      return;
    }
    const check = async () => {
      try {
        const { data } = await api.get(`/enrollments/check/${courseId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setEnrolled(data.enrolled);
      } catch (err) {
        console.error('Failed to check enrollment', err);
      } finally {
        setCheckingAccess(false);
      }
    };
    check();
  }, [accessToken, courseId]);

  const handleBuy = async () => {
    setError('');

    if (!accessToken) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Could not load the payment gateway. Check your connection and try again.');
        setProcessing(false);
        return;
      }

      const { data: orderData } = await api.post(
        '/payments/create-order',
        {
          courseId, isOnlineCourse: allowsModeChoice ? selectedMode === 'online' : isOnlineCourse
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Code and Class',
        description: orderData.courseTitle || courseTitle,
        order_id: orderData.orderId,
        prefill: {
          name: user?.name || '',
        },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            await api.post(
              '/payments/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setEnrolled(true);
          } catch (err) {
            setError(err?.response?.data?.message || 'Payment verification failed. Contact support if the amount was deducted.');
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong starting the payment.');
      setProcessing(false);
    }
  };

  if (checkingAccess) {
    return (
      <button disabled className="btn-outline w-full opacity-60 cursor-not-allowed">
        <FaSpinner className="animate-spin" /> Checking access…
      </button>
    );
  }

  if (enrolled) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
          <FaCheckCircle /> You're enrolled in this course
        </div>
        <button onClick={() => navigate('/user-dashboard')} className="btn-primary w-full">
          Go to My Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {allowsModeChoice && (
        <div className="flex gap-2 mb-1">
          <button
            type="button"
            onClick={() => setSelectedMode('offline')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${selectedMode === 'offline'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200'
              }`}
          >
            Offline
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode('online')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${selectedMode === 'online'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200'
              }`}
          >
            Online (+₹1000)
          </button>
        </div>
      )}
      <button onClick={handleBuy} disabled={processing} className="btn-primary w-full disabled:opacity-70">
        {processing ? (
          <>
            <FaSpinner className="animate-spin" /> Processing…
          </>
        ) : (
          <>
            <FaLock className="text-xs" /> Buy Now &amp; Enroll
          </>
        )}
      </button>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <p className="text-xs text-slate-400 text-center">Secure payments powered by Razorpay</p>
    </div>
  );
};

export default Checkout;
