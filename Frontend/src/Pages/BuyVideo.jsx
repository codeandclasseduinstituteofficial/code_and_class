import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import { authAxios } from "../utils/authAxios";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const BuyVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Only re-registers the interceptor when accessToken actually changes,
  // instead of on every render.
  const api = useMemo(() => authAxios(() => accessToken), [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        // Public endpoint — instance already has baseURL, so pass a relative path
        const res = await fetch(`${api.defaults.baseURL}/video/${id}`);
        const data = await res.json();

        if (!data.data) {
          setVideo(null);
          return;
        }

        if (!data.data.isPaid) {
          navigate(`/chapter-video/${id}`);
          return;
        }

        try {
          const accessRes = await api.get(`/purchase/access/${id}`);
          if (accessRes.data.hasAccess) {
            navigate(`/topic-video/${id}`);
            return;
          }
        } catch (err) {
          console.log("Access check failed:", err);
        }

        setVideo(data.data);
        setContentType(data.type);
      } catch (err) {
        console.log("Failed to load video:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, accessToken, navigate, api]);

  const handleBuy = async () => {
    setError("");
    setProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load the payment gateway. Check your connection and try again.");
        setProcessing(false);
        return;
      }

      let orderData;
      try {
        const orderRes = await api.post(`/payments/create-topic-order`, {
          contentId: id,
          contentType,
        });
        orderData = orderRes.data;
      } catch (err) {
        setError(err.response?.data?.message || "Could not start the payment.");
        setProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Code and Class",
        description: orderData.videoTitle || video?.name || video?.topicName,
        order_id: orderData.orderId,
        prefill: { name: user?.name || "" },
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          try {
            await api.post(`/payments/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate(`/topic-video/${id}`);
          } catch (err) {
            setError(
              err.response?.data?.message ||
              "Payment verification failed. Contact support if the amount was deducted."
            );
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError("Something went wrong starting the payment.");
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  if (!video) {
    return <div className="text-center py-20 text-red-500">Video not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10 mt-10 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
          <FaLock className="text-2xl text-orange-600" />
        </div>

        <h1 className="text-2xl font-bold text-center mt-5">
          {video.name || video.topicName}
        </h1>

        <p className="text-center text-gray-500 mt-2">{video.description}</p>

        <p className="text-center text-3xl font-bold text-indigo-600 mt-6">
          ₹{video.price}
        </p>

        <button
          onClick={handleBuy}
          disabled={processing}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <FaSpinner className="animate-spin" /> Processing…
            </>
          ) : (
            `Pay ₹${video.price} & Unlock`
          )}
        </button>

        {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default BuyVideo;