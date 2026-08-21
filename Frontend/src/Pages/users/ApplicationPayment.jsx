import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthProvider';
import instance from '../../utils/axios';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const typeLabels = {
  course: 'Course Application',
  tuition: 'Tuition Application',
  toss: 'TOSS Application',
  abroad: 'Abroad Study Application',
};

const ApplicationPayment = () => {
  const { type, id } = useParams();
  const { accessToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      // Online payment requires an account — send them to log in first,
      // the application itself was already saved with paymentMode: online.
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handlePay = async () => {
    setError('');
    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Could not load the payment gateway.');
        setProcessing(false);
        return;
      }

      const { data: orderData } = await instance.post(
        '/payments/create-application-order',
        { applicationType: type, applicationId: id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Code and Class',
        description: `${typeLabels[type] || 'Application'} Fee`,
        order_id: orderData.orderId,
        prefill: { name: user?.name || '' },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            await instance.post(
              '/payments/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setDone(true);
          } catch (err) {
            setError(err?.response?.data?.message || 'Verification failed. Contact support if the amount was deducted.');
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative top-16">
      <div className="card-surface max-w-md w-full p-8 text-center">
        {done ? (
          <>
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful</h1>
            <p className="text-slate-500 mb-6">
              Your {typeLabels[type] || 'application'} fee has been paid. We'll be in touch soon.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary w-full">
              Back to Home
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Complete Your {typeLabels[type] || 'Application'} Payment
            </h1>
            <p className="text-slate-500 mb-6">
              Your application has been submitted. Pay the application fee now to complete the process.
            </p>
            <button onClick={handlePay} disabled={processing} className="btn-primary w-full disabled:opacity-70">
              {processing ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing…
                </>
              ) : (
                'Pay Now'
              )}
            </button>
            {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationPayment;
