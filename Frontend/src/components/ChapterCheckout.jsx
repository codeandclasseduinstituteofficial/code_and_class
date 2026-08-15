import React, { useContext, useState } from 'react';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
import instance from '../utils/axios';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const ChapterCheckout = ({ lectureId, chapterId, chapterTitle, price, onUnlocked }) => {
  const { accessToken, user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleBuy = async () => {
    setError('');

    if (!accessToken) {
      window.location.href = '/login';
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

      const { data: orderData } = await instance.post(
        '/payments/create-chapter-order',
        { lectureId, chapterId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Code and Class',
        description: orderData.chapterTitle || chapterTitle,
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
            onUnlocked?.();
          } catch (err) {
            setError(err?.response?.data?.message || 'Payment verification failed. Contact support if the amount was deducted.');
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
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
        <FaLock className="text-2xl text-white" />
      </div>
      <p className="text-white font-semibold">This chapter is locked</p>
      <p className="text-slate-300 text-sm">Unlock "{chapterTitle}" for ₹{price}</p>
      <button
        onClick={handleBuy}
        disabled={processing}
        className="btn-primary disabled:opacity-70"
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin" /> Processing…
          </>
        ) : (
          `Unlock for ₹${price}`
        )}
      </button>
      {error && <p className="text-sm text-red-400 max-w-xs">{error}</p>}
    </div>
  );
};

export default ChapterCheckout;
