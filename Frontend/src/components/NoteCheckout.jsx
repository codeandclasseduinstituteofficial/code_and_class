import React, { useContext, useState } from 'react';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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

const NoteCheckout = ({ noteId, noteTitle, price, onUnlocked }) => {
  const { accessToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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
        setError('Could not load the payment gateway.');
        setProcessing(false);
        return;
      }

      const { data: orderData } = await instance.post(
        '/payments/create-note-order',
        { noteId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Code and Class',
        description: orderData.noteTitle || noteTitle,
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
    <div className="w-full flex flex-col items-center gap-2">
      <button
        onClick={handleBuy}
        disabled={processing}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-70"
      >
        {processing ? <FaSpinner className="animate-spin" /> : <FaLock className="text-sm" />}
        {processing ? 'Processing…' : `Unlock for ₹${price}`}
      </button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default NoteCheckout;
